<h1 align="center">ETH + AVAX PROOF: Intermediate EVM Course</h1>
<h1 align="center">Project: Function Frontend</h1>

# ToDoList Smart Contract

## Overview

ToDoList is a Solidity smart contract designed to manage tasks with basic CRUD (Create, Read, Update, Delete) operations. Users can create tasks, mark them as completed, and delete them.

## Features

- Create a new task with a description.
- Mark a task as completed or incomplete.
- Delete a task.

## Functionality

The contract provides the following functions:

- **Create Task**: `createTask(string memory _content)`
  - Adds a new task with the provided content to the list of tasks.
  - Emits `TaskCreated(uint id, string content, bool completed)` event.

- **Toggle Task Completed**: `toggleTaskCompleted(uint _id)`
  - Toggles the completion status of a task identified by `_id`.
  - Emits `TaskCompleted(uint id, bool completed)` event.

- **Delete Task**: `deleteTask(uint _id)`
  - Deletes the task identified by `_id` from the list of tasks.
  - Emits `TaskDeleted(uint id)` event.

- **Get Task**: `getTask(uint _id) public view returns (uint, string memory, bool)`
  - Retrieves details of the task identified by `_id`, including its ID, content, and completion status.

- **Get Task Count**: `getTaskCount() public view returns (uint)`
  - Returns the total number of tasks currently stored in the contract.

## Events

- **TaskCreated**: Emits when a new task is created.
  - Parameters: `id` (uint), `content` (string), `completed` (bool).

- **TaskCompleted**: Emits when a task's completion status is toggled.
  - Parameters: `id` (uint), `completed` (bool).

- **TaskDeleted**: Emits when a task is deleted.
  - Parameters: `id` (uint).

## Solidity Version

This contract is written in Solidity version ^0.8.9.

## Usage

To deploy and interact with the contract:

1. **Setup**: Inside the project directory, in the terminal, type:
   ```bash
   npm i
2. **Start Hardhat Node**: Open two additional terminals in your VS code. In the second terminal, start the Hardhat node:
   ```bash
   npx hardhat node
3. **Deploy the Contract**: In the third terminal, deploy the contract to the local network:
   ```bash
   npx hardhat run --network localhost scripts/deploy.js
4. **Launch the Frontend**: Back in the first terminal, start the frontend development server:
   ```bash
   npm run dev

## Authors

Contributors names and contact info

- Clint Audrey Dela Cruz
- Github: SecreShall
