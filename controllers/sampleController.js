const sampleController = {};
const debuglog = require('util').debuglog(process.env.NODE_DEBUG);
const objectBuildingUtil = require('../utils/object-builder.utils');

sampleController.get = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = objectBuildingUtil.getResponseObject(200, 'Hello World!');
            return resolve(response);
        } catch (err) {
            debuglog('error', err);
            return reject(objectBuildingUtil.getErrorResponse(500));
        }
    })
};

module.exports = sampleController;