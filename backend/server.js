require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// API routes
app.use("/orders", orderRoutes);

// Serve frontend static files from monorepo
const frontendPath = path.join(__dirname, "../frontend/out");
app.use(express.static(frontendPath));

// Catch-all route for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
 console.log(`Server running on port ${PORT}`);
});