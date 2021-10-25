const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config()

const cors = require('cors');
app.use(cors());
app.use(express.json());


const port = 5000;



app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


// user: genius_car_mechanics_user_01
// password: alGJPsUh2k5Z3EXe
//https://www.npmjs.com/package/dotenv


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uukv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);



async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        // create a document to insert

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET SINGLE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("getting specific id: ", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        //POST API
        app.post('/services', async (req, res) => {

            const service = req.body;
            console.log("Hit the post api: ", service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })



        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })










    } finally {
        // await client.close();
    }
}
run().catch(console.dir);