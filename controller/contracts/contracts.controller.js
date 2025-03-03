const Contract = require("../../model/contracts/contracts.model");

// Get all contracts
const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.getAll();
    console.log(contracts);
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a contract by ID
const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.getById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    console.log(contract);
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a contract by contract address
const getContractByContractAddress = async (req, res) => {
  try {
    const { contractAddress } = req.params;
    if (
      !contractAddress ||
      typeof contractAddress !== "string" ||
      contractAddress.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Invalid contract address format" });
    }
    const contract = await Contract.getByContractAddress(contractAddress);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    console.log(contract);
    res.status(200).json(contract);
  } catch (error) {
    console.error("Error fetching contract by address:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new contract
const addContract = async (req, res) => {
  try {
    const { contractAddress, contractName, abi, bin } = req.body;
    if (!contractAddress || !contractName || !abi || !bin) {
      return res.status(400).json({
        message:
          "All fields (contractAddress, contractName, abi, bin) are required.",
      });
    }
    const contract = new Contract(contractAddress, contractName, abi, bin);
    const contractId = await contract.save();
    console.log(`Contract created with ID: ${contractId}`);
    res.status(201).json({ id: contractId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing contract by address
const updateContractByAddress = async (req, res) => {
  try {
    const { contractAddress } = req.params;
    if (
      !contractAddress ||
      typeof contractAddress !== "string" ||
      contractAddress.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Invalid contract address format" });
    }
    const contract = await Contract.getByContractAddress(contractAddress);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    const updatedFields = req.body;
    const affectedRows = await Contract.updateByContractAddress(
      contractAddress,
      updatedFields
    );
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Contract not found or no changes applied" });
    }
    console.log(`Contract updated with address: ${contractAddress}`);
    res.status(200).json({ message: "Contract updated successfully" });
  } catch (error) {
    console.error("Error updating contract by address:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a contract by address
const deleteContract = async (req, res) => {
  try {
    const { contractAddress } = req.params;
    const affectedRows = await Contract.deleteByContractAddress(
      contractAddress
    );
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllContracts,
  getContractById,
  getContractByContractAddress,
  addContract,
  updateContractByAddress,
  deleteContract,
};
