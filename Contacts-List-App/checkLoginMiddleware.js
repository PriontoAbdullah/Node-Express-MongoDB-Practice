const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
	const { authorization } = req.headers;

	try {
		const token = authorization.split(' ')[1];
		const payload = jwt.verify(token, process.env.JWT_SECRET);

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
