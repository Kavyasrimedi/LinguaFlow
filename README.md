# LinguaFlow — Multilingual Translator

A full-stack web application that translates text across 100+ languages with automatic language detection, speech input/output, and translation history.

Built with Flask, Python, and Vanilla JavaScript.

---

## Features

- **Text Translation** — Translate between 100+ languages instantly
- **Auto Language Detection** — Detects source language automatically
- **Speech to Text** — Speak into the microphone, text fills automatically
- **Text to Speech** — Listen to the translated output
- **Copy to Clipboard** — One-click copy of translation
- **Translation History** — All translations saved and viewable
- **Responsive Design** — Works on mobile and desktop
- **Keyboard Shortcut** — `Ctrl + Enter` to translate

---

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend  | Python, Flask                   |
| Database | SQLite                          |
| NLP      | deep-translator, langdetect     |
| Speech   | Web Speech API (browser-native) |

---

## Project Structure

```
translator/
│
├── app.py                  ← Flask routes and app entry point
├── requirements.txt        ← Python dependencies
├── README.md
│
├── utils/
│   ├── __init__.py
│   ├── translator.py       ← Translation logic
│   ├── detector.py         ← Language detection logic
│   └── database.py         ← SQLite save/fetch functions
│
├── templates/
│   └── index.html          ← Frontend UI
│
├── static/
│   ├── css/style.css       ← Styling
│   └── js/script.js        ← Frontend logic
│
└── database/
    └── translations.db     ← Auto-created on first run
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Kavyasrimedi/linguaflow.git
cd linguaflow
```

### 2. Create and activate virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the app

```bash
python app.py
```

Open your browser and go to: `http://127.0.0.1:5000`

---

## API Endpoints

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/`              | Serves the main UI                 |
| POST   | `/api/translate` | Translates text, saves to database |
| GET    | `/api/history`   | Returns last 50 translations       |

### POST `/api/translate`

**Request body:**

```json
{
  "text": "Hello world",
  "dest_lang": "hi"
}
```

**Response:**

```json
{
  "translated": "हैलो वर्ल्ड",
  "src_lang": "en"
}
```

---

## Deployment

### Deploy on Render (Free)

1. Push your project to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Add `gunicorn` to your `requirements.txt`
6. Click **Deploy**

> Note: SQLite data resets on Render free tier restarts. For persistent storage, switch to PostgreSQL.

---

## Screenshots

> Add screenshots here after deployment.

---

## Author

Your Name — [GitHub](https://github.com/Kavyasrimedi) · [LinkedIn](https://www.linkedin.com/in/kavya-sri-medi-58a878320/)
