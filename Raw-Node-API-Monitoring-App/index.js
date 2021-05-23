/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitoring up or down time of user defined links
 * Author: Prionto Abdullah
 * Date: 19/02/21
 *
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');

// app object - module scaffolding
const app = {};

app.init = () => {
	// start the Server
	server.init();

	// start the workers
	workers.init();
};

app.init();

// export the app
module.exports = app;
