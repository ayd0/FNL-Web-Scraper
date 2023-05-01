const express = require("express");
const morgan = require("morgan");
const mainRouter = require("./server/mainRouter");

const HOSTNAME = "localhost";
const PORT = 3000;

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/", mainRouter);
app.use("/main", mainRouter);

app.use(express.static(__dirname + "/server/public"));

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at https://${HOSTNAME}:${PORT}`);
});