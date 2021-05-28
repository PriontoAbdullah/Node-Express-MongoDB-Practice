const express = require('express');
const morgan = require('morgan');
const contactRoutes = require('./contactRoutes');
const mongoose = require('mongoose');
const todoHandler = require('./todoHandler');
const router = require('./routes')
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/contacts', contactRoutes);
app.use('/todo', todoHandler);
app.use('/contact', router);


let Schema = mongoose.Schema;
let testSchema = new Schema({
	name: String
});

let Test = mongoose.model('Test', testSchema);

app.get('/', (req, res) => {
	let post = {
		title: 'Test Title',
		body: 'Test Body',
		published: true
	};

	let comments = [
		{ title: 'One', author: 'Abul' },
		{ title: 'Two', author: 'Hero' },
		{ title: 'Three', author: 'Alom' },
		{ title: 'Four', author: 'Ananta' }
	];
	res.render('index', { title: 'EJS is an awesome template engine', post, comments });
});

app.get('/test', (req, res) => {
	let test = new Test({
		name: 'Hero Alom'
	});

	test
		.save()
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'server error' });
		});
});

app.get('*', (req, res) => {
	res.send(`<h1>Please use the '/contacts' route</h1>`);
});

function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).json({ error: err });
}

const port = process.env.PORT || 8080;

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bhwg.mongodb.net/${process.env
			.DB_NAME}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => {
		app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
