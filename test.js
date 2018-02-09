import {Jotform} from "./src/libs/jotform";
import {applySheetRule, getFormRule} from "./src/controllers/sheets-rules";
import {formatMessageForSlackBot} from "./src/controllers/typeform";

let form = new Jotform('793e8de2ec7fa2e74798cfe280c06fe1');

(async function () {
    // // A issue
    // const resp = await form.getSubmission('3939392119312441867');
    // // B Frontend
    // const resp = await form.getSubmission('3932119718627803865');
    // // C Backend
    // const resp = await form.getSubmission('3915049071312813846');
    // // D Urgent
    // const resp = await form.getSubmission('3936588219318876704');
    // E ism
    const resp = await form.getSubmission('3939547281217457250');
    // // F Org review report
    // const resp = await form.getSubmission('3939722891215366175');

    const parsedForm = JSON.parse(resp).content.answers;
    const formRule = getFormRule(parsedForm);

    const newRow = {
        range: formRule.sheet,
        row: applySheetRule(formRule.rule, parsedForm)
    };

    console.log(newRow);
    // console.log(formatMessageForSlackBot(parsedForm, formRule).attachments[0].fields);
})();