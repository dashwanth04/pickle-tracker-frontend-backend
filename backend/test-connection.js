require("dotenv").config();
const mongoose = require("mongoose");

console.log("Testing MongoDB connection...");
console.log("MongoDB URI:", process.env.MONGO_URI ? "Found" : "Not found");

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully!");
  process.exit(0);
})
.catch(err => {
  console.error("❌ Connection Failed:");
  console.error("Error:", err.message);
  console.error("Code:", err.code);
  process.exit(1);
});