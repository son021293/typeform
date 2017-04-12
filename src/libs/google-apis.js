import google from "googleapis";

const sheets = google.sheets('v4');

export class GoogleAuth {
    constructor({scopes, clientKey}) {
        this.scopes = scopes;
        const {client_email, private_key} = clientKey;
        this.jwtClient = new google.auth.JWT(
            client_email,
            null,
            private_key,
            scopes,
            null
        );

        this.inited = new Promise((resolve, reject) => {
            this.jwtClient.authorize((err, tokens) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.jwtClient);
                }
            });
        })
    }

    get = () => this.inited;
}

export class SpreadSheet {
    constructor({auth, spreadsheetId}) {
        this.config = {auth, spreadsheetId}
    }

    insertRow({range, row}) {
        const {auth, spreadsheetId} = this.config;
        const request = {
            auth,
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: row
            }
        };

        return Promise((resolve, reject) => {
            sheets.spreadsheets.values.append(request, function(err, response) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    resolve(response);
                    return;
                }
            })
        })
    }
}