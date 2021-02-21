/*
 * Title: Handle Request Response
 * Description: Handle Request Response
 * Author: Prionto Abdullah
 * Date: 20/02/21
 *
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const {parseJSON} = require('../helpers/utilities');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
	// request handling
	// get the url and parse it
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');
	const method = req.method.toLowerCase();
	const queryStringObject = parsedUrl.query;
	const headerObject = req.headers;

	const requestProperties = {
		parsedUrl,
		path,
		trimmedPath,
		method,
		queryStringObject,
		headerObject
	};

	// get the request body
	const decoder = new StringDecoder('utf-8');
	let realData = '';

	const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

	req.on('data', (buffer) => {
		realData += decoder.write(buffer);
	});

	req.on('end', () => {
		realData += decoder.end();

		requestProperties.body = parseJSON(realData);

		// handle the route function
		chosenHandler(requestProperties, (statusCode, payload) => {
			statusCode = typeof statusCode === 'number' ? statusCode : 500;
			payload = typeof payload === 'object' ? payload : {};

			const payloadString = JSON.stringify(payload);

			// return the final response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
		});
	});
};

module.exports = handler;