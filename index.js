const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aezqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server
        await client.connect(); //The await here ensures that the code will pause until the connection is successful. Nothing below it will run until the connection completes.

        // Send a ping to confirm a successful connection

        // const database = client.db("sample_mflix"); // database er nam
        // const movies = database.collection("movies"); //collection er nam

        const coffeeCollection = client.db("coffeeDB").collection('coffee') // database er nam=>coffeeDB // collection er nam=>coffee
        const userCollection = client.db('coffeeDB').collection('user');

        // ================================
        // method-1 create
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        // method-2 read
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // specific read
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        // method-3 update
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    quantity: updatedCoffee.quantity,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        // method-4 delete
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result);
        })

        // ========> BIKE <========

        const bikeCollection = client.db("bikesDB").collection('bikes')
        // bike-create
        app.post('/bikes', async (req, res) => {
            const newBike = req.body;
            console.log(newBike);
            const result = await bikeCollection.insertOne(newBike)
            res.send(result)
        })
        // sever a dekhar jonno get kora lagbei
        app.get('/bikes', async (req, res) => {
            const cursor = bikeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bikeCollection.findOne(query);
            res.send(result)
        })
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bikeCollection.deleteOne(query);
            res.send(result);
        })
        app.put('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedBike = req.body;
            const options = { upsert: true }
            const bike = {
                $set: {
                    name: updatedBike.name,
                    model: updatedBike.model,
                    supplier: updatedBike.supplier,
                    category: updatedBike.category,
                    brand: updatedBike.brand,
                    photo: updatedBike.photo,
                    price: updatedBike.price
                }
            }
            const result = await bikeCollection.updateOne(filter, bike, options)
            res.send(result);
        })
        // user related apis
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.patch('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        // ================================

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('coffee making server is running')
})

app.listen(port, () => {
    console.log(`coffee server is running on port: ${port}`);
})