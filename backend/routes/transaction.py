from http import HTTPStatus

from fastapi import APIRouter, Depends, Request
from sqlmodel import Session

import backend.services.transactions as transaction_service
from backend.core.response import public_api_responses
from backend.db.database import get_read_db

router = APIRouter()


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
    data.get("transaction_id")
    data.get("status")

    return {"status": "OK"}
