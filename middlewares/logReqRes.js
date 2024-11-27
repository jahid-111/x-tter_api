const fs = require("fs");

function logReqRes(fileName) {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `➡️ Request at : ${Date.now()} this path ${req.path} \n`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = { logReqRes };
