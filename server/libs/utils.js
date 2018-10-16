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

export const formatText = (text) => {
    const res = typeof text == "object" ? _.map(text, v => v).join("\n") : text;
    return _.unescape(("" + res).replace(/&#039;/g, "&#39;"))
};
