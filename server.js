const Web3 = require("web3");
const abi = require("./abi.json"); //Your contract ABI
const dotenv = require("dotenv");
dotenv.config();

let CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; //Address of Contract : 0x6D7E467d56fb37D9c882f710486C3D49AC87E7ed or your contract address
let privateKeyOwner = process.env.privateKeyOwner; //Private key of User : Give your private key

let publicAddressOwner = process.env.publicAddressOwner; //Address of User : Give your Public address

let infura = "https://goerli.infura.io/v3/e8e3634a88d0418c9a54b3c03b345925";
let Contract_Argument = 2000;

const web3Obj = new Web3(infura);

const contractbj = new web3Obj.eth.Contract(abi, CONTRACT_ADDRESS);

const init = async () => {
  const encodeData = await contractbj.methods
    .setPassword(Contract_Argument)
    .encodeABI();

  const gas = await contractbj.methods
    .setPassword(Contract_Argument)
    .estimateGas({ from: publicAddressOwner, value: 0 });

  const gasPrice = await web3Obj.eth.getGasPrice();
  const nonceVal = await web3Obj.eth.getTransactionCount(publicAddressOwner);

  const tx = {
    to: CONTRACT_ADDRESS,
    data: encodeData,
    gasPrice: gasPrice,
    gas,
    value: 0,
    nonce: nonceVal,
  };

  const result = await web3Obj.eth.accounts.signTransaction(
    tx,
    privateKeyOwner
  );

  const transaction = await web3Obj.eth.sendSignedTransaction(
    result.rawTransaction
  );
  console.log("Transactionhash : ", transaction.transactionHash);

  const newvalue = await contractbj.methods.password().call();

  console.log(
    "New value In Contract After Transacttion: ",
    newvalue.toString()
  );
};
init();
