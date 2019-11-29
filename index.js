const http = require('http');
const url = require("url");
const {StringDecoder} = require("string_decoder");
const routeHandler = require('./handlers/route.handler');

const server = {};

/**
 * @function : httpServer
 * @description : create server and route the particular req to its handler, if not found then return 404 not found
 * @type {Server}
 */
server.httpServer = http.createServer((req, res) => {
    // get the url and parsed it
    const parsedUrl = url.parse(req.url, true);

    // get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the http method
    const method = req.method.toLowerCase();

    // get query string as an object
    const queryStringObject = parsedUrl.query;

    // get http req headers
    const headers = req.headers;

    // get the payload, if any
    const decoder = new StringDecoder("utf-8");
    let buffer = '';
    req.on("data", (chunk) => {
        buffer += decoder.write(chunk);
    });

    req.on("end", async () => {
        buffer += decoder.end();

        const dataToSendToHandler = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        /*
        @Todo : send dataToSendToHandler to route handler and get the statusCode
        if the status code is other than 405, send to controller
        else send the response with 405, method not allowed
         */

        const receivedData = await routeHandler.init(dataToSendToHandler);
        sendResponse(receivedData.statusCode, receivedData.payload);

        // async function choseHandler(trimmedPath) {
        //     if (handler[trimmedPath]) {
        //         const receivedData = await handler[trimmedPath]();
        //         console.log('receivedData.statusCode', receivedData.statusCode);
        //         sendResponse(receivedData.statusCode, receivedData.payload);
        //     } else {
        //         const receivedData = await handler.notFound();
        //         console.log('receivedData', receivedData);
        //         sendResponse(receivedData.statusCode, receivedData.payload);
        //     }
        // }

        // await choseHandler(trimmedPath);

        function sendResponse(statusCode, payload) {
            try {
                const statusCodeToSend = typeof statusCode === 'number' ? statusCode : 200;
                const payloadToSend = typeof payload === 'object' ? payload : {};
                const stringifyPayload = JSON.stringify(payloadToSend);

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(statusCodeToSend);
                res.end(stringifyPayload);
            } catch (err) {
                console.log('error', err);
            }
        }
    })
});

// Start the server
server.httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000');
});


const handler = {};


handler.sample = () => {
    return new Promise((resolve) => {
        return resolve({statusCode: 200, payload: {msg: 'Sample route is working'}});
    })
};

handler.notFound = () => {
    return new Promise((resolve) => {
        return resolve({statusCode: 404, payload: {error: 'Page not found'}});
    })
};

module.exports = server;