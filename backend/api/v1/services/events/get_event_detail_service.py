from sqlmodel import Session, exists, func, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import (
    Answer,
    Application,
    Bookmark,
    Event,
    EventTag,
    Organization,
    Question,
    Questionnaire,
    Tag,
    Ticket,
    User,
)
from backend.schemas.answer import AnswerItem
from backend.schemas.questionnaire import QuestionnaireDetail


async def get_event_detail(db: Session, current_user: User, slug: str):
    event = (
        db.exec(
            select(
                *Event.__table__.columns,
                Organization.name.label("organization_name"),
                Organization.address.label("organization_address"),
                Organization.hp_url.label("organization_url"),
                Organization.contact_email.label("organization_contact_email"),
                Organization.contact_url.label("organization_contact_url"),
                Organization.avatar_url.label("organization_avatar_url"),
                Organization.description.label("organization_description"),
                Questionnaire.name.label("questionnaire_name"),
            )
            .where(
                Event.slug == slug,
                Event.public_at.isnot(None),
            )
            .join(Organization, Event.organization_id == Organization.id)
            .outerjoin(Questionnaire, Event.questionnaire_id == Questionnaire.id)
        )
        .mappings()
        .one_or_none()
    )

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )
    event = dict(event)

    event.update(
        {
            "questionnaire": _get_questionnaire_detail(
                db, event["questionnaire_id"], event["questionnaire_name"]
            ),
            "tickets": _get_tickets(db, event["id"]),
            "organization_contact_url": event["organization_contact_url"],
            "applied_number": _get_applied_number(db, event["id"]),
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
                func.greatest((Ticket.quantity - func.count(Application.id)), 0).label(
                    "remain"
                ),
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
            .outerjoin(
                Application,
                Application.ticket_id == Ticket.id,
            )
            .where(
                Ticket.event_id == event_id,
                Application.canceled_at.is_(None),
            )
            .order_by(Ticket.id)
            .group_by(Ticket.id)
        )
        .mappings()
        .all()
    )

    return tickets


def _get_applied_number(db: Session, event_id: int):
    applied_number = db.scalar(
        select(func.count()).where(
            Application.event_id == event_id, Application.canceled_at.is_(None)
        )
    )
    return applied_number


def _get_event_tags(db: Session, event_id: int):
    event_tags = db.exec(
        select(
            Tag.id,
            Tag.image_url,
            Tag.name,
        )
        .join(EventTag, Tag.id == EventTag.tag_id)
        .where(EventTag.event_id == event_id)
    ).all()

    return event_tags


def _get_questionnaire_detail(
    db: Session, questionnaire_id: int, questionnaire_name: str
):
    questions = db.exec(
        select(Question)
        .where(Question.questionnaire_id == questionnaire_id)
        .order_by(Question.order_number)
    ).fetchall()

    question_answer = _get_questions_answer(db, questions)
    return QuestionnaireDetail(
        id=questionnaire_id,
        name=questionnaire_name,
        question_anwers=question_answer,
    )


def _get_questions_answer(db: Session, questions: list[Question]):
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
