from fastapi import FastAPI
from .routers import medic, auth, prescriptii, comenzi
from .database import engine
from .models import Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mediportal-haven.lovable.app"],            # or a list of allowed origins
    allow_credentials=True,
    allow_methods=["GET", "POST","PUT","DELETE","OPTIONS"],            # or specific ["GET", "POST", ...]
    allow_headers=["*"],            # or specific headers
)

app.include_router(medic.router)
app.include_router(auth.router)
app.include_router(prescriptii.router)
app.include_router(comenzi.router)
@app.get("/")
async def root ():
    print('main')
    return {"message": "Version 1.2.11"}

