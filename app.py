from flask import Flask, render_template, request, jsonify
from utils.translator import detect_language, translate_text
from utils.database import init_db, save_translation, get_history

app = Flask(__name__)

init_db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text","").strip()
    dest_lang = data.get("dest_lang","en")

    if not text:
        return {"error": "No text provided , Please enter some text"}, 400

    src_lang = detect_language(text)

    if src_lang == "unknown":
        return jsonify({"error": "Could not detect language"}), 400
    
    result = translate_text(text, dest_lang)

    save_translation(text, result, src_lang, dest_lang)

    return jsonify({
    "translated": result,
    "src_lang": src_lang
})

@app.route("/api/history", methods=["GET"])
def history():
    return jsonify(get_history())



if __name__ == "__main__":
    app.run(debug=True)