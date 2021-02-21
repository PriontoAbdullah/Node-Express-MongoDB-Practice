/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitoring up or down time of user defined links
 * Author: Prionto Abdullah
 * Date: 19/02/21
 *
 */

// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

// app object - module scaffolding
const app = {};


// create server
app.createServer = () => {
	const server = http.createServer(app.handleReqRes);
	server.listen(environment.port, () => {
		console.log(`server listening on port ${environment.port}`);
	});
};

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
