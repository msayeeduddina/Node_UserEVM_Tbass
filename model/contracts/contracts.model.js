const db = require("../../db");

class Contract {
  constructor(contractAddress, contractName, abi, bin, createdAt, updatedAt) {
    this.contractAddress = contractAddress;
    this.contractName = contractName;
    this.abi = abi;
    this.bin = bin;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  async save() {
    const abiString = JSON.stringify(this.abi);
    const [result] = await db.query(
      "INSERT INTO contracts (contractAddress, contractName, abi, bin, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        this.contractAddress,
        this.contractName,
        abiString,
        this.bin,
        this.createdAt,
        this.updatedAt,
      ]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query("SELECT * FROM contracts");
    return rows.map((row) => ({
      id: row.id,
      contractAddress: row.contractAddress,
      contractName: row.contractName,
      abi: row.abi ? JSON.parse(row.abi) : null,
      bin: row.bin,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  static async getById(id) {
    const [[contract]] = await db.query(
      "SELECT * FROM contracts WHERE id = ?",
      [id]
    );
    if (!contract) return null;
    return {
      id: contract.id,
      contractAddress: contract.contractAddress,
      contractName: contract.contractName,
      abi: contract.abi ? JSON.parse(contract.abi) : null,
      bin: contract.bin,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    };
  }

  static async getByContractAddress(contractAddress) {
    const [[contract]] = await db.query(
      "SELECT * FROM contracts WHERE contractAddress = ?",
      [contractAddress]
    );
    if (!contract) return null;
    return {
      id: contract.id,
      contractAddress: contract.contractAddress,
      contractName: contract.contractName,
      abi: contract.abi ? JSON.parse(contract.abi) : null,
      bin: contract.bin,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    };
  }

  static async updateByContractAddress(contractAddress, updatedFields) {
    const fieldsToUpdate = {};
    for (const [key, value] of Object.entries(updatedFields)) {
      if (
        key === "contractAddress" ||
        key === "contractName" ||
        key === "bin"
      ) {
        fieldsToUpdate[key] = value;
      } else if (key === "abi") {
        fieldsToUpdate[key] = JSON.stringify(value);
      }
    }
    const [result] = await db.query(
      "UPDATE contracts SET contractName = COALESCE(?, contractName), abi = COALESCE(?, abi), bin = COALESCE(?, bin), updatedAt = ? WHERE contractAddress = ?",
      [
        fieldsToUpdate.contractName || null,
        fieldsToUpdate.abi || null,
        fieldsToUpdate.bin || null,
        new Date(),
        contractAddress,
      ]
    );
    return result.affectedRows;
  }

  static async deleteByContractAddress(contractAddress) {
    const [result] = await db.query(
      "DELETE FROM contracts WHERE contractAddress = ?",
      [contractAddress]
    );
    return result.affectedRows;
  }
}

module.exports = Contract;
