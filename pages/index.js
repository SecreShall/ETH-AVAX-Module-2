import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const AccountInfo = ({ account, balance, deposit, withdraw }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    setMessage('Processing deposit...');
    try {
      await deposit(depositAmount);
      setMessage('Deposit successful!');
      setDepositAmount(""); // Clear input after successful deposit
    } catch (error) {
      console.error('Deposit error:', error);
      setMessage('Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setMessage('Processing withdrawal...');
    try {
      await withdraw(withdrawAmount);
      setMessage('Withdrawal successful!');
      setWithdrawAmount(""); // Clear input after successful withdrawal
    } catch (error) {
      console.error('Withdrawal error:', error);
      setMessage('Withdrawal failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Account Information</h2>
      <p><strong>Your Account:</strong> {account}</p>
      <p><strong>Your Balance:</strong> {balance !== undefined ? balance : 'Loading...'}</p>

      <div style={styles.inputContainer}>
        <input
          type="number"
          placeholder="Deposit Amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={handleDeposit} disabled={loading}>
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </div>

      <div style={styles.inputContainer}>
        <input
          type="number"
          placeholder="Withdraw Amount"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={handleWithdraw} disabled={loading}>
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
  },
  inputContainer: {
    margin: '10px 0',
  },
  input: {
    padding: '8px',
    marginRight: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: '150px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    transition: 'background-color 0.3s',
  },
  message: {
    marginTop: '20px',
    color: 'green',
  },
};

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    } else {
      console.log("MetaMask is not installed!");
    }
  };

  const handleAccount = async () => {
    const accounts = await ethWallet.listAccounts();
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await handleAccount();
      getATMContract();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const getATMContract = () => {
    const signer = ethWallet.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const deposit = async (amount) => {
    if (atm && amount) {
      const tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async (amount) => {
    if (atm && amount) {
      const tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <AccountInfo 
        account={account} 
        balance={balance} 
        deposit={deposit} 
        withdraw={withdraw} 
      />
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
