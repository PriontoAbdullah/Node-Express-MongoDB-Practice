/*
 * Title: Notification Library
 * Description: Important function to notify user
 * Author: Prionto Abdullah
 * Date: 24/02/21
 *
 */

// dependencies
const https = require('https');
const { twilio } = require('./environments');
const queryString = require('querystring');

// module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
	// input validation
	const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
	const userMessage =
		typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

	if (userPhone && userMessage) {
		// configure the request payload
		const payload = {
			From: twilio.fromPhone,
			To: `+88${userPhone}`,
			Body: userMessage
		};

		// stringify the payload
		const stringifyPayload = queryString.stringify(payload);

		// configure the request details
		const requestDetails = {
			hostname: 'api.twilio.com',
			method: 'POST',
			path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
			auth: `${twilio.accountSid}:${twilio.authToken}`,
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		};

		// instantiate the request object
		const req = https.request(requestDetails, (res) => {
			// get the status of the send request
			const status = res.statusCode;
			// callback successfully if the request went through
			if (status === 200 || status === 201) {
				callback(false);
			} else {
				callback(`Status code returned was ${status}`);
			}
		});

		req.on('error', (err) => {
			callback(err);
		});

		req.write(stringifyPayload);
		req.end();
	} else {
		callback('Given parameters where missing or invalid!');
	}
};

// export module
module.exports = notifications;
