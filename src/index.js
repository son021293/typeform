import express from "express";
import bodyParser from "body-parser";

import TypeFormCtrl from "./controllers/typeform";

import {bootstrapExpressApp} from "./libs/express";

import {port, sheetId, scopes} from "../config.json";
import {client_email, private_key} from "../client-key.json";

let httpApp = express();

httpApp.use(bodyParser.urlencoded({extended: true}));
httpApp.use(bodyParser.json());

bootstrapExpressApp(httpApp, [
    new TypeFormCtrl({})
]);


const server = require("http").createServer(httpApp);
server.listen(port, () => console.log(`Server started at ${port}`));