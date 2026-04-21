const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
 date: String,
 customer: String,
 pickle: String,
 weight: Number,
 price: Number,
 total: Number
});

module.exports = mongoose.model("Order", OrderSchema);