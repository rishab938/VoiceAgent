from fastapi import APIRouter, UploadFile, File, HTTPException
from app.voice.stt import speech_to_text
from app.voice.tts import text_to_speech
from app.core.agent import run_agent
import shutil
import os

router = APIRouter()


@router.post("/voice")
async def voice_chat(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    audio_path = f"temp_{file.filename}"

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = speech_to_text(audio_path)
        response = run_agent(text)
        audio_output = await text_to_speech(response)
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

    return {
        "input_text": text,
        "response_text": response,
        "audio_file": audio_output
    }