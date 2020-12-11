const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;


const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9ypd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
 
    
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const productsCollection = client.db('emaJohnStore').collection('products');
    console.log('database connection successfully');

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            // console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({ })
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productsCollection.find({ key: { $in: productsKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    const ordersCollection = client.db('emaJohnStore').collection('orders');

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            // console.log(result);
            res.send(result.insertedCount > 0)
        })
    })
    
});


app.get('/', (req, res) => {
	res.send('Welcome Ema-jhon');
});

app.listen(port, () => {
	console.log('listening on port');
});