from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.seed import seed
from app.routers import path, lessons, attempts, stats, leaderboard

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="Duolingo Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(path.router, prefix="/api/v1", tags=["path"])
app.include_router(lessons.router, prefix="/api/v1", tags=["lessons"])
app.include_router(attempts.router, prefix="/api/v1", tags=["attempts"])
app.include_router(stats.router, prefix="/api/v1", tags=["stats"])
app.include_router(leaderboard.router, prefix="/api/v1", tags=["leaderboard"])


@app.get("/")
def root():
    return {"message": "Duolingo Clone API", "docs": "/docs"}
