import {apiFactory} from "../../api-factory/apiFactory";

const appApiConfig = {
    hostURL: "http://localhost:9090/api/typeform"
};

export const appApi = apiFactory.createApi(appApiConfig);