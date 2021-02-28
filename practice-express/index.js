const express = require('express');

const app = express();

app.use(express.json());

app.get('/about', (req, res) => {
	res.send(`<h1> About Page </h1>`);
});

app.get('/help', (req, res) => {
	res.json({
		message: 'Help page'
	});
});

app.get('/', (req, res) => {
	res.send(`<h1> Hello World </h1>`);
});

app.post('/', (req, res) => {
	console.log(req.body.name);
	res.send('This is home page with post request');
});

app.get('*', (req, res) => {
	res.send(`<h1> 404 Not Found </h1>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
