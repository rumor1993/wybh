const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const { auth } = require("./middleware/auth");
const userRouter = require("./router/users");
const loginRouter = require("./router/login");
const registerRouter = require("./router/register");
const chatRouter = require("./router/chat");
const messageRouter = require("./router/message");
const bodyParser = require("body-parser");

//app.use(cookieParser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.render("login.html");
});

app.get("/auth", auth, (req, res) => {
  console.log("auth");
  //jwt.verity(token, 'wybhSecretToken', ((err, decoded) =>{
  // db.one("select * from users where id =")
  // }))
});

app.listen(3000, function () {
  console.log("Connected 3000 port!");
});
