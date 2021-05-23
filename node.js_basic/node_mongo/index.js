const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());  // express cors middleware   
app.use(bodyParser.json());

const users = [ 'Jodu', 'Modu', 'Kodu', 'Mofiz' ];

//database connection
const dbUser = process.env.DB_USER;
const pass = process.env.DB_PASS;
const uri = `mongodb+srv://${dbUser}:${pass}@cluster0.xw1ix.mongodb.net/test?retryWrites=true&w=majority`;
let client = new MongoClient(uri, { useNewUrlParser: true });

// Manual database connection
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection
//     collection.insertOne({
//         name: 'Samsung',
//         price: 19990,
//         stock: 52
//     }, (er, res) => {
//         console.log('Successfully inserted');
//     })
//     console.log('Database connected...');
//     client.close();
// });

// get request
app.get('/products', (req, res) => {
	// connect server again
	client = new MongoClient(uri, { useNewUrlParser: true });

	client.connect((err) => {
		const collection = client.db('test').collection('devices');
		// perform actions on the collection
		collection.find().limit(5).toArray((err, documents) => {
			if (err) {
				console.log(err);
				res.status(500).send({ message: err });
			} else {
				// console.log('Successfully inserted', result);
				res.send(documents);
			}
		});
		client.close();
	});
});

app.get('/', (req, res) => {
	const fruit = {
		products: 'ada',
		price: 220
	};
	res.send(fruit);
});

app.get('/fruits/banana', (req, res) => {
	res.send({ fruit: 'banana', quantity: 10, price: 100 });
});

app.get('/users/:id', (req, res) => {
	console.log(req.params.id);
	const id = req.params.id;
	console.log(req.query.sort); // search query - sort
	const name = users[id];
	res.send({ name, id });
});

//post request
app.post('/addProduct', (req, res) => {
	// console.log('Data Received', req.body);
	//save to database
	const product = req.body;
	console.log(product);

	// connect server again
	client = new MongoClient(uri, { useNewUrlParser: true });

	client.connect((err) => {
		const collection = client.db('test').collection('devices');
		// perform actions on the collection
		collection.insertOne(product, (err, result) => {
			if (err) {
				console.log(err);
				res.status(500).send({ message: err });
			} else {
				// console.log('Successfully inserted', result);
				res.send(result.ops[0]);
			}
		});
		client.close();
	});
});
 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening to port 3000'));
