const express = require("express");
const router = express.Router();

const {
  generateEmail,
  generateMessage,
  getHistory
} = require("../controllers/emailController");

router.post("/generate", generateEmail);
router.post("/generate-message", generateMessage);
router.get("/history", getHistory);

module.exports = router;