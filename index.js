const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ra2hb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        const database = client.db("mr_mail");
        const serviceCollection = database.collection("services");
        const bookingCollection = database.collection("booking");

        // get all the services from database
        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // get single service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.json(result)
        })

        // save booking to database api
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        })

        // get all bookings
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let results;
            const count = await cursor.count();

            if (page) {
                results = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                results = await cursor.toArray();
            }
            res.send({
                count,
                results
            });
        })


    } finally {
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Parcel delivery server is running");
})

app.listen(port, () => {
    console.log('Server is running from', port);
})