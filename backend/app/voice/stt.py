from faster_whisper import WhisperModel

model = WhisperModel("medium")


def speech_to_text(audio_path: str) -> str:
    segments, _ = model.transcribe(audio_path, language="en")
    text = ""
    for segment in segments:
        text += segment.text
    return text.strip()