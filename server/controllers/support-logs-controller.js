import moment from "moment-timezone";
import {Submission} from "../model/submission";
import {SlackBot} from "../libs/slack";
import {Jotform} from "../libs/jotform";
import {SpreadSheet} from "../libs/google-apis";
import {formatText, parseRequest} from "../libs/utils";
import {controller, post, get, ExpressController} from "../libs/express";
import {applySheetRule, applySheetRuleForSlack, getFormRule} from "../rules/rule-utils";
import {SupportLogsRules} from "../rules/support-logs-rules";

const DEV = process.env.NODE_ENV == "development";

export function formatMessageForSlackBot(parsedForm, rule) {
    const filterredQuestions = applySheetRuleForSlack(rule.slack.questions, parsedForm).map(q => ({
        title: q.text,
        value: formatText(q.answer),
        short: false
    }));

    return {
        channel: DEV ? 'support_logs_test' : rule.slack.channel,
        username: "Support Logs Bot",
        "attachments": [
            {
                "title": "Development Support",
                "fields": filterredQuestions
            }
        ]
    }
}

@controller("/api/typeform")
class SupportLogsCtrl extends ExpressController {
    constructor({googleAuth, sheetId, webHookUrl, jotformApiKey}) {
        super();

        this.slackBot = new SlackBot({webHookUrl});
        this.sheet = new SpreadSheet({auth: googleAuth, spreadsheetId: sheetId});
        this.jotform = new Jotform(jotformApiKey);
    }

    // todo: need fix here
    async submitFormToSuppLog(submissionID, canSubmitToSlack = true) {
        let submission = null;
        const results = {
            hasError: false,
            errorMessage: ""
        };
        const resp = await this.jotform.getSubmission(submissionID);
        const parsedResp = JSON.parse(resp);

        if (parsedResp.responseCode != 200) {
            results.hasError = true;
            results.errorMessage = `Error: "${parsedResp.message}"`;
        } else {
            const parsedForm = parsedResp.content.answers;
            let formRule = null;
            let newRow = null;

            try {
                formRule = getFormRule(parsedForm, SupportLogsRules);
                newRow = {
                    range: formRule.sheet,
                    rows: [applySheetRule(formRule.rule, parsedForm)]
                };

                results.username = applySheetRule([69], parsedForm)[0];
                results.sheet = formRule.sheet;
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
        }

        try {
            submission = Submission
                .findOneAndUpdate({submissionID}, {
                    date: Date.now(),
                    date_display: moment().tz("America/New_York").format('MM/DD/YYYY @ HH:MM z'),
                    submissionID,
                    ...results
                }, {upsert: true})
                .lean(true);
        } catch (e) {
            submission = Submission
                .create({
                    date: Date.now(),
                    date_display: moment().tz("America/New_York").format('MM/DD/YYYY @ HH:MM z'),
                    submissionID,
                    ...results
                })
                .lean(true);
        }

        return Promise.resolve(submission);
    }

    getAllSubmissions() {
        return Submission.find({});
    }

    @post()
    async post(req, res) {
        const {fields} = await parseRequest(req);

        const result = await this.submitFormToSuppLog(fields.submissionID, true);

        res.json({fields: result});
        res.status(200).end();
    }

    @get('/submitted-forms')
    async getSubmittedForms(req, res) {
        try {
            const submissions = await this.getAllSubmissions();

            res.json({submissions});
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
        }
    }

    @get('/update-submissions')
    async updateSubmission(req, res) {
        const subIDs = req.query.ids.split(",");

        try {
            await Promise.all(subIDs.map(subID => this.submitFormToSuppLog(subID)));
            const submissions = await this.getAllSubmissions();
            res.json({submissions});
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
        }
    }
}

export default SupportLogsCtrl;
