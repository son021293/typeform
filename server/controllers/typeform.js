import moment from "moment-timezone";
import {Submission} from "../model/submission";
import {SlackBot} from "../libs/slack";
import {Jotform} from "../libs/jotform";
import {SpreadSheet} from "../libs/google-apis";
import {formatText, parseRequest} from "../libs/utils";
import {controller, post, get, ExpressController} from "../libs/express";
import {applySheetRule, applySheetRuleForSlack, getFormRule} from "./sheets-rules";

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

    // todo: need fix here
    async submitFormToSuppLog(submissionID, canSubmitToSlack = true) {
        let promises = Promise.resolve();
        const results = {
            hasError: false,
            errorMessage: ""
        };
        const resp = await this.jotform.getSubmission(submissionID);
        const parsedResp = JSON.parse(resp);

        if (parsedResp.responseCode != 200) {
            console.log(`Error: "${parsedResp.message}"`);
            results.hasError = true;
            results.errorMessage = `Error: "${parsedResp.message}"`;
        } else {
            const parsedForm = parsedResp.content.answers;
            let formRule = null;
            let newRow = null;

            try {
                formRule = getFormRule(parsedForm);
                newRow = {
                    range: formRule.sheet,
                    rows: [applySheetRule(formRule.rule, parsedForm)],
                    name: applySheetRule([69], parsedForm)[0]
                };
            } catch (e) {
                results.hasError = true;
                results.errorMessage = "Error: Cannot parse submission\n" + e;
            }

            if(newRow) {
                try {
                    if (canSubmitToSlack && formRule.slack) {
                        await this.slackBot.notify(formatMessageForSlackBot(parsedForm, formRule), {webHookUrl: formRule.slack.webHookUrl});
                    }
                } catch (e) {
                    results.hasError = true;
                    results.errorMessage = "Error: Cannot notify to Slack\n" + e;
                }

                try {
                    await this.sheet.insertRows(newRow);
                } catch (e) {
                    results.hasError = true;
                    results.errorMessage = "Error: Cannot sent submission to \"Support Logs\"\n" + e;
                }
            }

            // todo: upsert data
            // Submission.find({}).then(items => {
            //     res.json(items);
            //     res.status(200).end();
            // }).catch(err => {
            //     throw new Error("get all form items failed!\n" + err);
            // });
        }

        return promises;
    }

    @post()
    async post(req, res) {
        const {fields} = await parseRequest(req);

        let results = {
            hasError: false
        };

        try {
            const [newRow, promiseResult] = await this.submitFormToSuppLog(fields.submissionID);
            results.sheet = newRow.range;
            results.name = newRow.name
        } catch (e) {
            results.hasError = true;
            results.errorMessage = e;
        }

        let data = new Submission(Object.assign(
            {
                date_display: moment().tz("America/New_York").format('MM/DD/YYYY @ HH:MM z'),
                created_date: Date.now(),
                updated_date: Date.now(),
            },
            fields,
            results
        ));

        data.save().then(() => {
            res.json({fields: fields});
            res.status(200).end();
        });
    }

    @get('/submitted-forms')
    getSubmittedForms(req, res) {
        Submission.find({}).then(items => {
            res.json(items);
            res.status(200).end();
        }).catch(err => {
            throw new Error("get all form items failed!\n" + err);
        });
    }

    @get('/update-submissions')
    async updateSubmission(req, res) {
        const subIDs = req.query.ids.split(",");

        try {
            const promises = await Promise.all(subIDs.map(subID => this.submitFormToSuppLog(subID)));

            res.status(200).end();
        } catch (e) {
            console.log(e);

            res.status(500).end();
        }
    }
}

export default TypeFormCtrl;