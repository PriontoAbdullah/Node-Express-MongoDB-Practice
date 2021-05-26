const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const myRouter = require('./myRouter');
const userRouter = require('./userRouter');

const app = express();

app.use(express.json()); // build in label middleware
app.use(cookieParser()); // 3rd party label middleware
// app.use(morgan('dev'));
app.set('view engine', 'ejs');

const adminRoute = express.Router();

const myMiddleware = (req, res, next) => {
	console.log('I am middleware');
	next();
	// res.end();
};

const loggerWrapper = (options) => {
	return function(req, res, next) {
		if (options.log) {
			console.log(
				`${new Date(
					Date.now()
				).toLocaleString()} - ${req.method} - ${req.originalUrl} - ${req.protocol} - ${req.ip}`
			);
			next();
		} else {
			throw new Error('Failed to log');
		}
	};
};

const logger = (req, res, next) => {
	console.log(
		`${new Date(Date.now()).toLocaleString()} - ${req.method} - ${req.originalUrl} - ${req.protocol} - ${req.ip}`
	);
	// next();
	throw new Error('This is middleware error');
};

const errorMiddleware = (err, req, res, next) => {
	console.log(err.message);
	res.status(500).send('There was an error processing');
};

app.use('/admin', adminRoute);
app.use('/wp', myRouter); // router
myRouter.all('*', myMiddleware);

// User Router
app.use('/users', userRouter);

app.use(myMiddleware); // application label middleware
adminRoute.use(loggerWrapper({ log: true })); // configurable middleware
// adminRoute.use(logger); // router label middleware
adminRoute.use(errorMiddleware); // error handling middleware

adminRoute.get('/dashboard', (req, res) => {
	console.log(req.baseUrl);
	console.log(req.originalUrl);
	console.log(req.path);
	res.send('We are in Admin Dashboard');
});


app.get('/about', morgan('dev'), (req, res) => {
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
	res.cookie('name', 'Hello');
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
