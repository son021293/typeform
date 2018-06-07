import {Jotform} from "./server/libs/jotform";
import {applySheetRule, applySheetRuleForSlack, getFormRule} from "./server/controllers/sheets-rules";
import {formatMessageForSlackBot} from "./server/controllers/typeform";
import {GoogleAuth, SpreadSheet} from "./server/libs/google-apis";
import {client_email, private_key} from "./client-key";
import {dbURL, scopes, sheetId, webHookUrl} from "./config";
import {Submission} from "./server/model/submission";
import {formData} from "./form-data";
import mongoose from "mongoose";
import {SlackBot} from "./server/libs/slack";

let form = new Jotform('793e8de2ec7fa2e74798cfe280c06fe1');

(async function () {
    const googleAuth = await new GoogleAuth({scopes, clientKey: {client_email, private_key}}).get();
    const sheet = new SpreadSheet({auth: googleAuth, spreadsheetId: sheetId});

    // A issue
    const resp = await form.getSubmission('4041339368496356388');
    // B urgent
    // const resp = await form.getSubmission('4041279918494677813');
    // 'C' Integration Troubleshooting
    // const resp = await form.getSubmission('4040010554833338286');
    // 'E' Frontend
    // const resp = await form.getSubmission('4040011984833423665');
    // 'D' ISM
    // const resp = await form.getSubmission('4041111858492394121');
    // 'F' Backend
    // const resp = await form.getSubmission('4040013964831910262');
    // 'G' Custom Group Leader Video
    // const resp = await form.getSubmission('4040016114837508698');
    // 'H' Org Review Reports
    // const resp = await form.getSubmission('4040021474836179608');

    const parsedForm = JSON.parse(resp).content.answers;
    const formRule = getFormRule(parsedForm);
    const newRow = {
        range: formRule.sheet,
        rows: [applySheetRule(formRule.rule, parsedForm)],
        name: applySheetRule([69], parsedForm)[0]
    };

    console.log(JSON.stringify(newRow, null, 2));

    const result = await sheet.insertRows(newRow);
    console.log(result);

    if (formRule.slack) {
        const slackBot = new SlackBot({webHookUrl});
        await slackBot.notify(formatMessageForSlackBot(parsedForm, formRule), {webHookUrl: formRule.slack.webHookUrl});
    }
})();

// const postForms = () => {
//     mongoose.connect(dbURL);
//     let db = mongoose.connection;
//     db.once("open", () =>{
//         console.log("Connected to db!");
//
//         let process = formData.map((item) => {
//             let data = new Submission(item);
//             return data.save();
//         });
//         Promise.all(process).then(() => console.log("Post forms success"));
//     });
// };
//
// postForms();