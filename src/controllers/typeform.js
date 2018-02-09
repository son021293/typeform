import moment from "moment-timezone";

import {SlackBot} from "../libs/slack";
import {Jotform} from "../libs/jotform";
import {SpreadSheet} from "../libs/google-apis";
import {formatText, parseRequest} from "../libs/utils";
import {controller, post, get, ExpressController} from "../libs/express";
import {applySheetRule, applySheetRuleForSlack, getFormRule} from "./sheets-rules";

let submittedForms = [];

export function formatMessageForSlackBot(parsedForm, rule) {
    const filterredQuestions = applySheetRuleForSlack(rule.slack.questions, parsedForm).map(q => ({
        title: q.text,
        value: formatText(q.answer),
        short: false
    }));

    return {
        channel: rule.slack.channel,
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
    constructor({googleAuth, sheetId, webHookUrl, jotformApiKey}) {
        super();

        this.slackBot = new SlackBot({webHookUrl});
        this.sheet = new SpreadSheet({auth: googleAuth, spreadsheetId: sheetId});
        this.jotform = new Jotform(jotformApiKey);
    }

    async submitFormToSuppLog(submissionID) {
        const resp = await this.jotform.getSubmission(submissionID);
        const parsedResp = JSON.parse(resp);

        if (parsedResp.responseCode != 200) {
            console.log(`Error: "${parsedResp.message}"`);
            throw `Error: "${parsedResp.message}"`;
        }

        const parsedForm = JSON.parse(resp).content.answers;
        const formRule = getFormRule(parsedForm);

        const newRow = {
            range: formRule.sheet,
            rows: [applySheetRule(formRule.rule, parsedForm)]
        };

        if (formRule.slack) {
            this.slackBot.notify(formatMessageForSlackBot(parsedForm, formRule), {webHookUrl: formRule.slack.webHookUrl});
        }

        return this.sheet.insertRows(newRow);
    }

    @post()
    async post(req, res) {
        const {fields} = await parseRequest(req);

        let hasError = false;

        try {
            this.submitFormToSuppLog(fields.submissionID);
        } catch (e) {
            hasError = true;
            console.log(e);
        }

        submittedForms.push(
            Object.assign(
                {
                    date: moment().tz("America/New_York").format('MM/DD/YYYY @ HH:MM z'),
                    hasError
                },
                fields
            )
        );

        res.json({fields: fields});
        res.status(200).end();
    }

    @get('/submitted-forms')
    getSubmittedForms(req, res) {
        res.json(submittedForms);
        res.status(200).end();
    }

    @get('/update-submissions')
    async updateSubmission(req, res) {
        const subIDs = req.query.ids.split(",");

        try {
            const promiseds = await Promise.all(subIDs.map(subID => this.submitFormToSuppLog(subID)));

            res.status(200).end();
        } catch (e) {
            console.log(e);

            res.status(500).end();
        }
    }
}

export default TypeFormCtrl;