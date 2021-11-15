const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(error))


app.listen("5000", () => {
    console.log("Server up and running...")
})