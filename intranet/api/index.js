const colors = require("colors");
const dotenv = require("dotenv");
const webServer = require("./server.js");
const mvPrd = require("./databases/mvPrd.js");


dotenv.config({ path: "./config/config.env" });


async function startup() {
  console.log("Starting application".green);

  // Initilize databases
  try {
    console.log("Initializing database MVPRD".cyan);
    //dbOracle;
    await mvPrd.initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }

  try {
    console.log("Initializing web server module".green);

    await webServer.initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }
}

startup();

async function shutdown(e) {
  let err = e;

  console.log("Shutting down".red);

  try {
    console.log("Closing web server module".red);

    await webServer.close();
  } catch (e) {
    console.log("Encountered error", e.red);

    err = err || e;
  }

  try {
    console.log("Closing database MVPRD".cyan);

    await mvPrd.close();
  } catch (err) {
    console.log("Encountered error".red, err);

    err = err || e;
  }

  console.log("Exiting process".white.bgRed);

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => {
  console.log("Received SIGTERM".bgWhite.black);

  shutdown();
});

process.on("SIGINT", () => {
  console.log("Received SIGINT".bgWhite.black);

  shutdown();
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception");
  console.error(err);

  shutdown(err);
});


