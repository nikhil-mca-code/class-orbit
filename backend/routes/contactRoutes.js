const router = require("express").Router();

router.post("/send", (req, res) => {
  res.json({ message: "Contact Form Submitted" });
});

module.exports = router;