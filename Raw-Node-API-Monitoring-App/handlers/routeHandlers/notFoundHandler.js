/*
 * Title: Not Found Handler
 * Description: 404 Handler
 * Author: Prionto Abdullah
 * Date: 20/02/21
 *
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
	console.log(requestProperties);

	callback(404, {
		message: 'Your request was not found!'
	});
};

module.exports = handler;
