const express = require("express");
const app = express();


const serverConfig = {
    port:3500
};
const server = app.listen(serverConfig.port, function () {
    console.log('Listening at http://localhost:%s', serverConfig.port);
});