// ==========================
// Model Import
// ==========================
const {
  kmsDecrypt,
  kmsEncrypt,
} = require("../../middleware/users/kmsEncryption");
const UserModel = require("../../model/users/users.model"); // Import the User model
const crypto = require("crypto");

// ==========================
// Controller Functions
// ==========================

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}); // Fetch all users from the database
    console.log(users); // Log the retrieved users
    res.status(200).json(users); // Respond with the users and a 200 status
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }); // Handle errors and respond with a 500 status
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from request parameters
    const user = await UserModel.findById(id); // Fetch the user by ID
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      }); // Handle case where user is not found
    }
    console.log(user); // Log the retrieved user
    res.status(200).json(user); // Respond with the user and a 200 status
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }); // Handle errors and respond with a 500 status
  }
};

//Encryption
const SECRETKEY = "MASTERKEY1234567"; //"50iy9HLNEwdYQEwUq055wcLemjWAf0EH"
const aesEncryption = (data, key) => {
  try {
    const cipher = crypto.createCipheriv(
      "aes-128-ecb",
      Buffer.from(key, "utf8"),
      null
    );
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed");
  }
};

const aesDecryption = async (encryptedData, key) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-128-ecb",
      Buffer.from(key, "utf8"),
      null
    );
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Decryption failed");
  }
};

const getUserByUid = async (req, res) => {
  try {
    const { uid } = req.params; // Extract the UID from request parameters
    // Validate UID format
    if (
      !uid ||
      typeof uid !== "string" ||
      uid.trim() === "" ||
      !/^[a-zA-Z0-9]+$/.test(uid)
    ) {
      return res.status(400).json({ message: "Invalid UID format" });
    }
    // Fetch the user by UID
    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Log the fetched user object
    console.log("Fetched user:", JSON.stringify(user, null, 2));
    // Define the encryption key
    const encryptionKey = SECRETKEY; // Ensure this is 16 bytes
    const combinedResponse = {
      uid: user.uid, // Keep uid as is
    };
    // Iterate over each field in the user object
    for (const key in user._doc) {
      // Accessing _doc directly
      if (user._doc.hasOwnProperty(key) && key !== "uid") {
        // Exclude 'uid'
        // If the field is a string, attempt to decrypt it
        if (typeof user._doc[key] === "string") {
          // const decryptedValue = await aesDecryption(user._doc[key], encryptionKey);
          const decryptedValue = await kmsDecrypt(user._doc[key]);
          combinedResponse[key] = decryptedValue; // Add decrypted value to response
        } else {
          // If not a string, just add the original value
          combinedResponse[key] = user._doc[key];
        }
      }
    }
    // Log the final combined response data
    console.log(
      "Combined response data:",
      JSON.stringify(combinedResponse, null, 2)
    );
    // Respond with the combined response data
    res.status(200).json(combinedResponse);
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addUser = async (req, res) => {
  try {
    const encryptionKey = SECRETKEY; // Your encryption key
    const encryptedUser = {};
    // Iterate through each key in the request body
    for (const [key, value] of Object.entries(req.body)) {
      // Skip encryption for uid
      if (key === "uid") {
        encryptedUser[key] = value; // Keep uid as is
      } else if (typeof value === "string") {
        // encryptedUser[key] = aesEncryption(value, encryptionKey); // Encrypt the value
        encryptedUser[key] = await kmsEncrypt(value); // Encrypt the value
      } else {
        encryptedUser[key] = value; // Keep non-string values as is
      }
    }
    const user = await UserModel.create(encryptedUser); // Create a new user using the encrypted data
    console.log(user); // Log the created user
    res.status(201).json(user); // Respond with the created user and a 201 status
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }); // Handle errors and respond with a 500 status
  }
};

const updateUserByUid = async (req, res) => {
  try {
    const { uid } = req.params; // Extract UID from request parameters
    // Validate UID format
    if (!uid || typeof uid !== "string" || uid.trim() === "") {
      return res.status(400).json({ message: "Invalid UID format" });
    }
    // Fetch the user by UID
    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const encryptionKey = SECRETKEY; // Your encryption key
    // Encrypt all string values in the request body, except for uid
    for (const [key, value] of Object.entries(req.body)) {
      // Skip encryption for uid
      if (key === "uid") {
        user[key] = value; // Keep uid as is
      } else if (typeof value === "string") {
        // user[key] = aesEncryption(value, encryptionKey); // Encrypt the value
        user[key] = await kmsEncrypt(value); // Encrypt the value
      } else {
        user[key] = value; // Keep non-string values as is
      }
    }
    await user.save(); // Save changes
    console.log(user); // Log the updated user
    res.status(200).json(user); // Respond with updated user data
  } catch (error) {
    console.error("Error updating user by UID:", error);
    res.status(500).json({ message: error.message });
  }
};
//Encryption

// Get a user by UID
// const getUserByUid = async (req, res) => {
//   try {
//     const { uid } = req.params; // Extract the UID from request parameters
//     // Validate UID format (optional)
//     if (!uid || typeof uid !== "string" || uid.trim() === "") {
//       return res.status(400).json({ message: "Invalid UID format" });
//     }
//     // Fetch the user by UID
//     const user = await UserModel.findOne({ uid });
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       }); // Handle case where user is not found
//     }
//     console.log(user); // Log the retrieved user
//     res.status(200).json(user); // Respond with the user and a 200 status
//   } catch (error) {
//     console.error("Error fetching user by UID:", error); // Log the error for debugging
//     res.status(500).json({
//       message: error.message,
//     }); // Handle errors and respond with a 500 status
//   }
// };

// Add a new user
// const addUser = async (req, res) => {
//   try {
//     const user = await UserModel.create(req.body); // Create a new user using request body
//     console.log(user); // Log the created user
//     res.status(201).json(user); // Respond with the created user and a 201 status
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     }); // Handle errors and respond with a 500 status
//   }
// };

// Edit an existing user
// const updateUserByUid = async (req, res) => {
//   try {
//     const { uid } = req.params; // Extract UID from request parameters

//     // Validate UID format
//     if (!uid || typeof uid !== "string" || uid.trim() === "") {
//       return res.status(400).json({ message: "Invalid UID format" });
//     }
//     // Fetch the user by UID
//     const user = await UserModel.findOne({ uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Update the user with the data provided in the request body
//     Object.assign(user, req.body); // Update only fields provided in req.body
//     await user.save(); // Save changes
//     console.log(user); // Log the updated user
//     res.status(200).json(user); // Respond with updated user data
//   } catch (error) {
//     console.error("Error updating user by UID:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from request parameters
    const user = await UserModel.findByIdAndDelete(id); // Delete the user by ID
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      }); // Handle case where user is not found
    }
    res.status(200).json({
      message: "User deleted",
    }); // Respond with a success message and a 200 status
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }); // Handle errors and respond with a 500 status
  }
};

const validateSignature = async (req, res) => {
  try {
    res.status(200).json({ message: "Signature validated successfully" });
  } catch (error) {
    console.error("Error verifying signature:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ==========================
// Export Controller Functions
// ==========================
module.exports = {
  getAllUsers,
  getUserById,
  getUserByUid,
  addUser,
  updateUserByUid,
  deleteUser,
  validateSignature
};
