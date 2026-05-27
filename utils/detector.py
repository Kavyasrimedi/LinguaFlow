from langdetect import detect, LangDetectException

# Human-readable names for language codes
LANG_NAMES = {
    "en": "English", "hi": "Hindi", "fr": "French", "de": "German",
    "es": "Spanish", "zh-cn": "Chinese (Simplified)", "zh-tw": "Chinese (Traditional)",
    "ar": "Arabic", "ja": "Japanese", "ko": "Korean", "pt": "Portuguese",
    "ru": "Russian", "it": "Italian", "nl": "Dutch", "tr": "Turkish",
    "pl": "Polish", "sv": "Swedish", "no": "Norwegian", "da": "Danish",
    "fi": "Finnish", "uk": "Ukrainian", "cs": "Czech", "ro": "Romanian",
    "hu": "Hungarian", "id": "Indonesian", "ms": "Malay", "th": "Thai",
    "vi": "Vietnamese", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
    "mr": "Marathi", "ur": "Urdu", "gu": "Gujarati", "kn": "Kannada",
    "ml": "Malayalam", "pa": "Punjabi", "af": "Afrikaans", "bg": "Bulgarian",
    "ca": "Catalan", "hr": "Croatian", "et": "Estonian", "el": "Greek",
    "he": "Hebrew", "lv": "Latvian", "lt": "Lithuanian", "sr": "Serbian",
    "sk": "Slovak", "sl": "Slovenian", "sw": "Swahili", "tl": "Filipino",
    "cy": "Welsh",
}

def detect_language(text: str) -> str:
    """
    Detect the language of the given text.
    Returns the language code (e.g. 'en') or 'unknown'.
    """
    try:
        return detect(text)
    except LangDetectException:
        return "unknown"

def get_language_name(code: str) -> str:
    """Return a human-readable name for a language code."""
    return LANG_NAMES.get(code, code.upper())