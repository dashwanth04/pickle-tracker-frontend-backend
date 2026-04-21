const express = require("express");
const router = express.Router();

const {
 addOrder,
 getOrders,
 deleteOrder,
 dailySales
} = require("../controllers/orderController");

router.post("/", addOrder);
router.get("/", getOrders);
router.delete("/:id", deleteOrder);
router.get("/sales/daily", dailySales);

module.exports = router;