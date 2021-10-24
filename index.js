const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clvrh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const registeredCollection = client.db("aspirehive").collection("registratedUsers");
    const loggedInUsersCollection = client.db("aspirehive").collection("loggedInUsers");
    const adminsCollection = client.db("aspirehive").collection("admins");
    console.log("connected")


    app.post('/addRegisterData', (req, res) => {
        const newRegister = req.body;
        registeredCollection.insertOne(newRegister)
            .then(result => {
                res.send(result.insertedId > 0);
                console.log(result.insertedId);
            });
    });

    app.post('/addLoggedInData', (req, res) => {
        const newLogin = req.body;
        loggedInUsersCollection.insertOne(newLogin)
            .then(result => {
                res.send(result.insertedId > 0);
                console.log(result);
            });
    });

    app.post('/makeAdmin', (req, res) => {
        const newAdmin = req.body;
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedId > 0);
                console.log(result);
            });
    });

    app.get('/registeredUsersData', (req, res) => {
        registeredCollection.find()
            .toArray((err, items) => {
                res.send(items);
            });
    });

    app.get('/loggedInUsersData', (req, res) => {
        loggedInUsersCollection.find()
            .toArray((err, items) => {
                res.send(items);
            });
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0)
            })
    });


});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
