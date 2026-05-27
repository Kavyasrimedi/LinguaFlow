// ── Tab switching ──────────────────────────────────────
function showTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById("tab-" + name).classList.add("active");
  event.target.classList.add("active");

  if (name === "history") loadHistory();
}

// ── Character counter ──────────────────────────────────
document.getElementById("inputText").addEventListener("input", function () {
  document.getElementById("charCount").textContent = this.value.length;
});

// ── Clear input ────────────────────────────────────────
function clearInput() {
  document.getElementById("inputText").value = "";
  document.getElementById("charCount").textContent = "0";
  document.getElementById("outputText").textContent = "Translation will appear here…";
  document.getElementById("detected-lang").textContent = "—";
  document.getElementById("errorBox").style.display = "none";
}

// ── Translate ──────────────────────────────────────────
async function doTranslate() {
  const text = document.getElementById("inputText").value.trim();
  const destLang = document.getElementById("destLang").value;
  const btn = document.getElementById("translateBtn");
  const errorBox = document.getElementById("errorBox");

  // clear previous error
  errorBox.style.display = "none";

  if (!text) {
    showError("Please enter some text first.");
    return;
  }

  // loading state
  btn.textContent = "Translating…";
  btn.disabled = true;

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, dest_lang: destLang })
    });

    const data = await res.json();

    if (data.error) {
      showError(data.error);
    } else {
      document.getElementById("outputText").textContent = data.translated;
      document.getElementById("detected-lang").textContent = data.src_lang.toUpperCase();
    }

  } catch (err) {
    showError("Could not reach the server. Is Flask running?");
  } finally {
    btn.textContent = "Translate";
    btn.disabled = false;
  }
}

// ── Error display ──────────────────────────────────────
function showError(msg) {
  const box = document.getElementById("errorBox");
  box.textContent = msg;
  box.style.display = "block";
}

// ── Copy to clipboard ──────────────────────────────────
document.getElementById("copyBtn").addEventListener("click", () => {
  const text = document.getElementById("outputText").textContent;
  if (!text || text === "Translation will appear here…") return;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById("statusMsg").textContent = "Copied!";
    setTimeout(() => document.getElementById("statusMsg").textContent = "", 2000);
  });
});

// ── Text to Speech ─────────────────────────────────────
const ttsBtn = document.getElementById("ttsBtn");
let isSpeaking = false;

ttsBtn.addEventListener("click", () => {
  const text = document.getElementById("outputText").textContent;
  if (!text || text === "Translation will appear here…") return;

  // If already speaking, stop it
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    ttsBtn.textContent = "🔊";
    return;
  }

  const lang = document.getElementById("destLang").value;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  utterance.onend = () => {
    isSpeaking = false;
    ttsBtn.textContent = "🔊";
  };

  utterance.onerror = () => {
    isSpeaking = false;
    ttsBtn.textContent = "🔊";
  };

  // Warn if no voice available for this language
const availableVoices = window.speechSynthesis.getVoices();
const hasVoice = availableVoices.some(v => v.lang.startsWith(lang.split("-")[0]));

if (!hasVoice) {
  document.getElementById("statusMsg").textContent = "⚠️ No voice available for this language on your device.";
  setTimeout(() => document.getElementById("statusMsg").textContent = "", 3000);
  return;
}

  window.speechSynthesis.speak(utterance);
  isSpeaking = true;
  ttsBtn.textContent = "⏹️";
});
// ── Speech to Text ─────────────────────────────────────
const micBtn = document.getElementById("micBtn");
let recognizing = false;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    document.getElementById("inputText").value = event.results[0][0].transcript;
    document.getElementById("charCount").textContent =
      document.getElementById("inputText").value.length;
    recognizing = false;
    micBtn.textContent = "🎤";
  };

  recognition.onerror = () => {
    showError("Microphone access denied or not supported.");
    recognizing = false;
    micBtn.textContent = "🎤";
  };

  recognition.onend = () => {
    recognizing = false;
    micBtn.textContent = "🎤";
  };

  micBtn.addEventListener("click", () => {
    if (recognizing) {
      recognition.stop();
    } else {
      recognition.start();
      recognizing = true;
      micBtn.textContent = "🔴";
    }
  });

} else {
  micBtn.addEventListener("click", () => {
    showError("Speech recognition not supported in this browser. Try Chrome.");
  });
}

// ── Translation History ────────────────────────────────
async function loadHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "Loading…";

  try {
    const res = await fetch("/api/history");
    const data = await res.json();

    if (data.length === 0) {
      list.innerHTML = "<p class='empty'>No translations yet.</p>";
      return;
    }

    list.innerHTML = data.map(item => `
      <div class="history-item">
        <div class="history-langs">${item.src_lang.toUpperCase()} → ${item.dest_lang.toUpperCase()}</div>
        <div class="history-texts">
          <span class="history-input">${item.input_text}</span>
          <span class="history-arrow">→</span>
          <span class="history-output">${item.output_text}</span>
        </div>
        <div class="history-time">${item.timestamp}</div>
      </div>
    `).join("");

  } catch (err) {
    list.innerHTML = "<p class='empty'>Could not load history.</p>";
  }
}

// ── Translate on Ctrl+Enter ────────────────────────────
document.getElementById("inputText").addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") doTranslate();
});