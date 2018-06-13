import {apiFactory} from "./api-factory/api-factory";

const apiConfig = {
    hostURL: "/api/typeform"
};

export const appApi = apiFactory.createApi(apiConfig);