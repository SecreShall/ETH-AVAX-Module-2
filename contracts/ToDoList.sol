// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ToDoList {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    uint public taskCount = 0;
    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string content, bool completed);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleTaskCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

    function deleteTask(uint _id) public {
        delete tasks[_id];
        emit TaskDeleted(_id);
    }

    function getTask(uint _id) public view returns (uint, string memory, bool) {
        Task memory _task = tasks[_id];
        return (_task.id, _task.content, _task.completed);
    }

    function getTaskCount() public view returns (uint) {
        return taskCount;
    }
}
