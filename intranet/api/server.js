const http = require("http");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const colors = require("colors");
const router = require("./routes/router");

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(express.json());

    if (process.env.NODE_ENV == "development") {
      app.use(morgan("dev"));
    }

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, X-PINGOTHER"
      );
      app.use(cors());
      next();
    });

    app.use("/api", router);

    if (process.env.NODE_ENV === "production") {
      app.use(express.static("../client/build"));
      app.get("*", (req, res) =>
        res.sendFile(
          path.resolve(__dirname, "../client", "build", "index.html")
        )
      );
    }

    httpServer = http.createServer(app);
    httpServer
      .listen(process.env.PORT)
      .on("listening", () => {
        console.log(
          `Web server on ${process.env.NODE_ENV} mode. listening on localhost:${process.env.PORT}`
            .green
        );

        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.initialize = initialize;
module.exports.close = close;
