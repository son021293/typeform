import request from "request";

export class SlackBot {
    constructor({webHookUrl}) {
        this.webHookUrl = webHookUrl;
    }

    notify(message) {
        return new Promise((resolve, reject) => {
            request({
                method: "POST",
                url: this.webHookUrl,
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