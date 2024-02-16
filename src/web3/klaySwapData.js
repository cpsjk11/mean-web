const contractAddress = "0x7A74B3be679E194E1D6A0C29A343ef8D2a5AC876";
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint",
        name: "amountIn",
        type: "uint",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
    ],
    name: "estimateSwap",
    outputs: [
      {
        internalType: "uint",
        name: "amountOut",
        type: "uint",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export { contractAddress, abi };
