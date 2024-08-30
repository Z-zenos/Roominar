from sqlmodel import Session, and_, exists, func, select

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


def get_event_detail(db: Session, current_user: User, slug: str):
    query = (
        select(
            Event,
            Organization.name,
            Organization.address,
            Organization.hp_url,
            Organization.contact_email,
            Questionnaire.name,
            Questionnaire.id,
            Organization.contact_url,
        )
        .where(
            Event.slug == slug,
            Event.public_at.isnot(None),
        )
        .join(Organization, Event.organization_id == Organization.id)
        .outerjoin(Questionnaire, Event.questionnaire_id == Questionnaire.id)
    )
    result = db.exec(query).first()

    if not result:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    event_id = result[0].id

    (
        event,
        organization_name,
        organization_address,
        organization_hp_url,
        organization_contact_email,
        questionnaire_name,
        questionnaire_id,
        organization_contact_url,
    ) = result
    event_detail = event.__dict__

    event_detail.update(
        {
            "organization_name": organization_name,
            "organization_address": organization_address,
            "organization_url": organization_hp_url,
            "organization_contact_email": organization_contact_email,
            "questionnaire": _get_questionnaire_detail(
                db, questionnaire_id, questionnaire_name
            ),
            "tickets": _get_tickets(db, event_id),
            "organization_contact_url": organization_contact_url,
            "applied_number": _get_applied_number(db, event_id),
            "tags": _get_event_tags(db, event_id),
        }
    )

    if current_user:
        is_bookmarked = db.exec(
            select(
                exists().where(
                    Bookmark.user_id == current_user.id,
                    Bookmark.event_id == event_id,
                )
            )
        ).first()
        event_detail["is_bookmarked"] = is_bookmarked
    return event_detail


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
                and_(
                    Application.ticket_id == Ticket.id,
                    Application.canceled_at.is_(None),
                ),
            )
            .where(Ticket.event_id == event_id)
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
        select(Question).where(Question.questionnaire_id == questionnaire_id)
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
        select(Answer).where(Answer.question_id.in_(question_ids))
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
