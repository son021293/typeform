import http from "http";
import express from "express";
import bodyParser from "body-parser";

import TypeFormCtrl from "./controllers/typeform";

import {GoogleAuth} from "./libs/google-apis";
import {bootstrapExpressApp} from "./libs/express";

import {client_email, private_key} from "../client-key.json";
import {port, sheetId, scopes, webHookUrl, jotformApiKey} from "../config.json";

async function initServer() {
    const googleAuth = await new GoogleAuth({scopes, clientKey: {client_email, private_key}}).get();

    let httpApp = express();

    httpApp.use(bodyParser.urlencoded({extended: true}));
    httpApp.use(bodyParser.json());

    bootstrapExpressApp(httpApp, [
        new TypeFormCtrl({googleAuth, sheetId, webHookUrl, jotformApiKey})
    ]);

    const server = http.createServer(httpApp);
    server.listen(port, () => console.log(`Server started at ${port}`));
}

initServer();