const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl"); // Import the ShortUrl model
 require("dotenv").config();

// Connect to MongoDB Atlas
const uri = process.env.DB_URI;
mongoose.connect(uri);

const db = mongoose.connection;

// Event listeners for MongoDB connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB Atlas');
});

// Middleware
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.set("view engine", "ejs"); // Set the view engine to EJS

// Routes

// Route for rendering the homepage and displaying existing short URLs
app.get('/', async (req, res) => {
  try {
    const urls = await ShortUrl.find(); // Fetch all existing short URLs from the database
    res.render("index", { urlsData: urls }); // Render the index template with the URLs data

  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).send("Internal Server Error"); // Return a 500 error if there's a problem fetching URLs
  }
});

// Route for creating a new short URL
app.post('/fus', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl }); // Create a new short URL document in the database
    res.redirect("/"); // Redirect back to the homepage after creating the URL

  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).send("Internal Server Error"); // Return a 500 error if there's a problem creating the short URL
  }
});

// Route for redirecting to the original URL based on the short URL slug
app.get("/:fus", async (req, res) => {
  try {
    const url = await ShortUrl.findOne({ ssid: req.params.fus }); // Find the short URL document in the database
    if (url) {
      res.redirect(url.full); // Redirect to the original URL if the short URL is found
    } else {
      res.status(404).send("URL Not Found"); // Return a 404 error if the short URL is not found
    }
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Internal Server Error"); // Return a 500 error if there's a problem redirecting
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});