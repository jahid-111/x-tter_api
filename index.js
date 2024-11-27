const express = require("express");

const dbConnect = require("./services/dbConnectMongo");

const { logReqRes } = require("./middlewares/logReqRes");

const userRouter = require("./routes/xuser");
const tweetRouter = require("./routes/tweet");
// --------------^^^^^^^^^^^^------------------------------- Modules

const app = express();
const port = 8000;

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));
app.use("/api/user", userRouter);
app.use("/api/tweet", tweetRouter);

app.listen(port, () =>
  console.log(`🟢🟢🟢 : http://localhost:${port}/api/user`)
);
