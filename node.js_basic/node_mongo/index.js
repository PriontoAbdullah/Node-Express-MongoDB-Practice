const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const users = ['Jodu', 'Modu', 'Kodu', 'Mofiz'];

// get request
app.get('/', (req, res) => {
    const fruit = {
        product: 'mango',
        price: 220
    }
    res.send(fruit);
});

app.get('/fruits/banana', (req, res) => {
    res.send({ fruit: 'banana', quantity: 10, price: 100 });
})

app.get('/users/:id', (req, res) => {
    const id = (req.params.id);
    console.log(req.query.sort);
    const name = users[id];
    res.send({ name, id });
})

//post request
app.post('/addUser', (req, res) => {
    // console.log('Data Received', req.body);
    //save to database
    const user = req.body;
    user.id = 52;
    res.send(user);
})

app.listen(3000, () => console.log('Listening to port 3000'));

