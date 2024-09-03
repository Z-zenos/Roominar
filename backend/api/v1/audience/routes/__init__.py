from fastapi import APIRouter

from .applications import router as application_router
from .auth import router as auth_router
from .events import router as event_router
from .organizations import router as organization_router
from .tags import router as tag_router

# from .tags import router as tag_router
# from .tickets import router as ticket_router
from .users import router as user_router

audience_routers = APIRouter()

audience_routers.include_router(auth_router, prefix="/auth", tags=["auth"])
# audience_routers.include_router(tag_router, prefix="/tags", tags=["tag"])
audience_routers.include_router(event_router, prefix="/events", tags=["events"])
audience_routers.include_router(tag_router, prefix="/tags", tags=["tags"])
audience_routers.include_router(
    application_router, prefix="/applications", tags=["applications"]
)
audience_routers.include_router(user_router, prefix="/users", tags=["users"])
audience_routers.include_router(
    organization_router, prefix="/organizations", tags=["organizations"]
)
# audience_routers.include_router(ticket_router, prefix="/tickets", tags=["tickets"])
