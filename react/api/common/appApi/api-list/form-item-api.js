import {appApi} from "../appApiConfig";

export const formItemApi = {
    getForms: () => appApi.get("/submitted-forms")
};