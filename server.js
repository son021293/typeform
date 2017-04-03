var bodyParser = require("body-parser");
var express = require("express");
var apiRouter = require("./api/typeform");

var httpApp = express();

httpApp.use("/api", bodyParser.json());
httpApp.use(bodyParser.urlencoded({extended: true}));
httpApp.use("/api", apiRouter);


var port = 9090;

var server = require("http").createServer(httpApp);
server.listen(port, () => console.log(`Server started at ${port}`));

