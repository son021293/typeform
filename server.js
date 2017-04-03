const bodyParser = require("body-parser");
const express = require("express");
const apiRouter = require("./api/typeform");

let httpApp = express();

httpApp.use("/api", bodyParser.json());
httpApp.use(bodyParser.urlencoded({extended: true}));
httpApp.use("/api", apiRouter);


let port = 9090;

let server = require("http").createServer(httpApp);
server.listen(port, () => console.log(`Server started at ${port}`));

