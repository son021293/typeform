import {getDateObjectAnswer, getLink} from "./rule-utils";

export const MarketingRequestRules = {
    A: {
        sheet: "Submissions",
        // condition: (form) => getSheetType(form, "Issue") && form[87].answer == "No",
        slack: {
            webHookUrl: "https://hooks.slack.com/services/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",
            channel: process.env.NODE_ENV == "development" ? "#mdr_test" : "#marketing",
            questions: [14, 26, 16, 17, 20, getDateObjectAnswer(19), getDateObjectAnswer(21), 22, 15, getLink(24), getLink(25), 13]
        },
        rule: [14, 26, 16, 17, 20, getDateObjectAnswer(19), getDateObjectAnswer(21), 22, 15, [getLink(24), getLink(25)], 13]
    },
};
