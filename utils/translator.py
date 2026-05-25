from deep_translator import GoogleTranslator
from langdetect import detect

def detect_language(text):
    try:
        return detect(text)
    except:
        return "unknown"

def translate_text(text, dest_lang):
    try:
        result = GoogleTranslator(source="auto", target=dest_lang).translate(text)
        return result
    except Exception as e:
        return f"Error: {e}"