const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
	const { authorization } = req.headers;

	try {
		// const token = authorization.split(' ')[1];
		const payload = jwt.verify(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFidWwiLCJ1c2VySWQiOiI2MGUzMGI3Mzc1ZTY4N2FhNDBjOTQ0Y2IiLCJpYXQiOjE2MjU0OTg4NzIsImV4cCI6MTYyNTUwNjA3Mn0.jh2FWmfTzP3JFsunFoOMoXdrw2fGNrZyKwMs1oo5ETM',
			process.env.JWT_SECRET
		);

		const { username, userId } = payload;
		req.username = username;
		req.userId = userId;
		next();
	} catch (err) {
		res.status(401).send({
			success: false,
			message: 'Unauthorized'
		});
		next(err);
	}
};

module.exports = checkLogin;
