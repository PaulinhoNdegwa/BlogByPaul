const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Routers
const authRouter = require('./routes/auth');

dotenv.config()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(error))

app.use("/api/auth", authRouter);

app.listen("5000", () => {
    console.log("Server up and running...")
})