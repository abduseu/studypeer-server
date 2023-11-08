const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.rkpusfk.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Users code start from here:

    const database = client.db('studypeerDB')
    const assignments = database.collection('assignments')
    const submittedAssignments = database.collection('submitted_assignments')

    /* START CRUD OPERATIONS FOR ASSIGNMENTS */
    //Assignments >> create
    app.post('/assignments', async(req, res)=>{
      const createAssign = req.body

      const result = await assignments.insertOne(createAssign)
      res.send(result)
    })

    //Assignments >> read
    app.get('/assignments', async(req, res)=>{
      const result = await assignments.find().toArray()
      res.send(result)
    })
    //Assignments >> read one
    app.get('/assignments/:id', async(req, res)=>{
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await assignments.findOne(filter)
      res.send(result)
    })
    //Assignments >> read by difficulty
    app.get('/difficulty/:id', async(req, res)=>{
      const id = req.params.id

      const filter = { difficulty: id }
      const result = await assignments.find(filter).toArray()
      res.send(result)
    })

    //Assignments >> delete
    app.delete('/assignments/:id', async(req, res)=>{
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await assignments.deleteOne(filter)
      res.send(result)
    })

    //Assignments >> Update
    app.put('/assignments/:id', async(req, res)=>{
      const id = req.params.id
      const updateAssign = req.body

      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          title: updateAssign.title,
          description: updateAssign.description,
          difficulty: updateAssign.difficulty,
          marks: updateAssign.marks,
          image: updateAssign.image,
          dueDate: updateAssign.dueDate
        }
      }
      
      const result = await assignments.updateOne(filter, updateDoc)
      res.send(result)
    })

    /* START CRUD OPERATIONS FOR SUBMITTED ASSIGNMENTS */
    //Submitted Assignments >> Create
    app.post('/submitted', async(req, res)=>{
      const submitAssign = req.body

      const result = await submittedAssignments.insertOne(submitAssign)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to server')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})