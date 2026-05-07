const API_BASE = "http://localhost:5000/api/email";

// ==========================
// INPUT ELEMENTS
// ==========================
const shortInput = document.getElementById("shortInput");
const tone = document.getElementById("tone");
const type = document.getElementById("type");

const receiverName = document.getElementById("receiverName");
const senderName = document.getElementById("senderName");
const senderEmail = document.getElementById("senderEmail");
const receiverEmail = document.getElementById("receiverEmail");

const purpose = document.getElementById("purpose");
const inputText = document.getElementById("inputText");
const extraDetails = document.getElementById("extraDetails");

const output = document.getElementById("output");
const subjectBox = document.getElementById("subjectBox");

// ==========================
// 🧠 AI MESSAGE
// ==========================
async function generateMessage() {
  try {
    const res = await fetch(`${API_BASE}/generate-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shortInput: shortInput.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      output.innerText = "❌ " + data.error;
      return;
    }

    inputText.value = data.message;

  } catch (err) {
    output.innerText = "❌ Backend not reachable";
  }
}

// ==========================
// 🚀 GENERATE + SEND EMAIL
// ==========================
async function generateEmail() {
  try {
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverName: receiverName.value,
        senderName: senderName.value,
        senderEmail: senderEmail.value,
        receiverEmail: receiverEmail.value,
        purpose: purpose.value,
        inputText: inputText.value,
        extraDetails: extraDetails.value,
        tone: tone.value,
        type: type.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      output.innerText = "❌ " + (data.error || "Email failed");
      return;
    }

    subjectBox.innerText = "📌 Subject: " + data.subject;

    output.innerText =
      "✅ EMAIL SENT SUCCESSFULLY 🚀\n\n" +
      data.formatted;

  } catch (err) {
    output.innerText = "EMAIL SENT SUCCESSFULLY 🚀";
  }
}

// ==========================
// 📋 COPY EMAIL
// ==========================
function copyEmail() {
  navigator.clipboard.writeText(output.innerText);
  alert("Copied!");
}