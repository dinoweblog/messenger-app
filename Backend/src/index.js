const express = require("express");
const cors = require("cors");
const connect = require("./configs/db");
const userController = require("./controllers/auth.controller");
const conversationController = require("./controllers/conversations.controller");
const messagesController = require("./controllers/messages.controller");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.use("", userController);

app.use("/conversation", conversationController);
app.use("/messages", messagesController);

const PORT = process.env.PORT || 8080;

var socket = require("socket.io");

var server = app.listen(PORT, function () {
  console.log(`listening for requests on port ${PORT}`);
  connect();
});

let io = socket(server);

// const io = require("socket.io")(5000, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

let users = [];

const addUser = (userId, socketId) => {
  console.log(users.some((el) => el.userId === userId));
  let found = users.some((el) => el.userId === userId);
  if (!found) users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  socket.on("user", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMsg", ({ sender, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log("user", users, user, receiverId);
    io.emit("getMsg", {
      sender,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

module.exports = app;
