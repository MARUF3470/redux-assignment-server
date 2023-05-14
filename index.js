const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());
require('dotenv').config()


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.x5paqdg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    const productCollection = client.db('redux-assignment').collection('products')
    try {
        await client.connect();
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id
            const product = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: product
            };
            const result = await productCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
