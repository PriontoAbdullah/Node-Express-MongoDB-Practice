/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Prionto Abdullah
 * Date: 20/02/21
 *
 */

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
	console.log(requestProperties);
    
	callback(200, {
		message: 'sample url received'
	});
};

module.exports = handler;
