from flask import Flask, render_template, request, jsonify
from utils.translator import detect_language, translate_text

app = Flask(__name__)

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

    return jsonify({
    "translated": result,
    "src_lang": src_lang
})



if __name__ == "__main__":
    app.run(debug=True)