/*
 * Title: Routes
 * Description: Application Routes
 * Author: Prionto Abdullah
 * Date: 20/02/21
 *
 */

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

const routes = {
	sample: sampleHandler,
};

module.exports = routes;
