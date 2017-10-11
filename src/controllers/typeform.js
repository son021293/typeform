import _ from "lodash";
import moment from "moment-timezone";

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
    },
    E: {
        sheet: "'E' ISMs",
        rule: ["organization", "venueName", "whichVenue", 1, "dateSubmitted"]
    }
};

function applySheetRule(rule, form) {
    let row = [];

    rule.forEach((questionNumber) => {
        if (_.isArray(questionNumber)) {
            row.push(questionNumber.map(q => form[q].answer).filter(q => q.length > 0).join(", "));
        } else if (_.isNumber(questionNumber) || (_.isString(questionNumber) && questionNumber !== "dateSubmitted")) {
            row.push(form[questionNumber].answer);
        } else if (questionNumber === "dateSubmitted") {
            row.push(moment().tz("America/New_York").format('MM/DD/YYYY @ HH:MM z'));
        }
    });

    return row;
}

function getFormRule(form) {
    if (form["2"].answer === "New ISM") {
        return sheets["E"];
    } else if (form["3"].answer === "Frontend") {
        return sheets["B"];
    } else if (form["3"].answer === "Backend") {
        return sheets["C"];
    } else if (form["18"].answer.find(i => i === "None of the above")) {
        return sheets["A"];
    } else if (!form["18"].answer.find(i => i === "None of the above")) {
        return sheets["D"];
    } else if (form["2"].answer === "New ISM") {
        return sheets["E"];
    }
}

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
                // _.omit(fields, ["rawRequest", "webhookURL"])
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

            // submittedForms.push(
            //     Object.assign(
            //         {},
            //         _.omit(fields, ["rawRequest", "webhookURL", "ip", "type", "formID", "formTitle", "username"]),
            //         {
            //             date: moment().tz("America/New_York").format('MM/DD/YYYY @ HH:MM z'),
            //             parsedForm: newRow
            //         },
            //     )
            // );

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

// const parsedForm = parseForm({
//     "date": "10/10/2017 @ 23:10 EDT",
//     "formID": "70936128142151",
//     "submissionID": "3835009994173346677",
//     "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
//     "ip": "180.93.7.14",
//     "formTitle": "Development Support",
//     "pretty": "1. Name:Britney, 2. Is this an issue, a feature idea/request, or a new ISM?:New ISM, Organization:a, Venue Name:a, Does this venue use the same ISM as another venue?:No",
//     "username": "Josh_Groupmatics",
//     "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Britney\",\"q39_2Is\":\"New ISM\",\"q7_5Please\":\"\",\"q9_7Please\":\"\",\"q18_16Please\":\"\",\"q19_17How\":\"\",\"q22_20Name\":\"\",\"q23_21If\":\"\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"\",\"q36_27List\":\"\",\"q29_28What\":\"\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"\",\"q34_33Describe\":\"\",\"q35_34Is\":\"\",\"q71_organization\":\"a\",\"q72_venueName\":\"a\",\"q73_doesThis\":\"No\",\"q74_whichVenue\":\"\",\"event_id\":\"1507691791397_70936128142151_10JqY3b\",\"q12_10What\":\"\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q20_18Is\":\"\",\"q21_19Was\":\"\",\"q24_22Have\":\"\",\"q25_23Please\":\"\",\"q38_3Is\":\"\",\"q40_4Did\":\"\",\"q41_6Did\":\"\",\"q42_8What\":\"\",\"q43_9What\":\"\"}",
//     "type": "WEB"
// });
//
// console.log(parsedForm);
//
// const formRule = getFormRule(parsedForm);
//
// const newRow = {
//     range: formRule.sheet,
//     row: applySheetRule(formRule.rule, parsedForm)
// };
//
// console.log(newRow);