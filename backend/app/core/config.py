import os
from dotenv import load_dotenv
from pydantic.networks import AnyHttpUrl
from typing import List, Union



from pydantic import BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


load_dotenv()


class Settings(BaseSettings):
    # API information
    API_VERSION: str = "v1"
    API_STR: str = "/api/" + API_VERSION
    SECRET_KEY: str = os.getenv("SECRET_KEY")

    # project information
    PROJECT_NAME: str = "Trong's Website"
    COMPANY_ADDRESS: str = "Youngstown, OH"
    SUPPORT_EMAIL: EmailStr = "trong@trongong.com"

    # 60 minutes * 24 hours * 30 days = 30 days
    # 60 minutes * 24 hours * 8 days = 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 24

    FIRST_SUPERUSER: EmailStr = os.getenv("FIRST_SUPERUSER")
    FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD")

    SQLALCHEMY_DATABASE_URL: str = os.getenv("DATABASE_URL")

    POSTMARK_TOKEN: str = os.getenv("POSTMARK_TOKEN")

    RECAPTCHA_SECRET: str = os.getenv("RECAPTCHA_SECRET")

    # Use to define origins if not allowing all
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = os.getenv("BACKEND_CORS_ORIGINS")

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

settings = Settings()