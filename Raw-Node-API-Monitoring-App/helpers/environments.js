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
	maxChecks: 5
};

environments.production = {
	port: 5000,
	envName: 'production',
	secretKey: '#AeIoU71@BD;(heX].4o4$',
	maxChecks: 5
};

//determine witch environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
	typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
