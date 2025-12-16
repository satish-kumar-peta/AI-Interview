from fastapi import FastAPI, UploadFile, File
import whisper
import tempfile
import os

app = FastAPI()

model = whisper.load_model("base")  # base is balanced

@app.post("/stt")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        result = model.transcribe(tmp_path)
        os.remove(tmp_path)

        return {"text": result["text"]}

    except Exception as e:
        return {"error": str(e)}
