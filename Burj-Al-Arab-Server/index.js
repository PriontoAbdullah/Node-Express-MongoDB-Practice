const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

const uri =
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9ypd.mongodb.net/burjAlArab?retryWrites=true&w=majority`;

var serviceAccount = require('./red-onion-online-food-946d6-firebase-adminsdk-r4b23-33dc3a71f9.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://red-onion-online-food-946d6.firebaseio.com'
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const collection = client.db('burjAlArab').collection('bookings');
	console.log('database connection successfully');

	app.post('/addBooking', (req, res) => {
		const newBooking = req.body;
		collection.insertOne(newBooking).then((result) => {
			res.send(result.insertedCount > 0);
		});

		console.log(newBooking);
	});

	app.get('/bookings', (req, res) => {
		const bearer = req.headers.authorization;
		if (bearer && bearer.startsWith('Bearer ')) {
			const idToken = bearer.split(' ')[1];
			// console.log({ idToken });

			admin
				.auth()
				.verifyIdToken(idToken)
				.then(function(decodedToken) {
                    let tokenEmail = decodedToken.email;
                    let queryEmail = req.query.email;

					if (tokenEmail == queryEmail) {
                        collection.find({ email: queryEmail })
                            .toArray((err, documents) => {
							    res.send(documents);
						});
					}
				})
				.catch(function(err) {
					//handle error
				});
        }
        else {
            req.status(401).send('Unauthorized Access!'); 
        }
        

	});
});

app.get('/', (req, res) => {
	res.send('Welcome');
});

app.listen(port, () => {
	console.log('listening on port');
});
