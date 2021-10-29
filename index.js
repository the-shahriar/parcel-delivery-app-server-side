const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Parcel delivery server is running");
})

app.listen(port, () => {
    console.log('Server is running from', port);
})