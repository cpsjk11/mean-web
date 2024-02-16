import {
  getKlayToMeanEstimateSwap,
  getMeanToKlayEstimateSwap,
  swapExactTokensForETH,
  swapETHForExactTokens,
  fetchTotalDepositAmount,
  fetchEstimateInterest,
  fetchInterestRate,
  fetchWithdrawableAmount,
  deposit,
  allowance,
  approve,
  withdraw,
  claimInterest,
  eventApprove,
  eventAllowance,
  eventTokenExchange,
} from "../web3/index.js";

const zeroAddress = "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432";
const mean = "0x7Be624E054d5b232e02dCa0576aF8A089e12340B";

async function getMeanAmountOut(amount) {
  return await getKlayToMeanEstimateSwap(amount);
}

async function getKlayAmountOut(amount) {
  return await getMeanToKlayEstimateSwap(amount);
}

async function klayToMeanSwap(amountIn, amountOutMin) {
  return await swapETHForExactTokens(amountIn, amountOutMin, [
    zeroAddress,
    mean,
  ]);
}

async function meanToKlaySwap(amountIn, amountOutMin) {
  await swapExactTokensForETH(amountIn, amountOutMin);
}

async function getDepositAmount(n) {
  return await fetchTotalDepositAmount(n);
}

async function getInterest(n) {
  return await fetchEstimateInterest(n);
}

async function getInterestRate(n) {
  return await fetchInterestRate(n);
}

async function getWithdrawableAmount(n) {
  return await fetchWithdrawableAmount(n);
}

async function meanDeposit(n, amount) {
  return await deposit(n, amount);
}

async function meanWithdraw(n, amount) {
  return await withdraw(n, amount);
}

async function meanClaim(n) {
  return await claimInterest(n);
}

async function isAllowance(spender) {
  return await allowance(spender);
}

async function approveContract(spender) {
  return await approve(spender);
}

async function eventApproveContract(n) {
  return await eventApprove(n);
}

async function isEventAllowance(n) {
  return await eventAllowance(n);
}

async function eventTokenToKlay(amount) {
  return await eventTokenExchange(amount);
}

export {
  getMeanAmountOut,
  getKlayAmountOut,
  klayToMeanSwap,
  meanToKlaySwap,
  getDepositAmount,
  getInterest,
  getInterestRate,
  getWithdrawableAmount,
  meanDeposit,
  meanWithdraw,
  meanClaim,
  isAllowance,
  approveContract,
  eventApproveContract,
  isEventAllowance,
  eventTokenToKlay,
};
