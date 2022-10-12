import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import User from "./models/user.js";
import auth from "./middlewares/auth.js";
import usersRoutes from "./routes/userRoutes.js";

// database connection
// mongoose.Promise = global.Promise;
// mongoose.connect(
//   process.env.DATABASE,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err) {
//     if (err) console.log(err);
//     console.log("database is connected");
//     console.log(mongoose.connection.readyState);
//   }
// );
// console.log(mongoose.connection.readyState);
const options = {
  // autoIndex: false, // Don't build indexes
  // maxPoolSize: 10, // Maintain up to 10 socket connections
  // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // family: 4, // Use IPv4, skip trying IPv6
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose
  .connect(process.env.DATABASE, options)
  .then(() => console.log("connecting to database successful"))
  .catch((err) => console.error("could not connect to mongo DB", err));

const app = express();
// app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/v1/users", usersRoutes);

app.get("/", function (req, res) {
  res.status(200).send(`Welcome to the RemoteGRJobs!`);
});

// adding new user (sign-up route)
app.post("/api/register", function (req, res) {
  // taking a user
  const newuser = new User(req.body);

  if (newuser.password != newuser.password2)
    return res.status(400).json({ message: "password not match" });

  User.findOne({ email: newuser.email }, function (err, user) {
    if (user)
      return res.status(400).json({ auth: false, message: "email exits" });

    newuser.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      res.status(200).json({
        succes: true,
        user: doc,
      });
    });
  });
});

// login user
app.post("/api/login", function (req, res) {
  let token = req.cookies.auth;
  User.findByToken(token, (err, user) => {
    if (err) return res(err);
    if (user) {
      return res.status(400).json({
        error: true,
        message: "You are already logged in",
      });
    }

    User.findOne({ email: req.body.email }, function (err, user) {
      if (!user) {
        return res.json({
          isAuth: false,
          message: " Auth failed ,email not found",
        });
      }

      user.comparepassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            isAuth: false,
            message: "password doesn't match",
          });
        }

        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          return res.cookie("auth", user.token).json({
            isAuth: true,
            id: user._id,
            email: user.email,
          });
        });
      });
    });
  });
});

// get logged in user
app.get("/api/profile", auth, function (req, res) {
  // return res.status(400).json({ message: "password not match" });
  return res.status(200).json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    name: req.user.firstname + " " + req.user.lastname,
  });
});

//logout user
app.get("/api/logout", auth, function (req, res) {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err);
    return res.sendStatus(200);
  });
});

app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

// listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});
