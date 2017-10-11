import _ from "lodash";
import formidable from "formidable";

export function parseRequest(request) {
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(request, (err, fields, files) => {
            if (err) {
                reject(err)
            } else {
                resolve({fields, files});
            }
        });
    })
}

const isQuestion = (q, _q) => {
    const result = q.indexOf(`${_q}. `) === 0;

    if (result) {
        return result;
    } else {
        return _.camelCase(q).indexOf(_q) === 0;
    }
};
const getQuestionNumber = (key) => {
    const result = /q\d+\_(\d+)\w+/.exec(key);

    if (result) {
        return result[1];
    } else {
        return /q\d+\_(\w+)/.exec(key)[1];
    }
};
const formatText = (text) => _.unescape(("" + text).replace(/&#039;/g, "&#39;"));

export function parseForm({pretty, rawRequest}) {
    let parsedForm = {};
    const prettyQuestions = pretty.replace(/\s(\d+\.\s)/g, "\n$1").split(",\n");
    const rawData = _.omit(JSON.parse(rawRequest), ["event_id", "slug"]);

    for(const key in rawData) {
        const questionNum = getQuestionNumber(key);
        const prettyQuestion = prettyQuestions.find(q => isQuestion(q, questionNum)) || "";
        parsedForm[questionNum] = {
            question: prettyQuestion.replace(`:${_.isArray(rawData[key]) ? rawData[key].join(" ") : rawData[key]}`, ""),
            answer:  _.isArray(rawData[key])
                ? rawData[key].map(i => formatText(i))
                : formatText(rawData[key])
        };
    }

    return parsedForm;
}