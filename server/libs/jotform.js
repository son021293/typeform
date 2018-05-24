import request from 'request';

export class Jotform {
    apiKey = null;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    urlBuilder = (endPoint) => `https://api.jotform.com${endPoint}?apiKey=${this.apiKey}`;

    getSubmission = (submissionId) => {
        return new Promise((resolve, reject) => {
            request.get(this.urlBuilder(`/submission/${submissionId}`), (err, httpResponse, body) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            })
        })
    }
}