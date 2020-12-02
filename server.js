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

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // check unique key
    const user = await User.findOne({ username }).exec();
    // user doesn't exist or the pwd is wrong
    if (!user || user.password !== password) {
        res.status(403);
        res.json({
            message: "invalid login",
        });
        return;
    }
    res.json({
        message: "success",
    });
})
const todosSchema = new mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  todos: [
    {
      checked: Boolean,
      text: String,
      id: String,
    },
  ],
});
const Todos = mongoose.model("Todos", todosSchema);
app.post("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [username, password] = token.split(":");
    const todosItems = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
      res.status(403);
      res.json({
        message: "invalid access",
      });
      return;
    }
    const todos = await Todos.findOne({ userId: user._id }).exec();
    if (!todos) {
      await Todos.create({
        userId: user._id,
        todos: todosItems,
      });
    } else {
      todos.todos = todosItems;
      await todos.save();
    }
    res.json(todosItems);
  });
  
  app.get("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [username, password] = token.split(":");
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
      res.status(403);
      res.json({
        message: "invalid access",
      });
      return;
    }
    const { todos } = await Todos.findOne({ userId: user._id }).exec();
    res.json(todos);
  });



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
