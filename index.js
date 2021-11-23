const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');


dotenv.config()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(error))
 
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/category", categoryRouter);


app.listen(process.env.PORT || "5000", () => {
    console.log(`Server up and running on port ${process.env.PORT || "5000"}...`)
})