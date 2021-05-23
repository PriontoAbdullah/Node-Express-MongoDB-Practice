const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
	fs.readFile('./index.html', (err, data) => {
		if (err) {
			console.log(err.message);
		}

		res.write(data);
		res.end();
	});
});

server.listen(3000, () => {
	console.log('listening on port 3000');
});
