// ==========================
// Environment Setup
// ==========================
require("dotenv").config(); // Load environment variables from .env file

// ==========================
// Module Imports
// ==========================
const express = require("express"); // Import Express framework
const db = require("./db"); // Import MySQL database connection ////MYSQL_CODE_MODIFICATION/REPLACEMENT
// const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction
const userRoute = require("./routes/users/users.route"); // Import user routes
const contractRoute = require("./routes/contracts/contracts.route"); // Import contracts routes

// ==========================
// Configuration
// ==========================
const PORT = process.env.PORT || 3000; // Set the port for the server, defaulting to 3000 if not specified

// ==========================
// Express Application Initialization
// ==========================
const app = express(); // Initialize the Express application

// ==========================
// Middleware Setup
// ==========================
app.use(express.json()); // Middleware to parse JSON request bodies

// ==========================
// Route Definitions
// ==========================
app.use("/api/users", userRoute); // Define routes for user-related API endpoints
app.use("/api/contracts", contractRoute);

//MYSQL_CODE_MODIFICATION/REPLACEMENT
// ==========================
// Database Connection
// ==========================
db.query("SELECT 1") // Simple query to test database connection
  .then(() => {
    console.log("Database connected successfully."); // Log successful connection
  })
  .catch((error) => {
    console.error("Database connection error:", error); // Log connection errors
  });

// ==========================
// Database Connection
// ==========================
// const MONGOOSE_CONNECT_URI = process.env.MONGOOSE_CONNECT_URI; // MongoDB connection URI
// mongoose
//   .connect(MONGOOSE_CONNECT_URI) // Connect to MongoDB
//   .then(() => {
//     console.log("Database connected successfully."); // Log successful connection
//   })
//   .catch((error) => {
//     console.error("Database connection error:", error); // Log connection errors
//   });

// ==========================
// Server Initialization
// ==========================
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`); // Log server start
});
