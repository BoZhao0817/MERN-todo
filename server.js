const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()) // req.body string to json (plugin)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const  uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"))
connection.once('open', () => {
    console.log('mongoDB database connected')
})

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
});

const User = mongoose.model("User", userSchema);


app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    // check unique key
    const user = await User.findOne({ username }).exec();
    if (user) {
        res.status(500);
        res.json({
            message: "user already exists",
        });
        return;
    }
    await User.create({ username, password });
    res.json({
        message: "success",
    });
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
