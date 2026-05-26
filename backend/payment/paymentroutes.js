const router = require("express").Router();
const { bookDemo, createOrder } = require("./paymentcontroller");

router.post("/book-demo", bookDemo);
router.post("/create-order", createOrder);

module.exports = router;
