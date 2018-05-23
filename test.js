import {Jotform} from "./src/libs/jotform";
import {applySheetRule, getFormRule} from "./src/controllers/sheets-rules";
import {formatMessageForSlackBot} from "./src/controllers/typeform";
import {GoogleAuth, SpreadSheet} from "./src/libs/google-apis";
import {client_email, private_key} from "./client-key";
import {dbURL, scopes, sheetId} from "./config";
import {FormItem} from "./src/model/form-item";
import {formData} from "./form-data";
import mongoose from "mongoose";

// let form = new Jotform('793e8de2ec7fa2e74798cfe280c06fe1');

// (async function () {
//     const googleAuth = await new GoogleAuth({scopes, clientKey: {client_email, private_key}}).get();
//     const sheet = new SpreadSheet({auth: googleAuth, spreadsheetId: sheetId});
//
//     // // A issue
//     // const resp = await form.getSubmission('3939392119312441867');
//     // // B Frontend
//     // const resp = await form.getSubmission('3932119718627803865');
//     // // C Backend
//     // const resp = await form.getSubmission('3915049071312813846');
//     // // D Urgent
//     // const resp = await form.getSubmission('3936588219318876704');
//     // // E ism
//     // const resp = await form.getSubmission('3939547281217457250');
//     // // F Org review report
//     // const resp = await form.getSubmission('3939722891215366175');
//     // 'G' Custom Group Leader Video
//     const resp = await form.getSubmission('3996630635327973546');
//
//     const parsedForm = JSON.parse(resp).content.answers;
//     const formRule = getFormRule(parsedForm);
//
//     const newRow = {
//         range: formRule.sheet,
//         row: applySheetRule(formRule.rule, parsedForm)
//     };
//
//     console.log(newRow);
//
//     // console.log(formatMessageForSlackBot(parsedForm, formRule).attachments[0].fields);
//     const result = await sheet.insertRows(newRow);
//     console.log(result)
// })();

const postForms = list => {
    mongoose.connect(dbURL);
    let db = mongoose.connection;
    db.once("open", () =>{
        console.log("Connected to db!");
    });
    let process = list.map((item) => {
        let data = new FormItem(item);
        return data.save();
    });
    Promise.all(process).then(()=> console.log("Post forms success"));
};

postForms(formData);

