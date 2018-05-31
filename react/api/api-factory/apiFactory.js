import {sendRequest} from "./ajax-config";

export const apiFactory = {
    createApi: ({hostURL, headers, beforeSend}) => {
        const withPayload = method => (url, data) => {
            return sendRequest({
                url: hostURL + url,
                data,
                type: method,
                beforeSend,
                headers
            });
        };
        const withoutPayload = method => url => {
            return sendRequest({
                url: hostURL + url,
                type: method,
                beforeSend,
                headers
            });
        };

        return {
            get: withoutPayload("GET"),
            post: withPayload("POST"),
            put: withPayload("PUT"),
            delete: withoutPayload("DELETE")
        }
    }
};