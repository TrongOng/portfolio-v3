import httpx
from typing import Any, List, Tuple, Optional
from math import ceil
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

class RecaptchaRequest(BaseModel):
    recaptchaToken: str

async def verify_recaptcha(recaptchaToken: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": settings.RECAPTCHA_SECRET, "response": recaptchaToken}
        )
        result = response.json()
        if not result.get("success"):
            raise HTTPException(status_code=400, detail="Invalid reCAPTCHA. Please try again.")

@router.post("/verify-recaptcha")
async def verify_recaptcha_endpoint(data: RecaptchaRequest):
    await verify_recaptcha(data.recaptchaToken)
    return {"success": True}