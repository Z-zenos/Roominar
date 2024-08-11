from fastapi import APIRouter

# from .application import router as application_router
from .auth import router as auth_router
# from .events import router as event_router
# from .tags import router as tag_router
# from .tickets import router as ticket_router
# from .user import router as user_router

audience_routers = APIRouter()

audience_routers.include_router(auth_router, prefix='/auth', tags=["auth"])
# audience_routers.include_router(tag_router, prefix="/tags", tags=["tag"])
# audience_routers.include_router(event_router, prefix="/events", tags=["event"])
# audience_routers.include_router(
#     application_router, prefix="/applications", tags=["application"]
# )
# audience_routers.include_router(user_router, prefix="/users", tags=["user"])
# audience_routers.include_router(ticket_router, prefix="/tickets", tags=["tickets"])
