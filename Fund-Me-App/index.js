import { ethers } from "./packages/ethers-5.6.esm.min.js";
import { contractAddress, abi } from "./constants.js";

// Connect

const connectBtn = document.getElementById("connect-btn");
const statusText = document.getElementById("status-text");

async function connect() {
  if (typeof window.ethereum != "undefined") {
    // Refer to metamask api
    await window.ethereum.request({ method: "eth_requestAccounts" });
    statusText.innerHTML = 'Connected!';
  } else {
    statusText.innerHTML = 'Please add metamask!';
  }
}
connectBtn.addEventListener('click', connect);

// Balance

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    return ethers.utils.formatEther(balance);
  }
}

// Fund

const fundBtn = document.getElementById("fund-btn");
const fundAmount = document.getElementById("fund-amount");

async function fund() {
  const ethAmount = fundAmount.value;
  console.log(`Funding with ${ethAmount} ETH...`);
  if (typeof window.ethereum != "undefined") {
    // provider / connection to blockchain
    // signer/ wallet/ someone with gas
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // contract that we are interacting with
    // ABI & Address
    // Contract connected to signer
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // Listen for transaction to be mined
      await listenForTransactionMine(transactionResponse, provider);
      console.log(`Funded ${ethAmount} ETH.`)
      addToLog(transactionResponse.hash, `Funded ${ethAmount} ETH.`, await getBalance());
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    // Args- eventName,listener
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations.`)
      resolve();
    });
    // Or timeout for reject
  });
}

fundBtn.addEventListener('click', fund);

// Withdraw

const withdrawBtn = document.getElementById('withdraw-btn');

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const balance = await getBalance();
      const transactionResponse = await contract.withdraw();
      // Listen for transaction to be mined
      await listenForTransactionMine(transactionResponse, provider);
      console.log(`Withdrawed ${balance} ETH.`)
      addToLog(transactionResponse.hash, `Withdrawed ${balance} ETH.`, await getBalance());
    } catch (error) {
      console.log(error);
    }
  }
}

withdrawBtn.addEventListener('click', withdraw);

// Transaction List
const transactionList = document.getElementById("transaction-list");

function addToLog(hash, message, balance) {
  const log = document.createElement('li');
  log.innerHTML = `Transation Id: ${hash} </br> ${message} </br> Balance:${balance}`;
  transactionList.append(log);
}