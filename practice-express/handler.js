

const handler = (req, res) => {
	console.log(req.app.get('view app engine')); // use the express app module 
	console.log(req.accepts('json')); // define header accepts
    console.log(req.get('content-type')); // get any header value
	res.send(`<h1> About Page </h1>`);
};

module.exports = handler;
