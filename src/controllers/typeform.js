import _ from "lodash";
import moment from "moment-timezone";

import {SlackBot} from "../libs/slack";
import {SpreadSheet} from "../libs/google-apis";
import {parseForm, parseRequest} from "../libs/utils";
import {applySheetRule, getFormRule} from "./sheets-rules";
import {controller, post, get, ExpressController} from "../libs/express";

let submittedForms = [];

const listQuestions = [1, [24, 26], 25, 27];

function formatMessageForSlackBot(parsedForm) {
    const filterredQuestions = _.filter(parsedForm, (q, questionNum) => {
        const _questionNum = parseInt(questionNum);
        let isTake = false;
        listQuestions.forEach(_q => {
            if (_.isArray(_q) && (_questionNum === _q[0] || _questionNum === _q[1])) {
                isTake = true;
            } else if (_.isNumber(_q) && _questionNum === _q) {
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

        submittedForms.push(
            Object.assign(
                {date: moment().tz("America/New_York").format('MM/DD/YYYY @ HH:MM z')},
                fields
            )
        );

        try {
            const parsedForm = parseForm(fields);

            const formRule = getFormRule(parsedForm);

            const newRow = {
                range: formRule.sheet,
                row: applySheetRule(formRule.rule, parsedForm)
            };

            this.sheet.insertRow(newRow);

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
        res.json(submittedForms);
        res.status(200).end();
    }
}

export default TypeFormCtrl;