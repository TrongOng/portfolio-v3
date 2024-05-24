from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    admin,
    profile,
    message
)


api_router = APIRouter()
api_router.include_router(auth.router, tags=["Auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Only"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(message.router, prefix="/message", tags=["Message"])