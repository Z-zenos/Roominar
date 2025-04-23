from sqlmodel import Session, select

from backend.models.answer import Answer
from backend.models.question import Question
from backend.models.survey import Survey
from backend.schemas.answer import AnswerItem
from backend.schemas.survey import SurveyDetail


def get_survey_detail(db: Session, survey_id: int):
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
