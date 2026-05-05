from fastapi import APIRouter, UploadFile, File, HTTPException
from app.voice.stt import speech_to_text
from app.voice.tts import text_to_speech
from app.core.agent import run_agent
import shutil
import os
import base64

router = APIRouter()


@router.post("/voice")
async def voice_chat(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    audio_path = f"temp_{file.filename}"
    audio_output = None

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = speech_to_text(audio_path)
        response = run_agent(text)
        audio_output = await text_to_speech(response)
        
        with open(audio_output, "rb") as audio_file:
            encoded_audio = base64.b64encode(audio_file.read()).decode("utf-8")
            
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)
        if audio_output and os.path.exists(audio_output):
            os.remove(audio_output)

    return {
        "input_text": text,
        "response_text": response,
        "audio_base64": encoded_audio
    }