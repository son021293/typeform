import _ from "lodash";
import moment from "moment-timezone";

const defaultQuestion = {
    question: '',
    answer: ''
};

function getNormalAnswer(question) {
    return function (form) {
        if (_.isArray(question)) {
            return {
                question: question.map(q => form[q] ? form[q].question : '').filter(q => q.length > 0).join(", "),
                answer: question.map(q => form[q] ? form[q].answer : '').filter(q => q.length > 0).join(", ")
            };
        } else if (_.isNumber(question) || _.isString(question)) {
            return form[question] ? {
                question: form[question].question,
                answer: form[question].answer
            } : defaultQuestion;
        }

        return defaultQuestion;
    }
}

function getDateObjectAnswer(question) {
    return function (form) {
        const {day, month, year} = form[question].answer;
        return {
            question: form[question].question,
            answer: `${month}/${day}/${year}`
        };
    }
}

function genCurrentDateTime(question, moreDay = 0) {
    return function () {
        return {
            question,
            answer: moment().add(moreDay, 'days').tz("America/New_York").format('MM/DD/YYYY @ HH:MM z')
        };
    }
}

const sheets = {
    A: {
        sheet: "'A' Issue",
        condition: (form) => form["18"] && form["18"].answer.indexOf("None of the above") >= 0,
        rule: [
            getNormalAnswer([24, 26]), getNormalAnswer(28), getNormalAnswer(34),
            getNormalAnswer(25), getNormalAnswer(27), getNormalAnswer(29),
            getNormalAnswer(30), getNormalAnswer(31), getNormalAnswer(32), getNormalAnswer(33),
            getNormalAnswer(19), getNormalAnswer(20), getNormalAnswer(21), genCurrentDateTime("Date Submitted"),
            getNormalAnswer(1)
        ]
    },
    B: {
        sheet: "'B' Frontend",
        condition: (form) => form["3"] && form["3"].answer === "Frontend",
        rule: [
            getNormalAnswer(16), getNormalAnswer(17), getNormalAnswer(4),
            getNormalAnswer(5), genCurrentDateTime("Date Submitted"), getNormalAnswer(1)
        ]
    },
    C: {
        sheet: "'C' Backend",
        condition: (form) => form["3"] && form["3"].answer === "Backend",
        rule: [
            getNormalAnswer(16), getNormalAnswer(17), getNormalAnswer([8, 9]),
            getNormalAnswer([10, 11, 12, 13, 14, 15]), getNormalAnswer(6), getNormalAnswer(7),
            genCurrentDateTime("Date Submitted"), getNormalAnswer(1)
        ]
    },
    D: {
        sheet: "'D' Urgent",
        slack: {
            channel: "#support_urgent",
            questions: [getNormalAnswer(1), getNormalAnswer(24), getNormalAnswer(26), getNormalAnswer(25), getNormalAnswer(27)]
        },
        condition: (form) => form["18"] && !form["18"].answer.indexOf("None of the above") >= 0,
        rule: [
            getNormalAnswer([24, 26]), getNormalAnswer(28), getNormalAnswer(34),
            getNormalAnswer(25), getNormalAnswer(27), getNormalAnswer(29),
            getNormalAnswer(30), getNormalAnswer(31), getNormalAnswer(32), getNormalAnswer(33),
            getNormalAnswer(19), getNormalAnswer(20), getNormalAnswer(21), genCurrentDateTime("Date Submitted"),
            getNormalAnswer(1)
        ]
    },
    E: {
        sheet: "'E' ISMs",
        condition: (form) => form["2"] && form["2"].answer === "New ISM",
        rule: [
            getNormalAnswer("organization"), getNormalAnswer("venueName"), getNormalAnswer("whichVenue"),
            getNormalAnswer(1), genCurrentDateTime("Date Submitted")]
    },
    F: {
        sheet: "'F' Org Review Reports",
        slack: {
            webHookUrl: "https://hooks.slack.com/services/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",
            channel: "#org-review-noti",
            questions: [
                getNormalAnswer(1), getNormalAnswer("organizations"), getDateObjectAnswer("dateFrom"),
                getDateObjectAnswer("dateTo"), genCurrentDateTime("Date Submitted"), genCurrentDateTime("Deadline", 3)
            ]
        },
        condition: (form) => form["2"] && form["2"].answer === "Organization Review Report",
        rule: [
            getNormalAnswer("organizations"), getDateObjectAnswer("dateFrom"), getDateObjectAnswer("dateTo"),
            getNormalAnswer(1), genCurrentDateTime("Date Submitted"), genCurrentDateTime("Deadline", 3)]
    }
};

export function applySheetRule(rules, form) {
    return rules.map(rule => rule(form).answer);
}

export function getFormRule(form) {
    return _.filter(sheets, (sheet, key) => sheet.condition(form))[0];
}