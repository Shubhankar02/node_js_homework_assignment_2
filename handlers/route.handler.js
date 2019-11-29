const assert = require('assert');

const objectBuildingUtils = require('../utils/object-builder.utils');

const routeHandler = {};

routeHandler.routeName = {
    user: '/user'
};

routeHandler.availableMethods = {
    user: ['GET', 'POST', 'PUT', 'DELETE']
};

routeHandler.init = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            assert(data, 'Missing data');
            const path = data.trimmedPath;
            const method = data.method;

            // Check if the path exist
            const isPathExist = await checkAvailabilityOfRoute(path);
            if (isPathExist) {
                const isMethodAvailable = await checkAvailabilityOfMethod(method, path);
                if (isMethodAvailable) {
                    // route to particular controller
                } else {
                    return reject(objectBuildingUtils.getErrorResponse(405));
                }
            } else {
                return resolve(objectBuildingUtils.getErrorResponse(404));
            }
        } catch (err) {
            console.log('error', err);
            return reject(objectBuildingUtils.getErrorResponse(500));
        }
    })
};


function checkAvailabilityOfRoute(routeName) {
    return new Promise(async (resolve, reject) => {
        try {
            assert(routeName, 'Missing routeName');

            const routeName = routeHandler.routeName[routeName];
            if (routeName) {
                return resolve(true);
            } else {
                return reject('route not found');
            }
        } catch (err) {
            console.log('error', err);
            return reject(err);
        }
    })
}

/**
 *
 * @param {String} method
 * @param {String} routeName
 * @returns {Promise<Object>}
 */
function checkAvailabilityOfMethod(method, routeName) {
    return new Promise(async (resolve, reject) => {
        try {
            const method = routeHandler.availableMethods[routeName].indexOf(method);
            if (method > -1) {
                // route to the controller
            } else {
                return reject('method not found');
            }
        } catch (err) {
            console.log('error', err);
            return reject(err);
        }
    })
}

module.exports = routeHandler;