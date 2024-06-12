from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware


from app.api.api import api_router
from app.core.config import settings
from app.message_utils import configure_scheduler

if settings.SECRET_KEY == "":
    raise HTTPException(
        status_code=500,
        detail="SECRET_KEY environment variable not set",
    )

app = FastAPI()

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    # currently allow all origins, can set up settings.BACKEND_CORS_ORIGINS
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_STR)

# Start the scheduler
if __name__ == "__main__":
    scheduler = configure_scheduler()
    scheduler.start()