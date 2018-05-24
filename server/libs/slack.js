import request from "request";

export class SlackBot {
    constructor({webHookUrl}) {
        this.webHookUrl = webHookUrl;
    }

    notify(message, options = {webHookUrl: this.webHookUrl}) {
        return new Promise((resolve, reject) => {
            request({
                method: "POST",
                url: options.webHookUrl,
                json: message,
            }, function (err, httpResponse, body) {
                if(err) {
                    reject(err);
                } else {
                    resolve({httpResponse, body});
                }
            })
        })
    }
}