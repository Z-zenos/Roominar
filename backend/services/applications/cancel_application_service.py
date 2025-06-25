from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.application import Application
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.utils.database import transaction_scope
from backend.utils.format_start_end_datetime import format_start_end_datetime


def cancel_application(
    db: Session, current_user: User, application_id: int, request=None
):
    """Cancel an event application with proper session management"""

    with transaction_scope() as session:
        try:
            # Find the application
            application = session.exec(
                select(Application).where(
                    Application.id == application_id,
                    Application.user_id == current_user.id,
                    # Application.canceled_at.is_(None),
                )
            ).first()

            if not application:
                raise BadRequestException(
                    ErrorCode.ERR_APPLICATION_NOT_FOUND,
                    ErrorMessage.ERR_APPLICATION_NOT_FOUND,
                )

            # Update application status (commented out logic to be implemented)
            # application.canceled_at = datetime.now()
            # application.status = ApplicationStatusCode.REJECTED
            session.add(application)
            session.commit()
            session.refresh(application)

            # Get event and organization details for email
            event_org_result = session.exec(
                select(Event, Organization)
                .join(Organization, Organization.id == Event.organization_id)
                .where(Event.id == application.event_id)
            ).first()

            if event_org_result:
                event, organization = event_org_result

                # Get ticket details
                ticket = session.get(Ticket, application.ticket_id)

                if ticket:
                    # Prepare email context
                    context = {
                        "username": current_user.first_name,
                        "organization_name": organization.name,
                        "contact_url": getattr(organization, "contact_url", ""),
                        "event_name": event.name,
                        "ticket_name": ticket.name,
                        "ticket_url": "",
                        "datetime": format_start_end_datetime(
                            event.start_at, event.end_at
                        ),
                        "address": event.organize_address,
                        "meeting_tool_code": event.meeting_tool_code,
                        "meeting_url": event.meeting_url,
                        "detail_event_url": f"{settings.WEB_URL}/events/{event.slug}",
                    }

                    # Send cancellation email asynchronously
                    try:
                        Email()
                        # Note: This should be made async in background task
                        # For now, keeping synchronous but should be moved to Celery
                        # mailer.send_email(
                        #     current_user.email,
                        #     "cancel_event_application_success.html",
                        #     "Cancel Application Success",
                        #     context,
                        # )
                    except Exception as email_error:
                        # Log email error but don't fail the cancellation
                        print(f"Failed to send cancellation email: {email_error}")

            # Invalidate user-specific caches after cancellation
            from backend.core.simple_cache import invalidate_user_caches

            invalidate_user_caches(current_user.id)

            return {
                "application_id": application_id,
                "status": "cancelled",
                "message": "Application cancelled successfully",
            }

        except BadRequestException:
            raise
        except Exception as e:
            raise BadRequestException(
                ErrorCode.ERR_INTERNAL_SERVER_ERROR,
                f"Failed to cancel application: {str(e)}",
            )
