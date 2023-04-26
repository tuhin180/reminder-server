const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a23wjbh.mongodb.net/?retryWrites=true&w=majority`;

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
    const reminderCollection = client
      .db("reminder")
      .collection("user-reminder");

    app.post("/reminder", async (req, res) => {
      const newReminder = req.body;
      const result = await reminderCollection.insertOne(newReminder);
      res.send(result);
    });

    app.get("/reminder/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await reminderCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/reminder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await reminderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("reminder server is running");
});
app.listen(port, () => console.log(`reminder is running on port ${port}`));
