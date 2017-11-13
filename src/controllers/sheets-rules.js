import _ from "lodash";
import moment from "moment-timezone";

function getNormalAnswer(question) {
    return function (form) {
        if (_.isArray(question)) {
            return question.map(q => form[q] ? form[q].answer : '').filter(q => q.length > 0).join(", ");
        } else if (_.isNumber(question) || _.isString(question)) {
            return form[question] ? form[question].answer : '';
        }

        return '';
    }
}

function getDateObjectAnswer(question) {
    return function (form) {
        const {day, month, year} = form[question].answer;
        return `${month}/${day}/${year}`;
    }
}

function genCurrentDateTime(question, moreDay = 0) {
    return function () {
        return moment().add(moreDay, 'days').tz("America/New_York").format('MM/DD/YYYY @ HH:MM z');
    }
}

const sheets = {
    A: {
        sheet: "'A' Issue",
        condition: (form) => form["18"] && form["18"].answer.find(i => i === "None of the above"),
        rule: [
            getNormalAnswer([24, 26]), getNormalAnswer(28), getNormalAnswer(34),
            getNormalAnswer(25), getNormalAnswer(27), getNormalAnswer(29),
            getNormalAnswer(30), getNormalAnswer(31), getNormalAnswer(32), getNormalAnswer(33),
            getNormalAnswer(19), getNormalAnswer(20), getNormalAnswer(21), genCurrentDateTime("dateSubmitted"),
            getNormalAnswer(1)
        ]
    },
    B: {
        sheet: "'B' Frontend",
        condition: (form) => form["3"] && form["3"].answer === "Frontend",
        rule: [
            getNormalAnswer(16), getNormalAnswer(17), getNormalAnswer(4),
            getNormalAnswer(5), genCurrentDateTime("dateSubmitted"), getNormalAnswer(1)
        ]
    },
    C: {
        sheet: "'C' Backend",
        condition: (form) => form["3"] && form["3"].answer === "Backend",
        rule: [
            getNormalAnswer(16), getNormalAnswer(17), getNormalAnswer([8, 9]),
            getNormalAnswer([10, 11, 12, 13, 14, 15]), getNormalAnswer(6), getNormalAnswer(7),
            genCurrentDateTime("dateSubmitted"), getNormalAnswer(1)
        ]
    },
    D: {
        sheet: "'D' Urgent",
        slack: {
            channel: "#support_urgent",
            questions: [1, [24, 26], 25, 27]
        },
        condition: (form) => form["18"] && !form["18"].answer.find(i => i === "None of the above"),
        rule: [
            getNormalAnswer([24, 26]), getNormalAnswer(28), getNormalAnswer(34),
            getNormalAnswer(25), getNormalAnswer(27), getNormalAnswer(29),
            getNormalAnswer(30), getNormalAnswer(31), getNormalAnswer(32), getNormalAnswer(33),
            getNormalAnswer(19), getNormalAnswer(20), getNormalAnswer(21), genCurrentDateTime("dateSubmitted"),
            getNormalAnswer(1)
        ]
    },
    E: {
        sheet: "'E' ISMs",
        condition: (form) => form["2"] && form["2"].answer === "New ISM",
        rule: [
            getNormalAnswer("organization"), getNormalAnswer("venueName"), getNormalAnswer("whichVenue"),
            getNormalAnswer(1), genCurrentDateTime("dateSubmitted")]
    },
    F: {
        sheet: "'F' Org Review Reports",
        slack: {
            channel: "#org-review-noti",
            questions: [1, "organizations", "dateFrom", "dateTo"]
        },
        condition: (form) => form["2"] && form["2"].answer === "Organization Review Report",
        rule: [
            getNormalAnswer("organizations"), getDateObjectAnswer("dateFrom"), getDateObjectAnswer("dateTo"),
            getNormalAnswer(1), genCurrentDateTime("dateSubmitted"), genCurrentDateTime("deadline", 3)]
    }
};

export function applySheetRule(rules, form) {
    return rules.map(rule => rule(form));
}

export function getFormRule(form) {
    return _.filter(sheets, (sheet, key) => sheet.condition(form))[0];
}