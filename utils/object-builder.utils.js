const assert = require('assert');
const debuglog = require('util').debuglog(process.env.NODE_DEBUG || 'server');
const objectBuilderUtils = {};

/**
 *
 * @param {Number} statusCode
 * @param {Object | String} payload
 * @return {{payload: (String|Object), statusCode: Number}}
 */
objectBuilderUtils.getResponseObject = (statusCode, payload) => {
    try {
        assert(statusCode, 'Missing statusCode');
        assert(payload, 'Missing payload');

        debuglog('payload', typeof payload);

        return {
            statusCode: statusCode,
            payload: payload
        }
    } catch (err) {
        debuglog('error', err);
        return objectBuilderUtils.getErrorResponse(500);
    }
};

/**
 *
 * @param {Number} statusCode
 * @param {String | Object} [payload]
 * @returns {{payload: String | Object, statusCode: Number}}
 */
objectBuilderUtils.getErrorResponse = (statusCode, payload) => {
    try {
        assert(statusCode, 'Missing statusCode');
        if (!payload) {
            switch (statusCode) {
                case 400 :
                    payload = 'Bad request';
                    break;
                case 401 :
                    payload = 'Authentication error';
                    break;
                case 403 :
                    payload = 'You are not authorized for this request';
                    break;
                case 404 :
                    payload = 'Route does not exist';
                    break;
                case 405 :
                    payload = 'Method not allowed';
                    break;
                case 412 :
                    payload = 'Invalid state error';
                    break;
                case 500 :
                    payload = 'Internal server error';
                    break;
                case 501 :
                    payload = 'Not yet implemented';
                    break;
                default :
                    payload = 'Internal server error';

            }
            return {statusCode, payload}
        }
        return {statusCode, payload};
    } catch (err) {
        return (err);
    }

};

module.exports = objectBuilderUtils;