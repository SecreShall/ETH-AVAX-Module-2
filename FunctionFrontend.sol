// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleWallet {
    uint256 private balance;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _; 
    }

    // Function to deposit ether into the contract
    function deposit(uint256 amount) public payable {
        require(amount > 0, "Deposit amount must be greater than zero");
        balance += amount;
    }

    // Function to withdraw ether from the contract
    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= balance, "Insufficient balance");
        balance -= amount;
    }

    // Function to get the current balance of the contract
    function getBalance() public view returns (uint256) {
        return balance;
    }
}
