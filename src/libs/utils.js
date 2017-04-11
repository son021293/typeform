import formidable from "formidable";

export function parseForm(request) {
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