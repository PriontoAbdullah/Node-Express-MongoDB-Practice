/*
 * Title: UserHandler
 * Description: Route handler to handle User relegated Handler
 * Author: Prionto Abdullah
 * Date: 21/02/21
 */

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
	const acceptedProperties = [ 'get', 'post', 'put', 'delete' ];
	if (acceptedProperties.indexOf(requestProperties.method) > -1) {
		handler._users[requestProperties.method](requestProperties, callback);
	} else {
		callback(405);
	}
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
	const firstName =
		typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0
			? requestProperties.body.firstName
			: false;

	const lastName =
		typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0
			? requestProperties.body.lastName
			: false;

	const phone =
		typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11
			? requestProperties.body.phone
			: false;

	const password =
		typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false;

	const tosAgreement =
		typeof requestProperties.body.tosAgreement === 'boolean' && requestProperties.body.tosAgreement
			? requestProperties.body.tosAgreement
			: false;

	if (firstName && lastName && phone && password && tosAgreement) {
		// make sure that the user doesn't have already exists
		data.read('users', phone, (err1) => {
			if (err1) {
				const userObject = {
					firstName,
					lastName,
					phone,
					password: hash(password),
					tosAgreement
				};

				// store the user to the database
				data.create('users', phone, userObject, (err2) => {
					if (!err2) {
						callback(200, {
							message: 'User was created successfully'
						});
					} else {
						callback(500, {
							error: 'Could not create user'
						});
					}
				});
			} else {
				callback(500, {
					error: 'There was an error in server side!'
				});
			}
		});
	} else {
		callback(400, {
			error: 'You have a problem in your request'
		});
	}
};

handler._users.get = (requestProperties, callback) => {
	// check the phone number if valid
	const phone =
		typeof requestProperties.queryStringObject.phone === 'string' &&
		requestProperties.queryStringObject.phone.trim().length === 11
			? requestProperties.queryStringObject.phone
			: false;

	if (phone) {
		// verify token
		let token =
			typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;

		tokenHandler._token.verify(token, phone, (tokenId) => {
			if (tokenId) {
				// lookup the user
				data.read('users', phone, (err, userData) => {
					const user = { ...parseJSON(userData) };
					if (!err && user) {
						delete user.password;
						callback(200, user);
					} else {
						callback(404, {
							error: 'Request user not found!'
						});
					}
				});
			} else {
				callback(403, {
					error: 'Authentication failure!'
				});
			}
		});
	} else {
		callback(404, {
			error: 'Request user not found!'
		});
	}
};

handler._users.put = (requestProperties, callback) => {
	// check the phone number if valid
	const phone =
		typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11
			? requestProperties.body.phone
			: false;

	const firstName =
		typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0
			? requestProperties.body.firstName
			: false;

	const lastName =
		typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0
			? requestProperties.body.lastName
			: false;

	const password =
		typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false;

	if (phone) {
		if (firstName || lastName || password) {
			// verify token
			let token =
				typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;

			tokenHandler._token.verify(token, phone, (tokenId) => {
				if (tokenId) {
					// lookup the user
					data.read('users', phone, (err1, user) => {
						const userData = { ...parseJSON(user) };

						if (!err1 && userData) {
							if (firstName) {
								userData.firstName = firstName;
							}
							if (lastName) {
								userData.lastName = lastName;
							}
							if (password) {
								userData.password = hash(password);
							}

							// store to database
							data.update('users', phone, userData, (err2) => {
								if (!err2) {
									callback(200, {
										message: 'User was updated successfully'
									});
								} else {
									callback(500, {
										error: 'There was a problem updating in the server side'
									});
								}
							});
						} else {
							callback(400, {
								error: 'You have problem in your request'
							});
						}
					});
				} else {
					callback(403, {
						error: 'Authentication failure!'
					});
				}
			});
		} else {
			callback(400, {
				error: 'You have problem in your request'
			});
		}
	} else {
		callback(400, {
			error: 'Invalid phone number. PLease try again!'
		});
	}
};

handler._users.delete = (requestProperties, callback) => {
	// check the phone number if valid
	const phone =
		typeof requestProperties.queryStringObject.phone === 'string' &&
		requestProperties.queryStringObject.phone.trim().length === 11
			? requestProperties.queryStringObject.phone
			: false;

	if (phone) {
		// verify token
		let token =
			typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;

		tokenHandler._token.verify(token, phone, (tokenId) => {
			if (tokenId) {
				// lookup the user
				data.read('users', phone, (err1, userData) => {
					if (!err1 && userData) {
						data.delete('users', phone, (err2) => {
							if (!err2) {
								callback(200, {
									message: 'User was successfully deleted!'
								});
							} else {
								callback(500, {
									error: 'There was a server side error'
								});
							}
						});
					} else {
						callback(500, {
							error: 'There was a server side error'
						});
					}
				});
			} else {
				callback(403, {
					error: 'Authentication failure!'
				});
			}
		});
	} else {
		callback(400, {
			error: 'There was a problem in your request!'
		});
	}
};

module.exports = handler;
