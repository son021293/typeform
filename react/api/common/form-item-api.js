import {api} from "../api";

export const formItemApi = {
    getForms:()=> api.get("/submitted-forms")
};