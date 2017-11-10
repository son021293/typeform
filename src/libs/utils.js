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
        return _.camelCase(q.replace(/\W/, '')).indexOf(_q) === 0;
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

function isValidQuestion(key) {
    return /q\d+\_(.+)/.exec(key) != null
}

const formatText = (text) => _.unescape(("" + text).replace(/&#039;/g, "&#39;"));

export function parseForm({pretty, rawRequest}) {
    let parsedForm = {};
    const prettyQuestions = pretty.replace(/\,\s((?:\d{1,2}\.|[A-Z][\w\(\)]+)(?:\s[\w\(\)\.\?\s\`\'\/\,\"\#\&\;]*\:|\:))/g, ",\n$1").split(",\n");
    const rawData = _.omit(JSON.parse(rawRequest), ["event_id", "slug"]);

    for(const key in rawData) {
        if (isValidQuestion(key)) {
            const questionNum = getQuestionNumber(key);
            const prettyQuestion = prettyQuestions.find(q => isQuestion(q, questionNum)) || "";
            let rawAnswer = rawData[key];
            if (prettyQuestion.length > 0 && !_.isEmpty(rawAnswer)) {
                parsedForm[questionNum] = {
                    question: prettyQuestion.replace(/\:{1,2}.+/, ""),
                    answer:  _.isArray(rawAnswer)
                        ? rawAnswer.map(i => formatText(i))
                        : _.isObject(rawAnswer)
                            ? rawAnswer
                            : formatText(rawAnswer)
                };
            }
        }
    }

    return parsedForm;
}