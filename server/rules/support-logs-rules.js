import {genCurrentDateTime, getDateObjectAnswer} from "./rule-utils";

const getSheetType = (form, answer) => {
    return (form["39"].answer && form["39"].answer.indexOf(answer) >= 0)
    || (form["92"].answer && form["92"].answer.indexOf(answer) >= 0)
};

export const SupportLogsRules = {
    A: {
        sheet: "'A' Issue",
        condition: (form) => getSheetType(form, "Issue") && form[87].answer == "No",
        rule: [[26, 27], 29, 35, 102, 37, 36, 30, 31, 32, 33, 34, 21, 22, 23, genCurrentDateTime("Date Submitted"), 69]
    },
    B: {
        sheet: "'B' Urgent",
        condition: (form) => getSheetType(form, "Issue") >= 0 && form[87].answer == "Yes",
        slack: {
            webHookUrl: "https://hooks.slack.com/services/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",
            channel: "#support_urgent",
            questions: [69, 26, 27, 88, 29, 35, 102, 37, 36, 30, 31, 32, 33, 34, 21, 22, 23]
        },
        rule: [[26, 27], 88, 29, 35, 102, 37, 36, 30, 31, 32, 33, 34, 21, 22, 23, genCurrentDateTime("Date Submitted"), 69]
    },
    C: {
        sheet: "'C' Integration Troubleshooting",
        condition: (form) => getSheetType(form, "Integration Troubleshooting"),
        rule: [94, 100, 95, 101, 96, 97, 98, 99, genCurrentDateTime("Date Submitted")]
    },
    D: {
        sheet: "'D' ISMs",
        condition: (form) => getSheetType(form, "ISM - New or Update"),
        rule: [71, 72, 83, 85, 86, 73, 69, genCurrentDateTime("Date Submitted")]
    },
    E: {
        sheet: "'E' Frontend",
        condition: (form) => getSheetType(form, "Feature Idea/Request") && form[38].answer == "Frontend",
        rule: [18, 19, 35, 40, 7, genCurrentDateTime("Date Submitted"), 69]
    },
    F: {
        sheet: "'F' Backend",
        condition: (form) => getSheetType(form, "Feature Idea/Request") && form[38].answer == "Backend",
        rule: [18, 19, 35, [42, 43], [12, 13, 14, 15, 16, 17], 41, 9, genCurrentDateTime("Date Submitted"), 69]
    },
    G: {
        sheet: "'G' Custom Group Leader Video",
        condition: (form) => getSheetType(form, "Custom Group Leader Video"),
        rule: [71, 69, genCurrentDateTime("Date Submitted")]
    },
    H: {
        sheet: "'H' Org Review Reports",
        slack: {
            webHookUrl: "https://hooks.slack.com/services/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",
            channel: "#org-review-noti",
            questions: [69, 79, getDateObjectAnswer(80), getDateObjectAnswer(81), genCurrentDateTime("Date Submitted"), genCurrentDateTime("Deadline", 3)]
        },
        condition: (form) => getSheetType(form, "Organization Review Report"),
        rule: [79, getDateObjectAnswer(80), getDateObjectAnswer(81), 69, genCurrentDateTime("Date Submitted"), genCurrentDateTime("Deadline", 3)]
    }
};
