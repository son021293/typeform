import _, {isArray, isNumber} from "lodash";

import {SlackBot} from "../libs/slack";
import {SpreadSheet} from "../libs/google-apis";
import {parseForm, parseRequest} from "../libs/utils";
import {controller, post, get, ExpressController} from "../libs/express";

let submittedForms = [];

const sheets = {
    A: {
        sheet: "'A' Issue",
        rule: [[24, 26], 28, 34, 25, 27, 29, 30, 31, 32, 33, 19, 20, 21, "dateSubmitted", 1]
    },
    B: {
        sheet: "'B' Frontend",
        rule: [16, 17, 4, 5, "dateSubmitted", 1]
    },
    C: {
        sheet: "'C' Backend",
        rule: [16, 17, [8, 9], [10, 11, 12, 13, 14, 15], 6, 7, "dateSubmitted", 1]
    },
    D: {
        sheet: "'D' Urgent",
        rule: [[24, 26], 28, 34, 25, 27, 29, 30, 31, 32, 33, 19, 20, 21, "dateSubmitted", 1]
    }
};

function applySheetRule(rule, form) {
    let row = [];

    rule.forEach((questionNumber) => {
        if (isArray(questionNumber)) {
            row.push(questionNumber.map(q => form[q].answer).filter(q => q.length > 0).join(", "));
        } else if (isNumber(questionNumber)) {
            row.push(form[questionNumber].answer);
        } else if (questionNumber === "dateSubmitted") {
            row.push(new Date().toString());
        }
    });

    return row;
}

function getFormRule(form) {
    if (form["3"].answer === "Frontend") {
        return sheets["B"];
    } else if (form["3"].answer === "Backend") {
        return sheets["C"];
    } else if (form["18"].answer.find(i => i === "None of the above")) {
        return sheets["A"];
    } else if (!form["18"].answer.find(i => i === "None of the above")) {
        return sheets["D"];
    }
}

const listQuestions = [1, [24, 26], 25, 27];

function formatMessageForSlackBot(parsedForm) {
    const filterredQuestions = _.filter(parsedForm, (q, questionNum) => {
        let isTake = false;
        listQuestions.forEach(_q => {
            if (isArray(_q) && (questionNum === _q[0] || questionNum === _q[1])) {
                isTake = true;
            } else if (isNumber(_q) && questionNum === _q) {
                isTake = true;
            }
        });

        return isTake;
    }).map(q => ({
        title: q.question,
        value: q.answer,
        short: false
    }));

    return {
        "attachments": [
            {
                "title": "Development Support",
                "fields": filterredQuestions
            }
        ]
    }
}

@controller("/api/typeform")
class TypeFormCtrl extends ExpressController {
    constructor({googleAuth, sheetId, webHookUrl}) {
        super();

        this.slackBot = new SlackBot({webHookUrl});
        this.sheet = new SpreadSheet({auth: googleAuth, spreadsheetId: sheetId});
    }

    @post()
    async post(req, res) {
        const {fields} = await parseRequest(req);

        submittedForms.push(fields);

        const parsedForm = parseForm(fields);

        const formRule = getFormRule(parsedForm);
        try {
            this.sheet.insertRow({
                range: formRule.sheet,
                row: applySheetRule(formRule.rule, parsedForm)
            });

            if (formRule.sheet === "'D' Urgent") {
                this.slackBot.notify(formatMessageForSlackBot(parsedForm));
            }
        } catch (e) {
            console.log(e);
        }

        res.json({fields: fields});
        res.status(200).end();
    }

    @get('/submitted-forms')
    getSubmittedForms(req, res) {
        res.json({forms: submittedForms});
        res.status(200).end();
    }
}

export default TypeFormCtrl;