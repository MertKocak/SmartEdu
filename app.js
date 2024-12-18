const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");

const app = express();

//connect-db
mongoose
  .connect("mongodb+srv://mertkocak2811:JiJdyUw5Yka4rlr6@smartedu-cluster.z3eib.mongodb.net/?retryWrites=true&w=majority&appName=smartEdu-cluster")
  .then(() => console.log("Connected!"));

//template engine
app.set("view engine", "ejs");

//global veriable
global.userIN = null;

//middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://mertkocak2811:JiJdyUw5Yka4rlr6@smartedu-cluster.z3eib.mongodb.net/?retryWrites=true&w=majority&appName=smartEdu-cluster" }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("sunucu başlatıldı.");
});
