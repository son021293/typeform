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

export function parseForm({pretty, rawRequest}) {
    let parsedForm = {};
    const prettyQuestions = pretty.replace(/\s(\d+\.\s)/g, "\n$1").split(",\n");
    const rawData = _.omit(JSON.parse(rawRequest), ["event_id", "slug"]);

    const isQuestion = (q, _q) => q.indexOf(`${_q}. `) === 0;
    const getQuestionNumber = (key) => /q\d+\_(\d+)\w+/.exec(key)[1];
    const formatText = (text) => _.unescape(text.replace(/&#039;/g, "&#39;"));

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