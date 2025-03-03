const express = require("express");
const {
  getAllContracts,
  getContractById,
  getContractByContractAddress,
  addContract,
  updateContractByAddress,
  deleteContract,
} = require("../../controller/contracts/contracts.controller");

const contractRoute = express.Router();

contractRoute.get("/", getAllContracts);
contractRoute.get("/:id", getContractById);
contractRoute.get("/address/:contractAddress", getContractByContractAddress);
contractRoute.post("/", addContract);
contractRoute.patch("/address/:contractAddress", updateContractByAddress);
contractRoute.delete("/address/:contractAddress", deleteContract);

module.exports = contractRoute;
