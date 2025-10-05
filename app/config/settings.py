from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Variables de entorno para DB
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_NAME: str
    DB_PORT: int

    # JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_HOURS: int

    PREFIX_API: str

    class Config:
        env_file = ".env"

    @property
    def DATABASE_URL(self) -> str:
        
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()
