const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

const adminRoute = express.Router();
adminRoute.get('/dashboard', (req, res) => {
	console.log(req.baseUrl);
	console.log(req.originalUrl);
	console.log(req.path);
	res.send('We are in Admin Dashboard');
});

app.use('/admin', adminRoute);

app.get('/about', (req, res) => {
	console.log(req.app.get('view app engine')); // use the express app module
	console.log(req.accepts('json')); // define header accepts
	console.log(req.get('content-type')); // get any header value
	res.send(`<h1> About Page </h1>`);
});

app.get('/help', (req, res) => {
	res.json({
		message: 'Help page'
	});
});

app.get('/', (req, res) => {
	console.log(req.route);
	res.send(`<h1> Hello World </h1>`);
});

app.get('/view', (req, res) => {
	console.log(res.headersSent);
	res.render('pages/about', {
		name: 'Bangladesh'
	});
});

app.get('/hello', (req, res) => {
	// res.send('Hello');
	res.status(200);
	res.end();
	// or can write
	// res.sendStatus(200);
});

app.get('/test', (req, res) => {
	res.send('hello');
});

app.get('/hi', (req, res) => {
	res.format({
		'text/plain': () => {
			res.send('hi');
		},
		'text/html': () => {
			res.render('pages/about', {
				name: 'hello'
			});
		},
		'application/json': () => {
			res.json({
				message: 'hello'
			});
		},
		default: () => {
			res.status(406).send('Not Acceptable');
		}
	});
});

app.get('/cookie', (req, res) => {
	res.cookie('name', 'haumaukhau');
	res.end();
});

app.get('/location', (req, res) => {
	res.redirect('/test');
	res.end();
});

app.get('/handler', (req, res) => {
	res.set('hello', 'world');
	console.log(res.get('hello'));
	res.end();
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
