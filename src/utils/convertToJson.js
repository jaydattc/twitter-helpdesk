const convertToJson = (body) => JSON.parse(`{"${body.split('=').join('":"').split('&').join('","')}"}`);

exports.default = convertToJson;
