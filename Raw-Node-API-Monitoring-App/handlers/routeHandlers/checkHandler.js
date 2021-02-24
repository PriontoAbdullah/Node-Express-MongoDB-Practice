/*
 * Title: Check Handler
 * Description: Route handler to handle User defined checks
 * Author: Prionto Abdullah
 * Date: 24/02/21
 */

// dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
	const acceptedProperties = [ 'get', 'post', 'put', 'delete' ];
	if (acceptedProperties.indexOf(requestProperties.method) > -1) {
		handler._check[requestProperties.method](requestProperties, callback);
	} else {
		callback(405);
	}
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
	// validate inputs
	let protocol =
		typeof requestProperties.body.protocol === 'string' &&
		[ 'http', 'https' ].indexOf(requestProperties.body.protocol) > -1
			? requestProperties.body.protocol
			: false;

	let url =
		typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0
			? requestProperties.body.url
			: false;

	let method =
		typeof requestProperties.body.method === 'string' &&
		[ 'GET', 'POST', 'PUT', 'DELETE' ].indexOf(requestProperties.body.method) > -1
			? requestProperties.body.method
			: false;

	let successCodes =
		typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array
			? requestProperties.body.successCodes
			: false;

	let timeoutSeconds =
		typeof requestProperties.body.timeoutSeconds === 'number' &&
		requestProperties.body.timeoutSeconds % 1 === 0 &&
		requestProperties.body.timeoutSeconds >= 1 &&
		requestProperties.body.timeoutSeconds <= 5
			? requestProperties.body.timeoutSeconds
			: false;

	if (protocol && url && method && successCodes && timeoutSeconds) {
		// verify token
		let token =
			typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;

		// lookup the user phone by reading the token
		data.read('tokens', token, (err1, tokenData) => {
			if (!err1 && tokenData) {
				let userPhone = parseJSON(tokenData).phone;

				// look up the user data
				data.read('users', userPhone, (err2, userData) => {
					if (!err2 && userData) {
						tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
							if (tokenIsValid) {
								let userObject = parseJSON(userData);
								let userChecks =
									typeof userObject.checks === 'object' && userObject.checks instanceof Array
										? userObject.checks
										: [];

								if (userChecks.length < maxChecks) {
									let checkId = createRandomString(20);
									let checkObject = {
										id: checkId,
										userPhone: userPhone,
										protocol: protocol,
										url: url,
										method: method,
										successCodes: successCodes,
										timeoutSeconds: timeoutSeconds
									};

									//save the check object
									data.create('checks', checkId, checkObject, (err3) => {
										if (!err3) {
											// add check id to the user's object
											userObject.checks = userChecks;
											userObject.checks.push(checkId);

											// save the new user data
											data.update('users', userPhone, userObject, (err4) => {
												if (!err4) {
													// return the data about the new check
													callback(200, checkObject);
												} else {
													callback(500, {
														error: 'There was a problem in the server side'
													});
												}
											});
										} else {
											callback(500, {
												error: 'There was a problem in the server side!'
											});
										}
									});
								} else {
									callback(401, {
										error: 'User already reached max check limit'
									});
								}
							} else {
								callback(403, {
									error: 'Authentication problem'
								});
							}
						});
					} else {
						callback(403, {
							error: 'User not found'
						});
					}
				});
			} else {
				callback(403, {
					error: 'Authentication problem'
				});
			}
		});
	} else {
		callback(400, {
			error: 'You have a problem in your request'
		});
	}
};

handler._check.get = (requestProperties, callback) => {
	// check the token id if valid
	const id =
		typeof requestProperties.queryStringObject.id === 'string' &&
		requestProperties.queryStringObject.id.trim().length === 20
			? requestProperties.queryStringObject.id
			: false;

	if (id) {
		// lookup the check
		data.read('checks', id, (err, checkData) => {
			if (!err && checkData) {
				// verify token
				let token =
					typeof requestProperties.headerObject.token === 'string'
						? requestProperties.headerObject.token
						: false;

				tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
					if (tokenIsValid) {
						callback(200, parseJSON(checkData));
					} else {
						callback(403, {
							error: 'Authentication failure!'
						});
					}
				});
			} else {
				callback(500, {
					error: 'You have a problem in your request'
				});
			}
		});
	} else {
		callback(400, {
			error: 'You have a problem in your request'
		});
	}
};

