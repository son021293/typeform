import omit from "lodash/omit";
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

export function parseForm(_rawData) {
    let parsedForm = {};
    const rawData = omit(_rawData, ["event_id", "slug"]);

    function getQuestionNumber(key) {
        return /q\d+\_(\d+)\w+/.exec(key)[1];
    }

    for(const key in rawData) {
        parsedForm[getQuestionNumber(key)] = rawData[key];
    }

    return parsedForm;
}