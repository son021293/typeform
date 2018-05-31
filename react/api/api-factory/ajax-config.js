export const sendRequest = ({url, type, data, headers}) => new Promise((resolve, reject) => {
    let ajaxConfig = {
        url,
        contentType: "application/json",
        type,
        beforeSend: (xhr) => {
            if (headers && headers.length) {
                headers.map(({key, content}) => xhr.setRequestHeader(key, content));
            }
        },
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