'use strict';

const parseArgs = require("minimist")
const fs = require("fs")

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const deployer = '0x69c26fce9391860febc5fcfef28ea8c0c14072e1'
const cjsFileName = 'build/contracts/TutorialToken.json'

var cjs = fs.readFileSync(cjsFileName)
//console.log("after readFileSync: " + cjs.toString());
cjs = JSON.parse(cjs)
let abi = cjs.abi
let bytecode = cjs.bytecode
//console.log(abi)
//console.log(bytecode)

async function main() {

  var myContract = new web3.eth.Contract(abi, null, {
    data: bytecode
  });

  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.deploy().estimateGas({
    from: deployer
  })

  console.log("[guess] gasPrice:", gasPrice)
  console.log("[guess] gas:", gas)

  myContract.deploy()
  .send({
      from: deployer,
      gas: gas,             //1500000,
      gasPrice: gasPrice    //'30000000000000'
  }, function(error, transactionHash){
    if(error) {
      console.log('ddd: ', error)
    }
  })
  .on('error', function(error){
    console.log("on 'error': ", error)
  })
  .on('transactionHash', function(transactionHash){
    console.log('transactionHash: ', transactionHash)
  })
  .on('receipt', function(receipt){
    // contains the new contract address
    console.log("contractAddress: ", receipt.contractAddress)
  })
  //#### if .on('confirmation'), then wait 24 confirmation default!
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log("confirmationNumber: ", confirmationNumber)
  // })
  .then(function(newContractInstance){
    // instance with the new contract address
    console.log("newContractInstance.options.address: ", newContractInstance.options.address) 
  });

}

main().catch(err => {
  console.log("error", err)
})
