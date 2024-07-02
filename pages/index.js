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
        provider = new ethers.providers.JsonRpcProvider("https://8545-metacrafterc-scmstarter-ye7rcaudfz6.ws-us114.gitpod.io");
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
        tasks.push(task);
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
        loadTasks(todoList);
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const taskList = tasks.map((task) => (
    <li key={task.id}>
      {task.content}{" "}
      <button onClick={() => toggleTaskCompleted(task.id)}>
        {task.completed ? "Mark Incomplete" : "Mark Complete"}
      </button>{" "}
      <button onClick={() => deleteTask(task.id)}>Delete</button>
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
            />
            <button onClick={addTask}>Add Task</button>
            <ul>{taskList}</ul>
          </div>
        ) : (
          <button onClick={connectAccount}>Connect MetaMask</button>
        )
      ) : (
        <p>Connecting to the local network...</p>
      )}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
