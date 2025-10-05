from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.db import Base, engine
from app.config.settings import settings

from app.routers.product_router import product

app = FastAPI(title="Finexus API")

origins = [
    "http://localhost:4200",   # Angular local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],        # Métodos permitidos: GET, POST, PUT, DELETE...
    allow_headers=["*"],        # Headers permitidos: Authorization, Content-Type...
)



Base.metadata.create_all(bind=engine)

app.include_router(product, prefix=settings.PREFIX_API)