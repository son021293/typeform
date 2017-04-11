import {parseForm} from "../libs/utils";
import {controller, post, get, ExpressController} from "../libs/express";

let submittedForms = [];

@controller("/api/typeform")
class TypeFormCtrl extends ExpressController{
    constructor({auth, sheetId}) {
        super();
        this.auth = auth;
        this.sheetId = sheetId;
    }

    @post()
    async post(req, res){
        console.log(req);
        const {fields, files} = await parseForm(req);
        submittedForms.push(fields);
        res.json({fields: fields});
        res.status(200).end();
    }

    @get('/submitted-forms')
    getSubmittedForms(req, res) {
        res.json({forms: submittedForms});
        res.status(200).end();
    }
}

export default TypeFormCtrl;