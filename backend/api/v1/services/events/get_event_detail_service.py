from sqlmodel import Session, and_, case, exists, func, select, update

import backend.api.v1.services.tickets as tickets_service
from backend.core.constants import (
    FollowEntityCode,
    TagAssociationEntityCode,
    TransactionStatusCode,
)
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import (
    Answer,
    Bookmark,
    Event,
    Organization,
    Question,
    Survey,
    Tag,
    Ticket,
    User,
)
from backend.models.follow import Follow
from backend.models.tag_association import TagAssociation
from backend.models.transaction import Transaction
from backend.schemas.answer import AnswerItem
from backend.schemas.survey import SurveyDetail
from backend.utils.database import fetch_one


async def get_event_detail(db: Session, current_user: User, slug: str):
    event = fetch_one(db, select(Event).where(Event.slug == slug))

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    OrganizationEventFollowCount = (
        select(
            Organization.id,
            func.count(Event.id.distinct()).label("organization_event_number"),
            func.count(Follow.follower_id.distinct()).label(
                "organization_follower_number"
            ),
        )
        .outerjoin(Event, Event.organization_id == Organization.id)
        .outerjoin(
            Follow,
            and_(
                Follow.following_id == Organization.id,
                Follow.entity_code == FollowEntityCode.ORGANIZATION,
            ),
        )
        .where(Event.published_at.isnot(None))
        .group_by(Organization.id)
        .subquery()
    )

    SoldTicketsNumber = tickets_service.get_sold_tickets_number_query(
        event_id=event["id"], user_id=None
    )

    query = (
        select(
            *Event.__table__.columns,
            Organization.name.label("organization_name"),
            Organization.address.label("organization_address"),
            Organization.hp_url.label("organization_url"),
            Organization.contact_email.label("organization_contact_email"),
            Organization.contact_url.label("organization_contact_url"),
            Organization.avatar_url.label("organization_avatar_url"),
            Organization.description.label("organization_description"),
            OrganizationEventFollowCount.c.organization_event_number,
            OrganizationEventFollowCount.c.organization_follower_number,
            SoldTicketsNumber.c.sold_tickets_number,
        )
        .where(
            Event.slug == slug,
            Event.published_at.isnot(None),
        )
        .join(Organization, Event.organization_id == Organization.id)
        .join(
            OrganizationEventFollowCount,
            OrganizationEventFollowCount.c.id == Organization.id,
        )
        .outerjoin(SoldTicketsNumber, SoldTicketsNumber.c.event_id == Event.id)
    )

    if current_user:
        query = query.add_columns(
            case(
                (
                    current_user and Follow.follower_id == current_user.id,
                    True,
                ),
                else_=False,
            ).label("is_organization_followed"),
        ).outerjoin(
            Follow,
            and_(
                Follow.following_id == Organization.id,
                Follow.follower_id == (current_user.id if current_user else None),
            ),
        )

    event = db.exec(query).mappings().one_or_none()
    event = dict(event)

    event.update(
        {
            "survey": (
                _get_survey_detail(db, event["survey_id"])
                if event["survey_id"]
                else None
            ),
            "tickets": _get_tickets(db, event["id"]),
            "organization_contact_url": event["organization_contact_url"],
            "tags": _get_event_tags(db, event["id"]),
        }
    )

    if current_user:
        is_bookmarked = db.exec(
            select(
                exists().where(
                    Bookmark.user_id == current_user.id,
                    Bookmark.event_id == event["id"],
                )
            )
        ).first()
        event["is_bookmarked"] = is_bookmarked

    try:
        db.exec(
            update(Event)
            .where(Event.id == event["id"])
            .values(view_number=event["view_number"] + 1)
        )
        db.commit()
        event["view_number"] += 1
        return event

    except Exception as e:
        db.rollback()
        raise e


def _get_tickets(db: Session, event_id: int):
    tickets = (
        db.exec(
            select(
                Ticket.id,
                Ticket.name,
                func.greatest(
                    (Ticket.quantity - func.sum(Transaction.quantity)), 0
                ).label("remain"),
                Ticket.quantity,
                Ticket.description,
                Ticket.price,
                Ticket.expired_at,
                Ticket.type,
                Ticket.status,
                Ticket.sales_start_at,
                Ticket.sales_end_at,
                Ticket.delivery_method,
                Ticket.is_refundable,
            )
            .where(
                Ticket.event_id == event_id,
            )
            .outerjoin(
                Transaction,
                and_(
                    Transaction.ticket_id == Ticket.id,
                    Transaction.status == TransactionStatusCode.SUCCESS,
                ),
            )
            .order_by(Ticket.id)
            .group_by(Ticket.id)
        )
        .mappings()
        .all()
    )

    return tickets


def _get_event_tags(db: Session, event_id: int):
    event_tags = db.exec(
        select(
            Tag.id,
            Tag.image_url,
            Tag.name,
        )
        .join(TagAssociation, Tag.id == TagAssociation.tag_id)
        .where(
            TagAssociation.entity_id == event_id,
            TagAssociation.entity_code == TagAssociationEntityCode.EVENT,
        )
    ).all()

    return event_tags


def _get_survey_detail(db: Session, survey_id: int):
    survey = db.get(Survey, survey_id)

    questions = db.exec(
        select(Question)
        .where(Question.survey_id == survey_id)
        .order_by(Question.order_number)
    ).fetchall()

    question_answers = _get_question_answers(db, questions)
    return SurveyDetail(
        id=survey_id,
        name=survey.name,
        description=survey.description,
        status_code=survey.status_code,
        question_anwers=question_answers,
        start_at=survey.start_at,
        end_at=survey.end_at,
        max_response_number=survey.max_response_number,
    )


def _get_question_answers(db: Session, questions: list[Question]):
    question_answers = {}
    for question in questions:
        question_answers[question.id] = question.__dict__

    question_ids = list(question_answers.keys())

    answers = db.exec(
        select(Answer)
        .where(Answer.question_id.in_(question_ids))
        .order_by(Answer.order_number)
    ).fetchall()

    for answer in answers:
        question_id = answer.question_id
        if "answers" not in question_answers[question_id]:
            question_answers[question_id]["answers"] = []
        question_answers[question_id]["answers"].append(
            AnswerItem(
                id=answer.id,
                question_id=answer.question_id,
                answer=answer.answer,
                order_number=answer.order_number,
            )
        )

    return list(question_answers.values())
