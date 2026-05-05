import edge_tts
import uuid


async def text_to_speech(text: str):
    output_path = f"response_{uuid.uuid4().hex}.mp3"

    communicate = edge_tts.Communicate(
        text,
        voice="en-US-AriaNeural"
    )

    await communicate.save(output_path)
    return output_path