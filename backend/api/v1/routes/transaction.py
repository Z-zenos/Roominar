from http import HTTPStatus

from fastapi import APIRouter, Depends, Request
from sqlmodel import Session

import backend.api.v1.services.transactions as transaction_service
from backend.core.kafka_client import get_kafka_producer
from backend.core.response import public_api_responses
from backend.db.database import get_read_db

router = APIRouter()


producer = get_kafka_producer()


@router.post(
    "/webhook",
    status_code=HTTPStatus.NO_CONTENT,
    responses=public_api_responses,
)
async def handle_application_transaction(
    db: Session = Depends(get_read_db),
    request: Request = None,
):
    return await transaction_service.handle_application_transaction(db, request)


@router.post("/webhook/payment")
async def payment_webhook(request: Request = None):
    data = await request.json()
    transaction_id = data.get("transaction_id")
    status = data.get("status")

    if transaction_id:
        producer.send(
            "payment_status", {"transaction_id": transaction_id, "status": status}
        )

    return {"status": "OK"}
