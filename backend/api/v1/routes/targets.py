from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.targets as targets_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import RoleCode, User
from backend.schemas.target import CreateTargetRequest, ListingTargetOptionsItem

router = APIRouter()


# @router.get(
#     "",
#     response_model=ListingTargetsResponse,
#     responses=authenticated_api_responses,
# )
# def listing_targets(
#     db: Session = Depends(get_db),
#     user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
#     query_params: Annotated[ListTargetsParam, Depends(ListTargetsParam)] = None,
# ):
#     response = targets_service.listing_targets(db, user, query_params)
#     return ListingTargetsResponse(**response)


@router.post("", response_model=int, responses=authenticated_api_responses)
async def create_target(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: CreateTargetRequest = None,
):
    return await targets_service.create_target(db, organizer, request)


@router.get("/options", response_model=list[ListingTargetOptionsItem])
async def listing_target_options(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
):
    return await targets_service.listing_target_options(db, organizer)


# @router.get(
#     "/{target_id}",
#     response_model=GetTargetResponse,
#     responses=authenticated_api_responses,
# )
# def get_target(
#     target_id: Annotated[int, Path(...)],
#     db: Annotated[Session, Depends(get_db)],
#     organizer: Annotated[User, Depends(authorize_role(RoleCode.ORGANIZER))] = None,
# ):
#     return targets_service.get_target(db, organizer, target_id)


# @router.put(
#     "/{target_id}",
#     response_model=int,
#     responses=authenticated_api_responses,
# )
# def update_target(
#     target_id: Annotated[int, Path(...)],
#     request: Annotated[UpdateTargetRequest, Body(...)],
#     db: Annotated[Session, Depends(get_db)],
#     organizer: Annotated[User, Depends(authorize_role(RoleCode.ORGANIZER))] = None,
# ):
#     return targets_service.update_target(db, organizer, request, target_id)


# @router.delete(
#     "/{target_id}",
#     status_code=HTTPStatus.NO_CONTENT,
#     responses=authenticated_api_responses,
# )
# def delete_target(
#     target_id: Annotated[int, Path(...)],
#     db: Annotated[Session, Depends(get_db)],
#     organizer: Annotated[User, Depends(authorize_role(RoleCode.ORGANIZER))],
# ):
#     return targets_service.delete_target(db, organizer, target_id)
