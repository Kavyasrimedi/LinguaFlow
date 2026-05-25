import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "translations.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS translations (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            input_text  TEXT NOT NULL,
            output_text TEXT NOT NULL,
            src_lang    TEXT NOT NULL,
            dest_lang   TEXT NOT NULL,
            timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_translation(input_text, output_text, src_lang, dest_lang):
    conn = get_connection()
    conn.execute(
        "INSERT INTO translations (input_text, output_text, src_lang, dest_lang) VALUES (?, ?, ?, ?)",
        (input_text, output_text, src_lang, dest_lang)
    )
    conn.commit()
    conn.close()

def get_history(limit=50):
    conn = get_connection()
    cursor = conn.execute(
        "SELECT * FROM translations ORDER BY id DESC LIMIT ?", (limit,)
    )
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows