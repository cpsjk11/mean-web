import Web3 from "web3";
// import { abi, contractAddress } from "./klaySwapData";
import { klaySwapRouterAddr, klaySwapRouterABI } from "./klaySwap";
import { depositAddr, depositABI } from "./deposit";
import { meanAddress, meanABI } from "./mean";
import { eventDepositAddr, eventDepositAbi } from "./eventDeposit";
import { eventFactoryAddr, eventFactoryABI } from "./eventFactory";
import { eventTokenAddr, eventTokenAbi } from "./eventToken";

const Caver = require("caver-js");
const caver = new Caver("https://public-en-cypress.klaytn.net");

let web3 = new Web3("https://public-en-cypress.klaytn.net");
let address;

const zeroAddress = "0x0000000000000000000000000000000000000000";
const wKlay = "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432";

/** 메타마스크 로그인 함수  */
export const metaMaskLogin = async (account) => {
  const web3js = window.ethereum;

  if (web3js) web3 = new Web3(window.ethereum);
  else if (window.confirm("Please install MetaMask to use this service."))
    return window.open("https://metamask.io/download.html", "_blank");

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.error("User denied account access");
  }

  const userAddr = await web3.eth.getAccounts().then((userAddr) => {
    return userAddr;
  });

  address = userAddr[0];
  return address;
};

/** 메타마스크 지갑에 연결 되 있는 상태이면 현재 주소를 가져오는 함수 */
export async function getAccount() {
  return await web3.eth.getAccounts().then((accounts) => {
    return accounts[0];
  });
}

/** 현재 메타마스크 지갑이랑 연동되 있는 계정 주소랑 현재 파라미터로 받은 주소와 일치하는 지 확인하는 함수 */
// async function checkAccount() {
//   const Account = await getAccount();

//   if (Account.toLowerCase() !== account.toLowerCase) return false;

//   return true;
// }

/** 카이카스 지갑 연동 */
export const klaytnLogin = async (account) => {
  console.log("klaytnLogin");
  if (window.klaytn && window.klaytn.isKaikas) {
    const accounts = await window.klaytn.enable();
    console.log(accounts[0]);
    address = accounts[0];
    return address;
  } else if (window.confirm("Please install Kaikas wallet!"))
    return window.open("https://metamask.io/download.html", "_blank");
};

/** 클레이튼 실시간 가스 가격 도출 함수 */
export const getKlayGasPrice = async () => {
  return new Promise((resolve, reject) => {
    caver.rpc.klay.getGasPrice((err, gasPrice) => {
      if (err) reject(err);
      resolve(gasPrice);
    });
  });
};

