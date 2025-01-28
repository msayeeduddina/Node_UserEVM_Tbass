// // // ==========================
// // // Module Import
// // // ==========================
// // const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction

// // // ==========================
// // // User Schema Definition
// // // ==========================
// // const UserSchema = mongoose.Schema({
// //     uid: {
// //         type: String, // Unique identifier for the user
// //         required: true, // UID is required
// //         unique: true, // UID must be unique
// //     },
// //     evmAddress: {
// //         type: String, // Ethereum Virtual Machine (EVM) address
// //         required: true, // EVM address is required
// //         unique: true, // EVM address must be unique
// //     },
// //     signCrt: {
// //         type: String, // Certificate date or creation date
// //         required: true, // Certificate date is required
// //     },
// //     signKey: {
// //         type: String, // Key associated with the user
// //         required: true, // Key is required
// //     },
// //     createdAt: {
// //         type: Date, // Date when the user was created
// //         default: Date.now, // Default to current date
// //     },
// // }, {
// //     timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
// // });

// // // ==========================
// // // Export User Model
// // // ==========================
// // module.exports = mongoose.model("User", UserSchema); // Export the User model based on the schema

// //New

// // ==========================
// // Module Import
// // ==========================
// const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction

// // ==========================
// // User Schema Definition
// // ==========================
// const UserSchema = mongoose.Schema(
//   {
//     uid: {
//       type: String, // Unique identifier for the user
//       required: false, // UID is required
//     },
//     evmAddress: {
//       type: String, // Ethereum Virtual Machine (EVM) address
//       required: false, // EVM address is required
//     },
//     signCrt: {
//       type: String, // Certificate date or creation date
//       required: false, // Certificate date is required
//     },
//     signCsr: {
//       type: String, // Certificate Signing Request content
//       required: false, // CSR content is required
//     },
//     signKey: {
//       type: String, // Key associated with the user
//       required: false, // Key is required
//     },
//     tlsCsr: {
//       type: String, // TLS Certificate Signing Request content
//       required: false, // TLS CSR content is required
//     },
//     tlsKey: {
//       type: String, // TLS Key associated with the user
//       required: false, // TLS Key is required
//     },
//     createdAt: {
//       type: Date, // Date when the user was created
//       default: Date.now, // Default to current date
//     },
//   },
//   {
//     timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
//   }
// );

// // ==========================
// // Export User Model
// // ==========================
// module.exports = mongoose.model("User", UserSchema); // Export the User model based on the schema

//MYSQL_CODE_MODIFICATION/REPLACEMENT
// /*
// models/user.js

const db = require('../../db'); // Import the MySQL database connection

// User Model Definition
class User {
    constructor(uid, evmAddress, signCrt, signCsr, signKey, tlsCsr, tlsKey) {
        this.uid = uid; // Unique identifier for the user
        this.evmAddress = evmAddress; // Ethereum Virtual Machine (EVM) address
        this.signCrt = signCrt; // Certificate date or creation date
        this.signCsr = signCsr; // Certificate Signing Request content
        this.signKey = signKey; // Key associated with the user
        this.tlsCsr = tlsCsr; // TLS Certificate Signing Request content
        this.tlsKey = tlsKey; // TLS Key associated with the user
        this.createdAt = new Date(); // Default to current date
    }

    // Method to save a new user to the database
    async save() {
        const [result] = await db.query(
            "INSERT INTO users (uid, evmAddress, signCrt, signCsr, signKey, tlsCsr, tlsKey) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [this.uid, this.evmAddress, this.signCrt, this.signCsr, this.signKey, this.tlsCsr, this.tlsKey]
        );
        return result.insertId; // Return the ID of the newly created user
    }

    // Static method to get all users from the database
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM users");
        return rows;
    }

    // Static method to get a user by UID
    static async getByUid(uid) {
        const [[user]] = await db.query("SELECT * FROM users WHERE uid = ?", [uid]);
        return user;
    }

    // Static method to update a user by UID
    static async updateByUid(uid, updatedFields) {
        const { evmAddress, signCrt, signCsr, signKey, tlsCsr, tlsKey } = updatedFields;
        const [result] = await db.query(
            "UPDATE users SET evmAddress = ?, signCrt = ?, signCsr = ?, signKey = ?, tlsCsr = ?, tlsKey = ? WHERE uid = ?",
            [evmAddress, signCrt, signCsr, signKey, tlsCsr, tlsKey, uid]
        );
        return result.affectedRows; // Return number of affected rows
    }

    // Static method to delete a user by UID
    static async deleteByUid(uid) {
        const [result] = await db.query("DELETE FROM users WHERE uid = ?", [uid]);
        return result.affectedRows; // Return number of affected rows
    }
}

module.exports = User; // Export the User model class
// */