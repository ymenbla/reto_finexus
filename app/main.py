from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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



