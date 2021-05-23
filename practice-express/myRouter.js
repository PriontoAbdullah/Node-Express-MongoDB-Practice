const express = require('express');

const myRouter = express.Router();

myRouter.get('/', (req, res) => {
	res.send('Dashboard');
});

myRouter.get('/login', (req, res) => {
	console.log(req.query);
	let {email, password} = req.query;
	res.send(`Login user is ${email}`);
});

myRouter.param('userID', (req, res, next, id) => {
	req.user = id === '1' ? 'Admin' : 'Anonymous';
	next();
});

myRouter.get('/:userID', (req, res) => {
	console.log(req.params);
	res.send(`Hello ${req.user}`);
});

myRouter
	.route('/admin/user')
	.all((req, res, next) => {
		console.log('I am logging in');
		next();
	})
	.get((req, res) => {
		res.send('GET');
	})
	.post((req, res) => {
		res.send('POST');
	})
	.put((req, res) => {
		res.send('PUT');
	})
	.delete((req, res) => {
		res.send('DELETE');
	});

module.exports = myRouter;
