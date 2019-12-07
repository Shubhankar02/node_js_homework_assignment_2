const assert = require('assert');
const debuglog = require('util').debuglog(process.env.NODE_DEBUG);

const controllerMaster = require('../controllers/controllerMaster');

const objectBuildingUtils = require('../utils/object-builder.utils');

const routeHandler = {};

routeHandler.routeName = {
    user: '/user',
    sample: '/sample'
};

routeHandler.availableMethods = {
    user: ['GET', 'POST', 'PUT', 'DELETE'],
    sample: ['GET']
};

/**
 * @description : Main function to handle route
 * @param data
 * @returns {Promise<Object>}
 */
routeHandler.init = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            assert(data, 'Missing data');
            const path = data.trimmedPath;
            const method = data.method;

            // Check if the path exist
            const doesPathExist = await checkAvailabilityOfRoute(path);
            if (doesPathExist) {
                const isMethodAvailable = await checkAvailabilityOfMethod(method, path);
                if (isMethodAvailable) {
                    // route to particular controller
                    const getResponseFromController = await controllerMaster.getResponseFromControllers(method, path);
                    debuglog('getResponseObject', getResponseFromController);
                    return resolve(getResponseFromController);
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

/**
 * @description : Check the availability of route
 * @param route
 * @returns {Promise<Boolean | Object>}
 */
function checkAvailabilityOfRoute(route) {
    return new Promise(async (resolve, reject) => {
        try {
            assert(route, 'Missing route');

            const routeName = routeHandler.routeName[route];
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
            const indexOfMethod = routeHandler.availableMethods[routeName].indexOf(method);
            if (indexOfMethod > -1) {
                return resolve(true);
            } else {
                return reject('indexOfMethod not found');
            }
        } catch (err) {
            console.log('error', err);
            return reject(err);
        }
    })
}

module.exports = routeHandler;