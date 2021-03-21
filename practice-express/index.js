const express = require('express');
const cookieParser = require('cookie-parser');
const { handler } = require('./handler');

const app = express();

app.use(express.json());
app.use(cookieParser());

const adminRoute = express.Router();
adminRoute.get('/dashboard', (req, res) => {
	console.log(req.baseUrl);
	console.log(req.originalUrl);
	console.log(req.path);
	res.send('We are in Admin Dashboard');
});

app.use('/admin', adminRoute);

app.get('/about', handler);

app.get('/help', (req, res) => {
	res.json({
		message: 'Help page'
	});
});

app.get('/', (req, res) => {
	console.log(req.route);
	res.send(`<h1> Hello World </h1>`);
});

app.get('/user/:id', (req, res) => {
	console.log(req.params);
	res.send('Welcome my world!');
});

app.post('/', (req, res) => {
	console.log(req.body.name);
	console.log(req.cookies);
	res.send('This is home page with post request');
});

app.post('/user', (req, res) => {
	console.log(req.body);
	res.send('This is  post request');
});

app.get('*', (req, res) => {
	res.send(`<h1> 404 Not Found </h1>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
