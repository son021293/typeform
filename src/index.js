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
        new TypeFormCtrl({googleAuth, sheetId})
    ]);

    const server = http.createServer(httpApp);
    server.listen(port, () => console.log(`Server started at ${port}`));
}

// initServer();

const mockData = {
    "attachments": [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#36a64f",
            "pretext": "Optional text that appears above the attachment block",
            "author_name": "Bobby Tables",
            "author_link": "http://flickr.com/bobby/",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": "Slack API Documentation",
            "title_link": "https://api.slack.com/",
            "text": "Optional text that appears within the attachment",
            "fields": [
                {
                    "title": "Priority",
                    "value": "High",
                    "short": false
                }
            ],
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png",
            "footer": "Slack API",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            "ts": 123456789
        }
    ]
};