const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  try {
    const connect = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING
    );
    console.log("🟢✔️ DB Connect Successfully");
    return connect;
  } catch (error) {
    console.error("🔴✖️ DB Not Connected 🔴✖️", error.message || error);
    process.exit(1);
  }
}

module.exports = dbConnect;
