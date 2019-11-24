const http = require('http');
const url = require("url");
const {StringDecoder} = require("string_decoder");

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

    req.on("end", () => {
        buffer += decoder.end();

        //@todo : Complete the route handler

    })
});

module.exports = server;