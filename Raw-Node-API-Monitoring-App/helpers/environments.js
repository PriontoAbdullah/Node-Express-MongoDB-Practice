/*
 * Title: Environments
 * Description: Handle all environments related settings 
 * Author: Prionto Abdullah
 * Date: 21/02/21
 *
 */

// module scaffolding
const environments = {};

environments.staging = {
	port: 3000,
	envName: 'staging',
	secretKey: '#AeIoU71@BD;(heX].4o4$',
	maxChecks: 5,
	twilio: {
		fromPhone: '+15128903314',
        accountSid: 'ACa6f4372ce519cbdd160b4d074a2baa88',
        authToken: 'c41ab8ad6928dbce58c76cf82d1c2f38',
	}
};

environments.production = {
	port: 5000,
	envName: 'production',
	secretKey: '#AeIoU71@BD;(heX].4o4$',
	maxChecks: 5,
	twilio: {
		fromPhone: '+15128903314',
        accountSid: 'ACa6f4372ce519cbdd160b4d074a2baa88',
        authToken: 'c41ab8ad6928dbce58c76cf82d1c2f38',
	}
};

//determine witch environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
	typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
