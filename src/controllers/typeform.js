import {isArray, isNumber} from "lodash";

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
    }
};

function applySheetRule(rule, form) {
    let row = [];

    rule.forEach((questionNumber) => {
        if(isArray(questionNumber)) {
            row.push(questionNumber.map(q => form[q]).filter(q => q.length > 0).join(", "));
        } else if(isNumber(questionNumber)) {
            row.push(form[questionNumber]);
        } else if(questionNumber === "dateSubmitted") {
            row.push(new Date().toString());
        }
    });

    return row;
}

function getFormRule(form) {
    if(form["3"] === "Frontend") {
        return sheets["B"];
    } else if (form["3"] === "Backend") {
        return sheets["C"];
    } else if (form["18"].find(i => i === "None of the above")) {
        return sheets["A"];
    } else if (!form["18"].find(i => i === "None of the above")) {
        return "slack";
    }
}

function formatMessageForSlackBot(text) {
    return {
        "attachments": [
            {
                "title": "Development Support",
                "fields": text.replace(/\s(\d+\.\s)/g, "\n$1").split(",\n").map(i => {
                    const [question, answer] = (function (questionText) {
                        if(questionText.indexOf("::") >= 0) {
                            const arr = questionText.split("::");
                            return [`${arr[0]}:`, arr[1]];
                        } else {
                            return questionText.split(":")
                        }
                    })(i);
                    return {
                        "title": question,
                        "value": answer,
                        "short": false
                    }
                })
            }
        ]
    }
}

@controller("/api/typeform")
class TypeFormCtrl extends ExpressController{
    constructor({googleAuth, sheetId, webHookUrl}) {
        super();

        this.slackBot = new SlackBot({webHookUrl});
        this.sheet = new SpreadSheet({auth: googleAuth, spreadsheetId: sheetId});
    }

    @post()
    async post(req, res){
        const {fields} = await parseRequest(req);
        const parsedForm = parseForm(JSON.parse(fields.rawRequest));

        submittedForms.push({...parsedForm, pretty: fields.pretty});

        const formRule = getFormRule(parsedForm);
        if (formRule != "slack") {
            try {
                const respone = await this.sheet.insertRow({
                    range: formRule.sheet,
                    row: applySheetRule(formRule.rule, parsedForm)
                })
            } catch(e) {
                console.log(e);
            }
        } else {
            this.slackBot.notify(formatMessageForSlackBot(fields.pretty));
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