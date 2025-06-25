from sqlmodel import Session

import backend.services.applications as applications_service
import backend.services.auth.token_service as token_service
from backend.background_tasks.transaction_tasks import process_transaction
from backend.core.constants import PaymentMethodCode, UserActionTypeCode
from backend.models.application import Application
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.transaction import TransactionStatusCode
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.application import CreateApplicationRequest
from backend.utils.database import transaction_scope


def create_free_application(
    db: Session,
    current_user: User,
    create_application_request: CreateApplicationRequest,
):
    """Create a free event application with proper session management"""

    with transaction_scope() as session:
        try:
            event_id = create_application_request.event_id

            # Validate application and tickets
            result = applications_service.validate_application_tickets(
                session, current_user.id, create_application_request, True
            )
            tickets = result["tickets"]
            total_requested_quantity = result["total_requested_quantity"]
            application = result["application"]
            event = result["event"]

            # Create Application if it doesn't exist
            if not application:
                application = Application(
                    event_id=event_id,
                    user_id=current_user.id,
                    email=create_application_request.email,
                    first_name=create_application_request.first_name,
                    last_name=create_application_request.last_name,
                    workplace_name=create_application_request.workplace_name,
                    phone=create_application_request.phone,
                    industry_code=(
                        create_application_request.industry_code
                        if create_application_request.industry_code
                        else None
                    ),
                    job_type_code=(
                        create_application_request.job_type_code
                        if create_application_request.job_type_code
                        else None
                    ),
                    created_by=current_user.id,
                    updated_by=current_user.id,
                )
                session.add(application)
                session.commit()
                session.refresh(application)

            # Handle survey responses
            if create_application_request.survey_response_results:
                survey_responses = [
                    SurveyResponseResult(
                        event_id=event_id,
                        application_id=application.id,
                        email=create_application_request.email,
                        question_id=srr["question_id"],
                        answers_ids=srr["answers_ids"],
                        answer_text=srr.get("answer_text"),
                        created_by=current_user.id,
                        updated_by=current_user.id,
                    )
                    for srr in create_application_request.survey_response_results
                ]

                user_action = UserAction(
                    user_id=current_user.id,
                    event_id=event_id,
                    organization_id=event["organization_id"],
                    action_type=UserActionTypeCode.ANSWER_APPLICATION_SURVEY,
                    created_by=current_user.id,
                    updated_by=current_user.id,
                )

                # Save survey responses and user action
                for response in survey_responses:
                    session.add(response)
                session.add(user_action)
                session.commit()

            # Generate payment session token
            session_token = token_service.gen_payment_session_token(
                0, current_user.id, TransactionStatusCode.PENDING
            )

            # Invalidate user-specific caches after creating application
            from backend.core.simple_cache import invalidate_user_caches

            invalidate_user_caches(current_user.id)

            # Use Celery to process the application asynchronously
            process_transaction.delay(
                event_id=event_id,
                user_id=current_user.id,
                application_id=application.id,
                ticket_ids=[ticket["id"] for ticket in tickets],
                total_requested_quantity=total_requested_quantity,
                total_amount=0.0,  # Free application, no amount
                payment_method_code=PaymentMethodCode.FREE,
            )

            return session_token

        except Exception as e:
            raise e
