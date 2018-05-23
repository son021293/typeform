let request = (url, type, data) => new Promise((resolve, reject) => {
    let ajaxConfig = {
        url: url,
        contentType: "application/json",
        type: type,
        success: (data) => {
            resolve(data);
        },
        error: (err) => {
            reject(err);
        }
    };


    if (data) {
        ajaxConfig.data = JSON.stringify(data);
    }
    $.ajax(ajaxConfig);
});

const host =url=> "http://localhost:9090/api/typeform"+url;

export const api = {
    get: (url) => {
        return request(host(url), "GET");
    },
    post: (url, data) => {
        console.log(data)
        return request(host(url), "POST", data);
    },
    put: (url, data) => {
        return request(host(url), "PUT", data);
    },
    delete: (url) => {
        return request(host(url), "DELETE");
    },
};