from fastapi import APIRouter, FastAPI
from fastapi.routing import APIRoute
from backend.api.v1.audience.routes import audience_routers


api_router = APIRouter()


api_router.include_router(audience_routers)


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
