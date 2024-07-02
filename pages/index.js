import { useState, useEffect } from "react";
import { ethers } from "ethers";
import todoListAbi from "../artifacts/contracts/ToDoList.sol/ToDoList.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [todoList, setTodoList] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const todoListABI = todoListAbi.abi;

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    try {
      if (window.ethereum) {
        setEthWallet(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        handleAccount(accounts);
      } else {
        console.log("Please install MetaMask");
      }
    } catch (error) {
      console.error("Error getting wallet:", error);
    }
  };

  const handleAccount = (accounts) => {
    try {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        getTodoListContract();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error("Error handling account:", error);
    }
  };

  const connectAccount = async () => {
    try {
      if (!ethWallet) {
        alert("MetaMask wallet is required to connect");
        return;
      }

      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  const getTodoListContract = async () => {
    try {
      let provider;
      if (ethWallet) {
        provider = new ethers.providers.Web3Provider(ethWallet);
      } else {
        provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      }

      const signer = provider.getSigner();
      const todoListContract = new ethers.Contract(contractAddress, todoListABI, signer);
      setTodoList(todoListContract);
      loadTasks(todoListContract);
    } catch (error) {
      console.error("Error getting contract:", error);
    }
  };

  const loadTasks = async (todoListContract) => {
    try {
      const taskCount = await todoListContract.taskCount();
      const tasks = [];
      for (let i = 1; i <= taskCount; i++) {
        const task = await todoListContract.tasks(i);
        if (!task.deleted) { // Only add tasks that are not marked as deleted
          tasks.push(task);
        }
      }
      setTasks(tasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      if (newTask.trim() === "") return;

      if (todoList) {
        const tx = await todoList.createTask(newTask, { gasLimit: 3000000 });
        await tx.wait();
        loadTasks(todoList);
        setNewTask("");
      }
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  const toggleTaskCompleted = async (id) => {
    try {
      if (todoList) {
        const tx = await todoList.toggleTaskCompleted(id, { gasLimit: 3000000 });
        await tx.wait();
        loadTasks(todoList);
      }
    } catch (error) {
      console.error("Error toggling task completion:", error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      if (todoList) {
        const tx = await todoList.deleteTask(id, { gasLimit: 3000000 });
        await tx.wait();
        // After deletion, filter out the deleted task from state
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const taskList = tasks.map((task) => (
    <li key={task.id} className="task-item">
      <div className="task-details">
        <span className="task-content">{task.content}</span>
        &emsp;|&emsp;
        <span className={`task-status ${task.completed ? "completed" : "pending"}`}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="task-actions">
        <button onClick={() => toggleTaskCompleted(task.id)}>
          {task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </li>
  ));

  return (
    <main className="container">
      <header>
        <h1>Blockchain To-Do List</h1>
      </header>
      {ethWallet ? (
        account ? (
          <div>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task"
              className="input-task"
            />
            <button onClick={addTask} className="btn-add-task">
              Add Task
            </button>
            <ul className="task-list">
              {taskList.length > 0 ? taskList : <li>No tasks found</li>}
            </ul>
          </div>
        ) : (
          <button onClick={connectAccount} className="btn-connect">
            Connect MetaMask
          </button>
        )
      ) : (
        <p>Connecting to the local network...</p>
      )}
      <style jsx>{`
        .container {
          text-align: center;
          margin-top: 50px;
        }

        .input-task {
          margin-right: 10px;
          padding: 8px;
          width: 300px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        .btn-add-task {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-add-task:hover {
          background-color: #0056b3;
        }

        .btn-connect {
          padding: 12px 24px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
        }

        .btn-connect:hover {
          background-color: #218838;
        }

        .task-list {
          list-style: none;
          padding: 0;
          margin-top: 20px;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 10px;
          background-color: #f8f9fa;
        }

        .task-details {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .task-content {
          flex: 1;
        }

        .task-status {
          margin-left: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .completed {
          background-color: #28a745;
          color: white;
        }

        .pending {
          background-color: #ffc107;
          color: #212529;
        }

        .task-actions {
          display: flex;
          align-items: center;
        }

        .task-actions button {
          margin-left: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .task-actions button:hover {
          opacity: 0.8;
        }
      `}</style>
    </main>
  );
}
