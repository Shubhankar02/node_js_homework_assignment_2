const controllerMaster = {};
const assert = require('assert');
const debuglog = require('util').debuglog(process.env.NODE_DEBUG);
const objectBuildingUtil = require('../utils/object-builder.utils');
const sampleControllers = require('./sampleController');


const availableControllers = {
    sample: {
        GET: sampleControllers.get
    }
};

/**
 * @description : Get the response from specific controller
 * @param method
 * @param path
 * @returns {Promise<Object>}
 */
controllerMaster.getResponseFromControllers = (method, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            assert(path, 'Missing path');
            assert(method, 'Missing method');

            // check the availability of the controllers
            if (availableControllers.hasOwnProperty(path) && availableControllers[path].hasOwnProperty(method)) {
                const response = await availableControllers[path][method]();
                assert(response.statusCode, 'Missing status code from response object');
                assert(response.payload, 'Missing payload from response object');
                return resolve(response);
            } else {
                return resolve(objectBuildingUtil.getErrorResponse(501));
            }
        } catch (err) {
            debuglog('error', err);
            return reject(objectBuildingUtil.getErrorResponse(500));
        }
    });
};

module.exports = controllerMaster;