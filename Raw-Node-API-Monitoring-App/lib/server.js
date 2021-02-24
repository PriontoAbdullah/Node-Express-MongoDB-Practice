/*
 * Title: Server library
 * Description: server related files
 * Author: Prionto Abdullah
 * Date: 24/02/21
 *
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');

// module scaffolding
const server = {};

// create server
server.createServer = () => {
	const createOwnServer = http.createServer(server.handleReqRes);
	createOwnServer.listen(environment.port, () => {
		console.log(`server listening on port ${environment.port}`);
	});
};

// handle request response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
	server.createServer();
};

// export module
module.exports = server;
