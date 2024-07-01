<h1 align="center">ETH + AVAX PROOF: Intermediate EVM Course</h1>
<h1 align="center">Project: Function Frontend</h1>

## Overview

Assessment is a Solidity smart contract designed to manage a simple account with deposit and withdrawal functionalities. This README focuses on error handling using `require()`, `revert()`, `assert()`, custom errors, and event emission.

## Features

- View the current balance.
- Deposit funds into the account (owner only).
- Withdraw funds from the account (owner only).

## Error Handling

### `require(condition, message)`

- **Usage**: Ensures that only the owner can perform certain actions (`deposit()` and `withdraw()`).
- **Effect**: If `msg.sender` is not equal to `owner`, the function execution will revert with the message "You are not the owner of this account".

### `revert()`

- **Usage**: Used in `withdraw(uint256 _withdrawAmount)` to handle insufficient balance.
- **Effect**: If the contract balance is less than `_withdrawAmount`, the function execution will revert with a custom error `InsufficientBalance`.

### `assert(condition)`

- **Usage**: Asserts the correctness of the balance after a deposit or withdrawal operation.
- **Effect**: Verifies that the balance was updated correctly, ensuring the integrity of the contract state.

### Custom Error

- **Usage**: Defined as `InsufficientBalance` to handle specific conditions in `withdraw()`.
- **Effect**: Custom errors provide clarity on specific failure conditions, improving contract robustness and debugging.

## Events

- **Usage**: Events `Deposit(uint256 amount)` and `Withdraw(uint256 amount)` are emitted after successful deposit and withdrawal operations, respectively.
- **Effect**: Events provide a transparent record of contract activities, aiding in external monitoring and integration with off-chain applications.

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
