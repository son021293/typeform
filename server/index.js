import path from "path";
import http from "http";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import SupportLogsCtrl from "./controllers/support-logs-controller";
import MarketingRequestCtrl from "./controllers/marketing-request-controller";
import {GoogleAuth} from "./libs/google-apis";
import {bootstrapExpressApp} from "./libs/express";

import {client_email, private_key} from "../config/client-key.json";
import {port, SL_sheet_id, scopes, webHookUrl, jotformApiKey, dbURL, MCDR_sheet_id} from "../config/config.json";

function initServer() {
    mongoose.connect(dbURL);
    let db = mongoose.connection;
    db.once("open", async () => {
        const googleAuth = await new GoogleAuth({scopes, clientKey: {client_email, private_key}}).get();

        let httpApp = express();
        console.log("Connected to db!");

        httpApp.use(express.static(path.resolve(__dirname, "../dev")));
        httpApp.use(bodyParser.urlencoded({extended: true}));
        httpApp.use(bodyParser.json());

        httpApp.get("*", (req, res, next) => {
            if (req.path.match(/^\/api\//)) {
                next();
            } else {
                res.sendFile(path.resolve(__dirname, "../dev/index.html"));
            }
        });

        bootstrapExpressApp(httpApp, [
            new SupportLogsCtrl({googleAuth, sheetId: SL_sheet_id, webHookUrl, jotformApiKey}),
            new MarketingRequestCtrl({googleAuth, sheetId: MCDR_sheet_id, webHookUrl, jotformApiKey}),
        ]);

        const server = http.createServer(httpApp);
        server.listen(port, () => console.log(`Server started at ${port}`));
    });
}

initServer();
