const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./services/dbConnectMongo");

const { logReqRes } = require("./middlewares/logReqRes");

// --------------^^^^^^^^^^^^------------------------------- Modules

const { restrictToLoggedUserOnly } = require("./middlewares/auth");

const authRouter = require("./routes/auth");
const socialRouter = require("./routes/social");
const verify = require("./routes/verifyToken");
const userRouter = require("./routes/xuser");
const tweetRouter = require("./routes/tweet");
const commentRouter = require("./routes/comment");

// --------------^^^^^^^^^^^^------------------------------- /ROUTER
const app = express();
const port = process.env.PORT || 8000;

dbConnect();

app.use(
  cors({
    origin: [
      "https://twitter-x-snowy.vercel.app",
      "https://x-tweet-ten.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["Authorization"], // Expose Authorization header
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));
// --------------^^^^^^^^^^^^ ------------------------------- |--MIDDLEWARES--|
app.use("/api/verify", verify);
app.use("/api/auth", authRouter);
app.use("/api/user", restrictToLoggedUserOnly, userRouter); //70 passed ✔️✔️
app.use("/api/tweet", restrictToLoggedUserOnly, tweetRouter); //
app.use("/api/comment", restrictToLoggedUserOnly, commentRouter);

app.listen(port, () =>
  console.log(`🟢🟢🟢 : http://localhost:${port}/api/user`)
);
