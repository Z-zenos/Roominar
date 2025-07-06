from http import HTTPStatus

from fastapi import APIRouter, Depends, Request
from sqlmodel import Session

import backend.services.transactions as transaction_service
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import authorize_role
from backend.models.user import User
from backend.schemas.transaction import (
    GetTransactionStatusCountsResponse,
    ListingMyTransactionsQueryParams,
    ListingMyTransactionsResponse,
)

router = APIRouter()


@router.post(
    "/webhook",
    status_code=HTTPStatus.NO_CONTENT,
    responses=public_api_responses,
)
async def handle_transaction(
    db: Session = Depends(get_read_db),
    request: Request = None,
):
    return await transaction_service.handle_transaction(db, request)


@router.get(
    "/my-transactions",
    response_model=ListingMyTransactionsResponse,
    responses=authenticated_api_responses,
)
async def listing_my_transactions(
    db: Session = Depends(get_read_db),
    user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    query_params: ListingMyTransactionsQueryParams = Depends(
        ListingMyTransactionsQueryParams
    ),
):
    transactions, total = await transaction_service.listing_my_transactions(
        db, user, query_params
    )
    return ListingMyTransactionsResponse(
        data=transactions,
        total=total,
        page=query_params.page,
        per_page=query_params.per_page,
    )


@router.get(
    "/my-transactions/status-counts",
    response_model=GetTransactionStatusCountsResponse,
    responses=authenticated_api_responses,
)
async def get_transaction_status_counts(
    db: Session = Depends(get_read_db),
    user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
):
    return await transaction_service.get_transaction_status_counts(db, user)
