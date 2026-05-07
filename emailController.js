const nodemailer = require("nodemailer");

let history = [];

// 🧠 AUTO SUBJECT GENERATOR
function generateSubject(inputText, purpose) {
  if (purpose && purpose.trim() !== "") return purpose;

  const text = (inputText || "").toLowerCase();

  if (text.includes("leave")) return "Leave Request";
  if (text.includes("intern")) return "Internship Application";
  if (text.includes("complaint")) return "Complaint Regarding Issue";
  if (text.includes("assignment")) return "Request for Extension";
  if (text.includes("research")) return "Research Inquiry";

  return "General Request";
}

// 📧 EMAIL SENDER FUNCTION (🔥 REQUIRED)
async function sendEmail(receiverEmail, subject, message) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: receiverEmail,
    subject: subject,
    text: message
  });
}

// 🧠 SHORT MESSAGE GENERATOR
exports.generateMessage = async (req, res) => {
  try {
    const { shortInput = "" } = req.body;

    const message = `
I am writing regarding: ${shortInput}.
I kindly request your attention and support on this matter.
`;

    res.json({ message });

  } catch (err) {
    res.status(500).json({ error: "Message generation failed" });
  }
};

// 📧 MAIN EMAIL FUNCTION (FIXED + SEND EMAIL)
exports.generateEmail = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);

    const {
      inputText,
      senderName = "Student",
      senderEmail = "student@email.com",
      receiverName = "Sir/Madam",
      receiverEmail,   // 🔥 REQUIRED
      purpose = "",
      extraDetails = "",
      tone = "formal",
      type = "General"
    } = req.body;

    if (!inputText || inputText.trim() === "") {
      return res.status(400).json({ error: "inputText is required" });
    }

    if (!receiverEmail) {
      return res.status(400).json({ error: "receiverEmail is required" });
    }

    // 🔥 AUTO SUBJECT
    const subject = generateSubject(inputText, purpose);

    const formatted = `
Subject: ${subject}

Dear ${receiverName},

${inputText}

${extraDetails ? "Additional Details: " + extraDetails : ""}

This email is written in a ${tone} tone for ${type} purpose.

Regards,
${senderName}
Email: ${senderEmail}
`;

    // 📧 SEND EMAIL (🔥 THIS IS WHAT YOU WERE MISSING)
    await sendEmail(receiverEmail, subject, formatted);

    // save history
    history.unshift({
      subject,
      formattedEmail: formatted
    });

    res.json({
      success: true,
      subject,
      formatted,
      message: "Email sent successfully 🚀"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Email generation failed",
      details: err.message
    });
  }
};

// 📂 HISTORY
exports.getHistory = (req, res) => {
  res.json(history);
};