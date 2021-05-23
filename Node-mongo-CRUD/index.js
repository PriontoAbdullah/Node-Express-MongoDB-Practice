const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');

const upload_folder = './uploads/';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri =
	'mongodb+srv://organicUser:U4etKLoTfZqaMdJp@cluster0.v9ypd.mongodb.net/organicdb?retryWrites=true&w=majority';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// define the storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, upload_folder);
	},
	filename: (req, file, cb) => {
		const fileExt = path.extname(file.originalname);
		const filename = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();

		cb(null, filename, fileExt);
	}
});

// prepare the final multer upload object
const upload = multer({
	storage: storage,
	limit: {
		fileSize: 1000000 // 1MB
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
			cb(null, true);
		} else {
			cb(new Error('Only .jpg .jpeg .png formate allowed'));
		}
	}
});

app.post('/', upload.single('avatar'), (req, res) => {
	res.send('Hello world');
});

client.connect((err) => {
	const productCollection = client.db('organicdb').collection('products');

	app.get('/products', (req, res) => {
		productCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/product/:id', (req, res) => {
		productCollection.find({ _id: ObjectId(req.params.id) }).toArray((err, documents) => {
			res.send(documents[0]);
		});
	});

	app.post('/addProduct', (req, res) => {
		const product = req.body;
		productCollection.insertOne(product).then((result) => {
			console.log('Product added successfully');
			res.redirect('/');
		});
	});

	app.delete('/delete/:id', (req, res) => {
		productCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
			res.send(result.deletedCount > 0);
		});
	});

	app.patch('/update/:id', (req, res) => {
		productCollection
			.updateOne(
				{ _id: ObjectId(req.params.id) },
				{
					$set: { price: req.body.price, quantity: req.body.quantity }
				}
			)
			.then((result) => {
				res.send(result.modifiedCount > 0);
			});
	});
});

// default error handler
app.use((err, req, res, next) => {
	if (err) {
		if (err instanceof multer.MulterError) {
			res.sendStatus(500).send('There was an upload error');
		} else {
			res.sendStatus(500).send(err.message);
		}
	} else {
		res.send('Success!');
	}
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});
