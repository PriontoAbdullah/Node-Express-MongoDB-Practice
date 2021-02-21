/*
 * Title: Routes
 * Description: Application Routes
 * Author: Prionto Abdullah
 * Date: 20/02/21
 *
 */

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

const routes = {
	sample: sampleHandler,
	user: userHandler
};

module.exports = routes;
