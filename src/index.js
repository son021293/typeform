import http from "http";
import express from "express";
import bodyParser from "body-parser";

import TypeFormCtrl from "./controllers/typeform";

import {SlackBot} from "./libs/slack";
import {GoogleAuth} from "./libs/google-apis";
import {bootstrapExpressApp} from "./libs/express";

import {port, sheetId, scopes, webHookUrl} from "../config.json";
import {client_email, private_key} from "../client-key.json";

async function initServer() {
    const googleAuth = await new GoogleAuth({scopes, clientKey: {client_email, private_key}}).get();

    let httpApp = express();

    httpApp.use(bodyParser.urlencoded({extended: true}));
    httpApp.use(bodyParser.json());

    bootstrapExpressApp(httpApp, [
        new TypeFormCtrl({googleAuth, sheetId, webHookUrl})
    ]);

    const server = http.createServer(httpApp);
    server.listen(port, () => console.log(`Server started at ${port}`));
}

// initServer();

function formatMessageForSlackBot(text) {
    return {
        "attachments": [
            {
                "title": "Development Support",
                "fields": text.replace(/\s(\d+\.\s)/g, "\n$1").split(",\n").map(i => {
                    const [question, answer] = i.split(":");
                    return {
                        "title": question,
                        "value": answer,
                        "short": false
                    }
                })
            }
        ]
    }
}

const demo = {
    "raw": {
        "1": "111111111111111",
        "2": "Feature Idea/Request",
        "3": "Backend",
        "4": "",
        "5": "",
        "6": "Client",
        "7": "123",
        "8": "Group Leader",
        "9": "",
        "10": ["Outing - Group", "Outing - Info"],
        "11": "",
        "12": "",
        "13": "",
        "14": "",
        "15": "",
        "16": "123",
        "17": "123",
        "18": "",
        "19": "",
        "20": "",
        "21": "",
        "22": "",
        "23": "",
        "24": "",
        "25": "",
        "26": "",
        "27": "",
        "28": "",
        "29": "",
        "30": "",
        "31": "",
        "32": "",
        "33": "",
        "34": "123"
    },
    "pretty": "1. Name:111111111111111, 2. Are you reporting an issue or logging a feature idea/request?:Feature Idea/Request, 3. Is this feature idea/request for the frontend or backend of the system?:Backend, 6. Did this feature idea/request come form a client or is it your own?:Client, 7. Please share the name, team, and position of the client who made the request:123, 8. What level user would this feature/update affect?:Group Leader, 10. What area of the admin would this affect for Group Leaders?:Outing - Group Outing - Info, 16. Please describe the feature idea/request.:123, 17. How is the GM experiences expected to be improved by this?:123, 34. Is there anything else worth mentioning before submitting?:123"
};

console.log(JSON.stringify(formatMessageForSlackBot(demo.pretty)));