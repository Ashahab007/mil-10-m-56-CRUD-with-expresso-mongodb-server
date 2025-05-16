// 1.0 installed express mongodb dotenv with one command npm i express mongodb dotenv. After installation of express , In package.json file in "scripts" added "start": "node index.js",

// 2.0 setup express.js from express js documentation "Hello World"
const express = require("express");

// 4.2 import as per documentation
require("dotenv").config();
console.log(process.env.DB_USER); // check in server terminal
console.log(process.env.DB_PASS); // check in server terminal

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// 2.3 setup cors from Resource => middleware => cors from express js documentation
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// cofee_monster
// wIres4IiG0n3pJbT

//   4.0 My requirement is hide the user and password. as per documentation from dotenv create a .env file where package.json allocated.

// 3.0 Now my requirement is connect the database with the mongodb server so go to the mongodb atlas. first create a database user so go to database access => Add New Database User => set user name and auto generated password => role admin => Add User => now go to cluster => connect => driver => View full code sample => copy the code => change the <db_username> <db_password> with user and password then check the ping in server terminal.

// 4.3 Now use the user and password in uri dynamically

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmunlsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

/* const uri =
    "mongodb+srv://cofee_monster:wIres4IiG0n3pJbT@cluster0.bmunlsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; */

/* const uri =
  "mongodb+srv://cofee_monster:wIres4IiG0n3pJbT@cluster0.bmunlsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; */

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // 5.6 creating the coffee database name "coffeeDB" then create a file named "coffees" under "coffeeDB" to create data in the mongodb server.
    const coffeesCollections = client.db("coffeeDB").collection("coffees");
    // 13.3 creating the users file under coffeeDB database
    const usersCollections = client.db("coffeeDB").collection("users");

    // 5.5 create api to get the data from the form by post method from the "https://www.mongodb.com/docs/drivers/node/current/crud/insert/" with 'Insert a Single Document'
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);

      //  5.7 Now send the coffee data using insertOne method.In the db and u will get the data in db.
      const result = await coffeesCollections.insertOne(newCoffee);
      res.send(result);
    });

    // 7.0 my requirement is show the added coffee in ui using get method. in 5.7, "/coffees" from sever is used to save data in server. to get data and show in ui same "/coffees" path is used. In this method we use find() to get all the data form the db as per documentation 'https://www.mongodb.com/docs/drivers/node/current/crud/query/retrieve/'

    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollections.find();
      const result = await cursor.toArray(); //here toArray is not found in documentation. It's used from the module. Now check in browser url "localhost:3000/coffees" u will  get all the data
      res.send(result);
    });

    // 9.2 creating the api of view details using get method. Which is as similar as delete method with findOne method from the documentation.

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollections.findOne(query);
      res.send(result);
      // now u can check in url by "http://localhost:3000/coffees/6824c77ebe9e87690f2487fc" that desired coffee item is showing
    });

    // 10.4 use put method to get the data from client side following the documentation. We use updateOne() method
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body; //here the client side data is received via  body as object
      const updateDoc = {
        $set: updatedCoffee,
      };
      const result = await coffeesCollections.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // 8.4 creating the delete api from documentation using deleteOne method
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Creating the api for user information

    // 14.0 Now my current requirement is show the users in a table form from the db thats we use get and find method

    app.get("/users", async (req, res) => {
      const cursor = usersCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // 13.4 send the user info in db using post and insertOne() method
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);

      const result = await usersCollections.insertOne(newUser);

      res.send(result);
    });

    // 15.3 creating api for delete user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollections.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); commented because it will close the 0ping after first test. but we don't want to close it.
  }
}
run().catch(console.dir);

// 2.4 Use the middleware cors() and express.json() after that in running server terminal type nodemon index.js and then type in browser url localhost:3000 to show "Running hot expresso coffee in server" after that setup the client side
app.use(cors());
app.use(express.json());

// ! Note: express.json() particularly for POST, PUT, or PATCH requests where the client sends data to your server. It reads the Content-Type: application/json header. It parses the incoming JSON payload and populates req.body with the resulting object.

// 2.1 for checking the server
app.get("/", (req, res) => {
  res.send("Running hot expresso coffee in server");
});

// 2.2
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
