# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, dashboard, ml, ai
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinSight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(ml.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "Welcome to FinSight API"}
