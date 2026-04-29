from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.agent import run_agent
from app.routes.voice_routes import router as voice_router
from app.routes.data_routes import router as data_router

# ✅ CREATE APP FIRST
app = FastAPI()

# ✅ THEN middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ THEN static files
app.mount("/audio", StaticFiles(directory="."), name="audio")

# ✅ THEN routers
app.include_router(voice_router)
app.include_router(data_router)

# ✅ THEN endpoints
@app.get("/")
def root():
    return {"message": "Voice Agent Running"}

@app.get("/chat")
def chat(q: str):
    response = run_agent(q)
    return {"response": response}