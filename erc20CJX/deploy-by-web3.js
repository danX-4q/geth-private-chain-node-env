'use strict';

const parseArgs = require("minimist")
const fs = require("fs")

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

async function main() {
  const argv = parseArgs(process.argv.slice(2))
  console.log("argv", argv)

  const deployer = '0x' + argv._[0] //!!!!# do not giv 0x at commandline args
  //const deployer = '0x51b2981d5c863d422cdde2fc6bd9633232754ce3'
  const cjsFileName = 'build/contracts/TutorialToken.json'

  var cjs = fs.readFileSync(cjsFileName)
  //console.log("after readFileSync: " + cjs.toString());
  cjs = JSON.parse(cjs)
  let abi = cjs.abi
  let bytecode = cjs.bytecode
  //console.log(abi)
  //console.log(bytecode)

  var myContract = new web3.eth.Contract(abi, null, {
    data: bytecode
  });

  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.deploy().estimateGas()

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
