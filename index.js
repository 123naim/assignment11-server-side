const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mileston11data.n9pqtum.mongodb.net/?retryWrites=true&w=majority`;

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
        

        const assignmentDataCollection = client.db('assignmentData').collection('data')
        const assignmentSubmiteDataCollection = client.db('assignmentSubmiteData').collection('data')


        app.get('/data', async (req, res) => {
            const cursor = assignmentDataCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/data/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const user = await assignmentDataCollection.findOne(query)
            res.send(user)
        })

        // Submite Assignment data Get Pending
        app.get('/submite', async (req, res) => {
            const cursor = assignmentSubmiteDataCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/submite/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const user = await assignmentSubmiteDataCollection.findOne(query)
            res.send(user)
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            console.log('New Post', post);
            const result = await assignmentDataCollection.insertOne(post);
            res.send(result);
        })

        // Submite Assignment data POST
        app.post('/submite', async (req, res) => {
            const post = req.body;
            console.log('New Post', post);
            const result = await assignmentSubmiteDataCollection.insertOne(post);
            res.send(result);
        })

        app.put('/data/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    title: user.title,
                    image: user.image,
                    level: user.level,
                    email: user.email,
                    mark: user.mark,
                    date: user.date,
                    description: user.description
                }
            }
            const result = await assignmentDataCollection.updateOne(query, updatedUser, option);
            res.send(result)
        })



        // give mark update start
        app.put('/submite/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    marks: user.marks,
                    assignmentStatus: user.assignmentStatus
                }
            }
            const result = await assignmentSubmiteDataCollection.updateOne(query, updatedUser, option);
            res.send(result)
        })
        // give mark update end



        app.delete('/data/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Please Delete from database", id);
            const query = { _id: new ObjectId(id) }
            const result = await assignmentDataCollection.deleteOne(query)
            res.send(result)

        })

        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`assignment runnign............... ${port}`)
})