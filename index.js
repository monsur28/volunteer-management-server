const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

<<<<<<< HEAD
// Middleware
app.use(cors());
app.use(express.json());
=======
// middleware
>>>>>>> c1e3210 (bug)

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
    const productCollection = client.db("ItmartDB").collection("product");

    // Updated /product endpoint with pagination, search, categorization, and sorting
    app.get("/product", async (req, res) => {
      const {
        page = 1,
        limit = 10,
        search = "",
        BrandName, // Use exact parameter names from frontend
        Category, // Use exact parameter names from frontend
        minPrice,
        maxPrice,
        sortBy,
      } = req.query;

      const query = {
        ProductName: { $regex: search, $options: "i" }, // Search by product name
      };

      // Filter by BrandName
      if (BrandName) {
        query.BrandName = BrandName;
      }

      // Filter by Category
      if (Category) {
        query.Category = Category;
      }

      // Filter by price range
      if (minPrice || maxPrice) {
        query.Price = {};
        if (minPrice) query.Price.$gte = Number(minPrice);
        if (maxPrice) query.Price.$lte = Number(maxPrice);
      }

      // Sorting options
      let sort = {};
      if (sortBy === "priceAsc") sort.Price = 1;
      if (sortBy === "priceDesc") sort.Price = -1;
      if (sortBy === "dateNewest") sort.createdAt = -1;
      if (sortBy === "dateOldest") sort.createdAt = 1;

      try {
        const products = await productCollection
          .find(query)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .toArray();

        const totalProducts = await productCollection.countDocuments(query);

        res.send({
          products,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: Number(page),
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ error: "Failed to fetch products" });
      }
    });

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("It Mart Running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
