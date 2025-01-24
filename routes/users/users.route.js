// ==========================
// Module Imports
// ==========================
const express = require("express"); // Import Express framework
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUserByUid,
  deleteUser,
  getUserByUid,
  validateSignature,
} = require("../../controller/users/users.controller"); // Import user controller functions
const verifySignature = require("../../middleware/users/users.middleware");

// ==========================
// Router Initialization
// ==========================
const userRoute = express.Router(); // Create a new router instance for user routes

// ==========================
// Route Definitions
// ==========================
userRoute.get("/", getAllUsers); // GET all users
userRoute.get("/:id", getUserById); // GET a user by ID
userRoute.get("/uid/:uid", getUserByUid); // GET a user by UID //original without using middleware verifySignature
// userRoute.get("/uid/:uid", verifySignature, getUserByUid); // GET a user by UID
userRoute.post("/", addUser); // POST a new user
userRoute.patch("/uid/:uid", updateUserByUid); // PUT (update) a user by ID
userRoute.delete("/:uid", deleteUser); // DELETE a user by ID
userRoute.post("/validate", verifySignature, validateSignature);

// ==========================
// Export Router
// ==========================
module.exports = userRoute; // Export the router for use in the main application
