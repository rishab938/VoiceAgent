import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.agent import run_agent
from app.routes.voice_routes import router as voice_router
from app.routes.data_routes import router as data_router

app = FastAPI()

# ✅ CORS: Unified app on same origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API ROUTES (Checked First)
app.include_router(voice_router)
app.include_router(data_router)

@app.get("/chat")
def chat(q: str):
    response = run_agent(q)
    return {"response": response}

# ✅ STATIC ASSETS (Audio)
app.mount("/audio", StaticFiles(directory="."), name="audio")

# ✅ FRONTEND (Served Last)
# This serves static assets (JS, CSS) from the dist folder
if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

# ✅ CATCH-ALL ROUTE (For React SPA Navigation)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # If the request is for an API or asset, it would have been caught above.
    # Otherwise, serve index.html for all routes (Landing, Agent, etc.)
    index_path = os.path.join("dist", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Frontend build not found. Please run 'npm run build'"}