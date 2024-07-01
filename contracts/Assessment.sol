// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDoList {
    // Structure to represent a to-do item
    struct Item {
        uint id;            // Unique identifier for the item
        string text;        // Text content of the to-do item
        bool completed;     // Flag indicating if the item is completed
    }

    // Mapping to store to-do items by their ID
    mapping(uint => Item) private items;

    // Counter to keep track of the next available item ID
    uint public nextItemId = 1;

    // Event emitted when a new item is added
    event ItemAdded(uint indexed itemId, string text);

    // Event emitted when an item is marked as completed
    event ItemCompleted(uint indexed itemId);

    // Function to add a new to-do item
    function addItem(string memory text) public {
        items[nextItemId] = Item(nextItemId, text, false);
        emit ItemAdded(nextItemId, text);
        nextItemId++;
    }

    // Function to mark a to-do item as completed
    function completeItem(uint itemId) public {
        // Check if item ID is valid
        require(items[itemId].id > 0, "Invalid item ID");

        // Mark item as completed
        items[itemId].completed = true;
        emit ItemCompleted(itemId);
    }

    // Function to retrieve details of a specific to-do item (view function)
    function getItem(uint itemId) public view returns (uint id, string memory text, bool completed) {
        // Check if item exists
        require(items[itemId].id > 0, "Item does not exist");

        // Retrieve and return item details
        Item memory item = items[itemId];
        return (item.id, item.text, item.completed);
    }
}
