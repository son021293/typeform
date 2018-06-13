import {appApi} from "./api-config";

export const typeformApi = {
    getForms: () => appApi.get("/submitted-forms")
};