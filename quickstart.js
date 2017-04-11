var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'];

function listMajors(auth) {
    var spreadsheets = google.sheets('v4').spreadsheets.values;
    spreadsheets.append({
        auth: auth,
        spreadsheetId: '1hfYLDg6Ejz57czHywqzBdEjp_2eCop5cLFPa7hnaw00',
        range: "'A' Issue",
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'RAW',
        resource: {
            values: [
                ["Engine", "$100", "1", "3/20/2016"],
            ]
        },
    }, function(err, response) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(JSON.stringify(response, null, 2));
    })
}

var key = require('./client-key.json');
var jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    SCOPES,
    null
);

jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    }

    listMajors(jwtClient)
});