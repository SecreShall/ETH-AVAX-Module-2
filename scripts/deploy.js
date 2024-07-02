// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const ToDoList = await hre.ethers.getContractFactory("ToDoList");
  const todoList = await ToDoList.deploy();

  await todoList.deployed();

  console.log("ToDoList deployed to:", todoList.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
