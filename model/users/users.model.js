// // ==========================
// // Module Import
// // ==========================
// const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction

// // ==========================
// // User Schema Definition
// // ==========================
// const UserSchema = mongoose.Schema({
//     uid: {
//         type: String, // Unique identifier for the user
//         required: true, // UID is required
//         unique: true, // UID must be unique
//     },
//     evmAddress: {
//         type: String, // Ethereum Virtual Machine (EVM) address
//         required: true, // EVM address is required
//         unique: true, // EVM address must be unique
//     },
//     signCrt: {
//         type: String, // Certificate date or creation date
//         required: true, // Certificate date is required
//     },
//     signKey: {
//         type: String, // Key associated with the user
//         required: true, // Key is required
//     },
//     createdAt: {
//         type: Date, // Date when the user was created
//         default: Date.now, // Default to current date
//     },
// }, {
//     timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
// });

// // ==========================
// // Export User Model
// // ==========================
// module.exports = mongoose.model("User", UserSchema); // Export the User model based on the schema


//New

// ==========================
// Module Import
// ==========================
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction

// ==========================
// User Schema Definition
// ==========================
const UserSchema = mongoose.Schema({
    uid: {
        type: String, // Unique identifier for the user
        required: false, // UID is required
    },
    evmAddress: {
        type: String, // Ethereum Virtual Machine (EVM) address
        required: false, // EVM address is required
    },
    signCrt: {
        type: String, // Certificate date or creation date
        required: false, // Certificate date is required
    },
    signCsr: {
        type: String, // Certificate Signing Request content
        required: false, // CSR content is required
    },
    signKey: {
        type: String, // Key associated with the user
        required: false, // Key is required
    },
    tlsCsr: {
        type: String, // TLS Certificate Signing Request content
        required: false, // TLS CSR content is required
    },
    tlsKey: {
        type: String, // TLS Key associated with the user
        required: false, // TLS Key is required
    },
    createdAt: {
        type: Date, // Date when the user was created
        default: Date.now, // Default to current date
    },
}, {
    timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
});

// ==========================
// Export User Model
// ==========================
module.exports = mongoose.model("User", UserSchema); // Export the User model based on the schema