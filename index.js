const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vnidizo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const volunteerPostCollection = client
      .db("volunteerPostDB")
      .collection("volunteerPost");
    const beAVolunteerCollection = client
      .db("volunteerPostDB")
      .collection("beAvolunteerPost");

    app.post("/volunteerPost", async (req, res) => {
      const newVolunteer = req.body;
      const result = await volunteerPostCollection.insertOne(newVolunteer);
      res.send(result);
    });

    app.post("/beAVolunteerPost", async (req, res) => {
      const newVolunteer = req.body;
      const result = await beAVolunteerCollection.insertOne(newVolunteer);
      res.send(result);
    });

    app.get("/beAVolunteerPost/:email", async (req, res) => {
      const result = await beAVolunteerCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/volunteerPost", async (req, res) => {
      const cursor = volunteerPostCollection.find().sort({ date: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/volunteerPost/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await volunteerPostCollection.findOne(query);
      res.send(user);
    });

    app.get("/volunteerPost/:email", async (req, res) => {
      const result = await volunteerPostCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.delete("/volunteerPost/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerPostCollection.deleteOne(query);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
