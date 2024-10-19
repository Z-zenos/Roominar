from fastapi import APIRouter, FastAPI
from fastapi.routing import APIRoute

from .applications import router as application_router
from .auth import router as auth_router
from .events import router as event_router
from .organizations import router as organization_router
from .surveys import router as survey_router
from .tags import router as tag_router
from .targets import router as target_router
from .tickets import router as ticket_router
from .users import router as user_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(event_router, prefix="/events", tags=["events"])
api_router.include_router(tag_router, prefix="/tags", tags=["tags"])
api_router.include_router(
    application_router, prefix="/applications", tags=["applications"]
)
api_router.include_router(user_router, prefix="/users", tags=["users"])
api_router.include_router(
    organization_router, prefix="/organizations", tags=["organizations"]
)
api_router.include_router(survey_router, prefix="/surveys", tags=["surveys"])
api_router.include_router(target_router, prefix="/targets", tags=["targets"])
api_router.include_router(ticket_router, prefix="/tickets", tags=["tickets"])


def use_route_names_as_operation_ids(app: FastAPI) -> None:
    """
    Simplify operation IDs so that generated API clients have simpler function
    names.

    Should be called only after all routes have been added.
    """
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name  # in this case, 'read_items'


use_route_names_as_operation_ids(api_router)
