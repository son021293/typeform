import _ from "lodash";
import moment from "moment-timezone";
import {formatText} from "../libs/utils";

function getDateObjectAnswer(question) {
    return function (form) {
        const {day, month, year} = form[question].answer;
        return {
            text: form[question].text,
            answer: `${month}/${day}/${year}`
        };
    }
}

function genCurrentDateTime(question, moreDay = 0) {
    return function () {
        return {
            text: question,
            answer: moment().add(moreDay, 'days').tz("America/New_York").format('MM/DD/YYYY @ hh:mm z')
        };
    }
}

const sheets = {
    A: {
        sheet: "'A' Issue",
        condition: (form) => form["20"].answer && form["20"].answer.indexOf("None of the above") >= 0,
        rule: [[26, 27], 29, 35, 37, 36, 30, 31, 32, 33, 34, 21, 22, 23, genCurrentDateTime("Date Submitted"), 69]
    },
    B: {
        sheet: "'B' Frontend",
        condition: (form) => form["38"].answer && form["38"].answer === "Frontend",
        rule: [18, 19, 35, 40, 7, genCurrentDateTime("Date Submitted"), 69]
    },
    C: {
        sheet: "'C' Backend",
        condition: (form) => form["38"].answer && form["38"].answer === "Backend",
        rule: [18, 19, 35, [42, 43], [12, 13, 14, 15, 16, 17], 41, 9, genCurrentDateTime("Date Submitted"), 69]
    },
    D: {
        sheet: "'D' Urgent",
        slack: {
            webHookUrl: "https://hooks.slack.com/services/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",
            channel: "#support_urgent",
            questions: [69, 26, 27, 29, 35, 37, 36, 30, 31, 32, 33, 34, 21, 22, 23]
        },
        condition: (form) => form["20"].answer && !form["20"].answer.indexOf("None of the above") >= 0,
        rule: [[26, 27], 29, 35, 37, 36, 30, 31, 32, 33, 34, 21, 22, 23, genCurrentDateTime("Date Submitted"), 69]
    },
    E: {
        sheet: "'E' ISMs",
        condition: (form) => form["39"].answer && form["39"].answer === "ISM - New or Update",
        rule: [71, 72, 83, 85, 86, 74, 69, genCurrentDateTime("Date Submitted")]
    },
    F: {
        sheet: "'F' Org Review Reports",
        slack: {
            webHookUrl: "https://hooks.slack.com/services/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",
            channel: "#org-review-noti",
            questions: [69, 79, getDateObjectAnswer(80), getDateObjectAnswer(81), genCurrentDateTime("Date Submitted"), genCurrentDateTime("Deadline", 3)]
        },
        condition: (form) => form["39"].answer && form["39"].answer === "Organization Review Report",
        rule: [79, getDateObjectAnswer(80), getDateObjectAnswer(81), 69, genCurrentDateTime("Date Submitted"), genCurrentDateTime("Deadline", 3)]
    },
    G: {
        sheet: "'G' Custom Group Leader Video",
        condition: (form) => form["39"].answer && form["39"].answer === "Custom Group Leader Video",
        rule: [71, 69, genCurrentDateTime("Date Submitted")]
    }
};

function applyRule(rule, form) {
    if(_.isNumber(rule)) {
        return form[rule];
    }
    if(_.isFunction(rule)) {
        return rule(form);
    }
}

export function applySheetRule(rules, form) {
    return rules.map(rule => {
        if(_.isArray(rule)) {
            return rule.map(r => formatText(applyRule(r, form).answer || '')).filter(a => a.length > 0).join(", ");
        } else {
            return formatText(applyRule(rule, form).answer || '');
        }
    });
}
export function applySheetRuleForSlack(rules, form) {
    return rules.map(rule => {
        if(_.isArray(rule)) {
            return rule.map(r => applyRule(r, form));
        } else {
            return applyRule(rule, form);
        }
    });
}

export function getFormRule(form) {
    return _.filter(sheets, sheet => sheet.condition(form))[0];
}