const AWS = require('aws-sdk')

const getObj = (params) => {
    console.log(params)
    const s3 = new AWS.S3();
    return new Promise(resolve => {
        s3.getObject(params, function(err, data) {
            if (err) {
                console.log(err)
                resolve(false);
            } else {
                resolve(data.Body);
            }
        });
    });
};

const putObj = (params) => {
    const s3 = new AWS.S3();
    return new Promise(resolve => {
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
                resolve(false);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    getObj,
    putObj,
};
