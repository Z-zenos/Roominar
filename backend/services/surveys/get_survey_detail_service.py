from sqlmodel import Session, select

from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.answer import Answer
from backend.models.question import Question
from backend.models.survey import Survey
from backend.schemas.answer import AnswerItem
from backend.schemas.survey import SurveyDetail
from backend.utils.database import transaction_scope


@cached_response(
    cache_key="surveys:detail",
    ttl=600,  # 10 minutes for survey data
    include_params=True,
)
def get_survey_detail(db: Session, survey_id: int):
    """Get survey detail with questions and answers, with caching"""

    with transaction_scope() as session:
        # Get survey
        survey = session.get(Survey, survey_id)

        if not survey:
            raise ValueError("Survey not found")

        # Get questions for the survey
        questions = session.exec(
            select(Question)
            .where(Question.survey_id == survey_id)
            .order_by(Question.order_number)
        ).all()

        # Build question-answer structure
        question_answers = _get_question_answers(session, questions)

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
    """Build question-answer structure from questions list"""

    if not questions:
        return []

    # Build question dictionary
    question_answers = {}
    for question in questions:
        question_dict = {
            "id": question.id,
            "survey_id": question.survey_id,
            "question": question.question,
            "question_type": question.question_type,
            "order_number": question.order_number,
            "is_required": question.is_required,
            "answers": [],
        }
        question_answers[question.id] = question_dict

    # Get all answers for these questions
    question_ids = list(question_answers.keys())

    answers = db.exec(
        select(Answer)
        .where(Answer.question_id.in_(question_ids))
        .order_by(Answer.order_number)
    ).all()

    # Group answers by question
    for answer in answers:
        question_id = answer.question_id
        if question_id in question_answers:
            question_answers[question_id]["answers"].append(
                AnswerItem(
                    id=answer.id,
                    question_id=answer.question_id,
                    answer=answer.answer,
                    order_number=answer.order_number,
                )
            )

    return list(question_answers.values())
