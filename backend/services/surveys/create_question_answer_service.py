from sqlmodel import Session

from backend.models.answer import Answer
from backend.models.question import Question
from backend.schemas.survey import CreateQuestionAnswerRequest
from backend.utils.database import save


async def create_question_answer(
    db: Session, question_answers: CreateQuestionAnswerRequest, survey_id: int
):
    answers = []

    for qa in question_answers:
        question = Question(
            survey_id=survey_id,
            question=qa.question,
            type_code=qa.type_code,
            order_number=qa.order_number,
        )

        question = save(db, question)

        answers.extend(
            [
                Answer(
                    question_id=question.id,
                    answer=answer.answer,
                    order_number=answer.order_number,
                    is_correct=answer.is_correct,
                )
                for answer in qa.answers
            ]
        )

    db.bulk_insert_mappings(Answer, answers)
    db.flush()
