const express = require('express');

const myRouter = express.Router();

myRouter.get('/', (req, res) => {
	res.send('Dashboard');
});

myRouter.get('/login', (req, res) => {
	res.send('Login');
});

myRouter.param('user', (req, res, next, id) => {
	req.user = id === '1' ? 'Admin' : 'Anonymous';
	next();
});

myRouter.get('/:user', (req, res) => {
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