/** 카이카스 지갑에 연결 되 있는 상태이면 현재 주소를 가져오는 함수 */
async function getKlayAccount() {
  console.log("getKlayAccount");
  return new Promise((resolve, reject) => {
    caver.klay.getAccounts
      .then((accounts) => {
        console.log(accounts[0]);
        resolve(accounts[0]);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

/** 현재 카이카스 지갑이랑 연동돼 있는 계정 주소랑 현재 파라미터로 받은 주소와 일치하는 지 확인하는 함수 */
export async function checkKlayAccount(account) {
  const Account = await getKlayAccount();

  if (Account.toLowerCase() !== account.toLowerCase) return false;

  return true;
}

// async function getEstimatedSwapAmount(tokenIn, tokenOut, amountIn, path) {
//   const contract = new web3.eth.Contract(abi, contractAddress);
//   const data = contract.methods
//     .estimateSwap(tokenIn, tokenOut, amountIn, path)
//     .encodeABI();

//   const result = await web3.eth.call({
//     to: contractAddress,
//     data: data.replace("0x526cdbe1", "0x692ca7a0"),
//   });
//   return web3.eth.abi.decodeParameter("uint256", result);
// }

async function getAmountsOut(amountIn, path) {
  const contract = new web3.eth.Contract(klaySwapRouterABI, klaySwapRouterAddr);
  const data = contract.methods
    .getAmountsOut(amountIn, path, [zeroAddress])
    .encodeABI();

  const result = await web3.eth.call({
    to: klaySwapRouterAddr,
    data: data,
  });
  const amountOut = web3.eth.abi.decodeParameter("uint256[]", result);
  return amountOut[amountOut.length - 1];
}

async function getAmountsIn(amountOut, path) {
  const contract = new web3.eth.Contract(klaySwapRouterABI, klaySwapRouterAddr);
  const data = contract.methods
    .getAmountsIn(amountOut, path, [zeroAddress])
    .encodeABI();

  const result = await web3.eth.call({
    to: klaySwapRouterAddr,
    data: data,
  });
  const amountIn = web3.eth.abi.decodeParameter("uint256[]", result);
  return amountIn[0];
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getKlayToMeanEstimateSwap(amount) {
  await delay(500);
  if (amount <= 0) return 0;
  const amountIn = web3.utils.toWei(amount, "ether");
  const result2 = await getAmountsIn(amountIn, [wKlay, meanAddress]);
  return web3.utils.fromWei(result2, "ether");
}

export async function getMeanToKlayEstimateSwap(amount) {
  await delay(500);
  if (amount <= 0) return 0;
  const amountIn = web3.utils.toWei(amount, "ether");
  const result2 = await getAmountsOut(amountIn, [wKlay, meanAddress]);
  return web3.utils.fromWei(result2, "ether");
}

export async function swapExactTokensForETH(amount, amountMin, path) {
  try {
    const amountIn = web3.utils.toWei(amount, "ether");
    const amountOutMin = web3.utils.toWei(amountMin, "ether");
    const contract = new web3.eth.Contract(
      klaySwapRouterABI,
      klaySwapRouterAddr
    );

    const params = {
      to: address,
      path: path,
      pool: zeroAddress,
      deadline: Math.floor(Date.now() / 1000) + 60,
    };
    console.log(params);
    // 트랜잭션 생성
    const tx = contract.methods.swapExactTokensForETH(
      amountIn,
      amountOutMin,
      params
    );
    console.log(tx);
    const estimateGas = await tx
      .estimateGas({
        from: address,
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(estimateGas);
    const gasPrice = await getKlayGasPrice();
    console.log(gasPrice);
    // 서명된 트랜잭션 전송
    const receipt = await contract.methods.swapExactTokensForETH.send({
      from: address,
      gas: estimateGas,
      gasPrice: gasPrice,
    });

    console.log("Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error calling swapExactTokensForETH:", error);
  }
}

export async function swapETHForExactTokens(amountIn, out, path) {
  try {
    const amountOut = web3.utils.toWei(out, "ether");

    const contract = new web3.eth.Contract(
      klaySwapRouterABI,
      klaySwapRouterAddr
    );

    const params = {
      to: address,
      path: path,
      pool: [zeroAddress],
      deadline: Math.floor(Date.now() / 1000) + 60,
    };

    const estimateGas = await contract.methods
      .swapETHForExactTokens(amountOut, params)
      .estimateGas({
        from: address,
        value: web3.utils.toWei(amountIn, "ether"),
      });

    const gasPrice = await getKlayGasPrice();

    // 서명된 트랜잭션 전송
    const receipt = await contract.methods
      .swapETHForExactTokens(amountOut, params)
      .send({
        from: address,
        gas: estimateGas,
        gasPrice: gasPrice,
        value: web3.utils.toWei(amountIn, "ether"),
      });

    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling swapETHForExactTokens:", error);
  }
}

/* Mean Token */
function checkContract(value) {
  let approveContract;
  if (value.toLowerCase().includes("klayswap")) {
    approveContract = klaySwapRouterAddr;
  } else if (value.toLowerCase().includes("deposit")) {
    approveContract = depositAddr;
  } else {
    approveContract = eventDepositAddr;
  }
  return approveContract;
}

function checkDepositContract(value) {
  let contract;
  let abi;
  if (value.toLowerCase().includes("klay")) {
    contract = "";
    abi = [];
  } else if (value.toLowerCase().includes("event")) {
    contract = eventDepositAddr;
    abi = eventDepositAbi;
  } else {
    contract = depositAddr;
    abi = depositABI;
  }
  return { contract: contract, abi: abi };
}

export async function approve(spender) {
  try {
    const to = checkContract(spender);
    const contract = new web3.eth.Contract(meanABI, meanAddress);
    const amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const estimateGas = await contract.methods
      .approve(to, amount)
      .estimateGas({ from: address });

    const gasPrice = await getKlayGasPrice();

    const receipt = await contract.methods.approve(to, amount).send({
      from: address,
      gas: estimateGas,
      gasPrice: gasPrice,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling approve:", error);
  }
}

export async function allowance(spender) {
  const to = checkContract(spender);
  const contract = new web3.eth.Contract(meanABI, meanAddress);
  const result = await contract.methods.allowance(address, to).call();
  const allowance = web3.utils.fromWei(result, "ether");
  return allowance > 10000 ? true : false;
}

/* Event Mean */
function eventCheckContract(value) {
  let approveContract;
  if (value.toLowerCase().includes("eventfactory")) {
    approveContract = eventFactoryAddr;
  } else if (value.toLowerCase().includes("eventdeposit")) {
    approveContract = eventDepositAddr;
  }
  return approveContract;
}

export async function eventApprove(spender) {
  try {
    const to = eventCheckContract(spender);
    const contract = new web3.eth.Contract(eventTokenAbi, eventTokenAddr);
    const amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const estimateGas = await contract.methods
      .approve(to, amount)
      .estimateGas({ from: address });

    const gasPrice = await getKlayGasPrice();

    const receipt = await contract.methods.approve(to, amount).send({
      from: address,
      gas: estimateGas,
      gasPrice: gasPrice,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling approve:", error);
  }
}

export async function eventAllowance(spender) {
  const to = eventCheckContract(spender);
  const contract = new web3.eth.Contract(eventTokenAbi, eventTokenAddr);
  const result = await contract.methods.allowance(address, to).call();
  const allowance = web3.utils.fromWei(result, "ether");
  return allowance > 10000 ? true : false;
}

/* Mean Deposit */
export async function fetchTotalDepositAmount(n) {
  const data = checkDepositContract(n);
  const contract = new web3.eth.Contract(data.abi, data.contract);
  const result = await contract.methods.getTotalDepositAmount().call();
  return web3.utils.fromWei(result, "ether");
}

export async function fetchInterestRate(n) {
  const data = checkDepositContract(n);
  const contract = new web3.eth.Contract(data.abi, data.contract);
  const result = await contract.methods.getInterestRate().call();
  return Number(result) / 10;
}

export async function fetchEstimateInterest(n) {
  const data = checkDepositContract(n);
  const contract = new web3.eth.Contract(data.abi, data.contract);
  const result = await contract.methods.estimateInterest(address).call();
  return web3.utils.fromWei(result, "ether");
}

export async function fetchWithdrawableAmount(n) {
  const data = checkDepositContract(n);
  const contract = new web3.eth.Contract(data.abi, data.contract);
  const result = await contract.methods.getWithdrawableAmount(address).call();
  return web3.utils.fromWei(result, "ether");
}

export async function deposit(n, amount) {
  try {
    const data = checkDepositContract(n);
    const contract = new web3.eth.Contract(data.abi, data.contract);
    const amountIn = web3.utils.toWei(amount, "ether");
    const estimateGas = await contract.methods
      .deposit(amountIn)
      .estimateGas({ from: address });

    const gasPrice = await getKlayGasPrice();

    const receipt = await contract.methods.deposit(amountIn).send({
      from: address,
      gas: estimateGas,
      gasPrice: gasPrice,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling deposit:", error);
  }
}

export async function withdraw(n, amount) {
  try {
    const data = checkDepositContract(n);
    const contract = new web3.eth.Contract(data.abi, data.contract);
    const amountIn = web3.utils.toWei(amount, "ether");
    const estimateGas = await contract.methods
      .withdraw(amountIn)
      .estimateGas({ from: address });

    const gasPrice = await getKlayGasPrice();

    const receipt = await contract.methods.withdraw(amountIn).send({
      from: address,
      gas: estimateGas,
      gasPrice: gasPrice,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling withdraw:", error);
  }
}

export async function claimInterest(n) {
  try {
    const data = checkDepositContract(n);
    const contract = new web3.eth.Contract(data.abi, data.contract);
    const estimateGas = await contract.methods
      .claimInterest()
      .estimateGas({ from: address });

    const gasPrice = await getKlayGasPrice();

    const receipt = await contract.methods.claimInterest().send({
      from: address,
      gas: estimateGas,
      gasPrice: gasPrice,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling claimInterest:", error);
  }
}

export async function eventTokenExchange(amount) {
  try {
    const contract = new web3.eth.Contract(eventFactoryABI, eventFactoryAddr);
    const amountIn = web3.utils.toWei(amount, "ether");
    const estimateGas = await contract.methods
      .exchange(amountIn)
      .estimateGas({ from: address });

    const gasPrice = await getKlayGasPrice();

    const receipt = await contract.methods.exchange(amountIn).send({
      from: address,
      gas: estimateGas,
      gasPrice: gasPrice,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling exchange:", error);
  }
}

export default web3;
