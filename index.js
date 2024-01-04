const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// ready made middleware
app.use(cors());
app.use(express.json())



// database


const uri = "mongodb+srv://Mindful:aXU37KwRwIGiHdgj@cluster0.pcnyajy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const userCollection = client.db("MindfulDB").collection("users");

        app.post('/users', async (req, res) => {
            const userInfo = req.body
            const result = await userCollection.insertOne(userInfo)
            res.send(result)
        })


        app.get('/users', async (req, res) => {
            const email = req.query.email
            const status = req.query.status
            console.log(email)
            let query = { email }
            if (status) {
                query.status = { status }
            }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        app.put('/tasktodo/:id', async (req, res) => {
            const id = req.params.id
            const info = req.body
            const filter = { _id: new ObjectId(id) }
            const updatedoc = {
                $set: {
                    status: info.status
                }
            }
            const result = await userCollection.updateOne(filter, updatedoc)
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(filter)
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const user = req.body
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    name: user.name,
                    addedEmail: user.addedEmail,
                    phone: user.phone,
                    
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// root api
app.get('/', (req, res) => {
    res.send('Mindful server is running')
})

// where the server port is
app.listen(port, () => {
    console.log(`Mindful server running on port: ${port}`)
})