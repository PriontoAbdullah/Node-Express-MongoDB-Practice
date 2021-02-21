/*
 * Title: Utilities
 * Description: Important utility function
 * Author: Prionto Abdullah
 * Date: 21/02/21
 *
 */
// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
	let output;

	try {
		output = JSON.parse(jsonString);
	} catch (err) {
		output = {};
	}

	return output;
};

// hash string
utilities.hash = (str) => {
	if (typeof str === 'string' && str.length > 0) {
		let hash = crypto
			.createHmac('sha256', environments.secretKey)
			.update(str)
			.digest('hex');

		return hash;
	}
	return false;
};

// export module
module.exports = utilities;
