/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitoring up or down time of user defined links
 * Author: Prionto Abdullah
 * Date: 19/02/21
 *
 */

// dependencies
const http = require('http');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
	port: 3000
};

// create server
app.createServer = () => {
	const server = http.createServer(app.handleReqRes);
	server.listen(app.config.port, () => {
		console.log(`server listening on port ${app.config.port}`);
	});
};

// handle request response
app.handleReqRes = (req, res) => {
	// response handle
	res.end('Hello world!');
};

// start the server
app.createServer();