handler._check.put = (requestProperties, callback) => {
	let id =
		typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20
			? requestProperties.body.id
			: false;

	// validate inputs
	let protocol =
		typeof requestProperties.body.protocol === 'string' &&
		[ 'http', 'https' ].indexOf(requestProperties.body.protocol) > -1
			? requestProperties.body.protocol
			: false;

	let url =
		typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0
			? requestProperties.body.url
			: false;

	let method =
		typeof requestProperties.body.method === 'string' &&
		[ 'GET', 'POST', 'PUT', 'DELETE' ].indexOf(requestProperties.body.method) > -1
			? requestProperties.body.method
			: false;

	let successCodes =
		typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array
			? requestProperties.body.successCodes
			: false;

	let timeoutSeconds =
		typeof requestProperties.body.timeoutSeconds === 'number' &&
		requestProperties.body.timeoutSeconds % 1 === 0 &&
		requestProperties.body.timeoutSeconds >= 1 &&
		requestProperties.body.timeoutSeconds <= 5
			? requestProperties.body.timeoutSeconds
			: false;

	if (id) {
		if (protocol || url || method || successCodes || timeoutSeconds) {
			data.read('checks', id, (err1, checkData) => {
				if (!err1 && checkData) {
					let checkObject = parseJSON(checkData);
					let token =
						typeof requestProperties.headerObject.token === 'string'
							? requestProperties.headerObject.token
							: false;

					tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
						if (tokenIsValid) {
							if (protocol) {
								checkObject.protocol = protocol;
							}
							if (url) {
								checkObject.url = url;
							}
							if (method) {
								checkObject.method = method;
							}
							if (successCodes) {
								checkObject.successCodes = successCodes;
							}
							if (timeoutSeconds) {
								checkObject.timeoutSeconds = timeoutSeconds;
							}

							// store the check object
							data.update('checks', id, checkObject, (err2) => {
								if (!err2) {
									callback(200);
								} else {
									callback(500, {
										error: 'There was a server side error'
									});
								}
							});
						} else {
							callback(403, {
								error: 'Authentication error'
							});
						}
					});
				} else {
					callback(500, {
						error: 'You have a problem in your request'
					});
				}
			});
		} else {
			callback(400, {
				error: 'You must provide at least one field to update'
			});
		}
	} else {
		callback(400, {
			error: 'You have a problem in your request'
		});
	}
};

handler._check.delete = (requestProperties, callback) => {
	const id =
		typeof requestProperties.queryStringObject.id === 'string' &&
		requestProperties.queryStringObject.id.trim().length === 20
			? requestProperties.queryStringObject.id
			: false;

	if (id) {
		// lookup the check
		data.read('checks', id, (err1, checkData) => {
			if (!err1 && checkData) {
				let token =
					typeof requestProperties.headerObject.token === 'string'
						? requestProperties.headerObject.token
						: false;

				tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
					if (tokenIsValid) {
						// delete the check data
						data.delete('checks', id, (err2) => {
							if (!err2) {
								data.read('users', parseJSON(checkData).userPhone, (err3, userData) => {
									let userObject = parseJSON(userData);
									if (!err3 && userData) {
										let userChecks =
											typeof userObject.checks === 'object' && userObject.checks instanceof Array
												? userObject.checks
												: [];

										// remove the deleted check id from user's list of checks
										let checkPosition = userChecks.indexOf(id);
										if (checkPosition > -1) {
											userChecks.splice(checkPosition, 1);
											// re-save the user data
											userObject.checks = userChecks;
											data.update('users', userObject.phone, userObject, (err4) => {
												if (!err4) {
													callback(200);
												} else {
													callback(500, {
														error: 'There was a server side problem'
													});
												}
											});
										} else {
											callback(500, {
												error: 'The check id that you are trying to remove is not found in user'
											});
										}
									} else {
										callback(500, {
											error: 'There was a server side problem'
										});
									}
								});
							} else {
								callback(500, {
									error: 'There was a server side problem'
								});
							}
						});
					} else {
						callback(403, {
							error: 'Authentication failure'
						});
					}
				});
			} else {
				callback(500, {
					error: 'You have a problem in your request'
				});
			}
		});
	} else {
		callback(400, {
			error: 'You have a problem in your request'
		});
	}
};

module.exports = handler;
