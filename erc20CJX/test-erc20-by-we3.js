'use strict';

const parseArgs = require("minimist")
const fs = require("fs")

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const accountA = "0x69c26fce9391860febc5fcfef28ea8c0c14072e1"
const accountB = "0xb05deacc0a841d20f62af734e14d24d6b175b426"
const accountC = "0x5f52694474a45838c84824f11b27a15942ad34fd"
const contractAddr = '0x562659e2624C183ea02DA147Ffc0dd9fd466545f' //get it from deploy-by-web3.js

const deployer = accountA
const cjsFileName = 'build/contracts/TutorialToken.json'
var cjs = fs.readFileSync(cjsFileName)
//console.log("after readFileSync: " + cjs.toString());
cjs = JSON.parse(cjs)
let abi = cjs.abi
let bytecode = cjs.bytecode
//console.log(abi)
//console.log(bytecode)

var myContract = new web3.eth.Contract(abi, contractAddr, {
  data: bytecode
});

///////////////////////////////////////////////////////////

async function sleep(ms = 0) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve();
      }, ms);
  });
}

///////////////////////////////////////////////////////////

async function erc20_name() {
  myContract.methods.name()
  .call({from: accountA}, function(error, result){
    if(error) {
      console.log('ddd: ', error)
    }
    //console.log(result)
  })
  .then(function(result){
    console.log('name: ', result)
  })
}

async function erc20_symbol() {
  myContract.methods.symbol()
  .call({from: accountA}, function(error, result){
    if(error) {
      console.log('ddd: ', error)
    }
    //console.log(result)
  })
  .then(function(result){
    console.log('symbol: ', result)
  })
}

async function erc20_decimals() {
  myContract.methods.decimals()
  .call({from: accountA}, function(error, result){
    if(error) {
      console.log('ddd: ', error)
    }
    //console.log(result)
  })
  .then(function(result){
    console.log('decimals: ', result)
  })
}

async function erc20_totalSupply() {
  myContract.methods.totalSupply()
  .call({from: accountA}, function(error, result){
    if(error) {
      console.log('ddd: ', error)
    }
    //console.log(result)
  })
  .then(function(result){
    console.log('totalSupply: ', result)
  })
}

async function erc20_balanceOf(addr) {
  myContract.methods.balanceOf(addr)
  .call({from: addr}, function(error, result){
    if(error) {
      console.log('ddd: ', error)
    }
    //console.log(result)
  })
  .then(function(result){
    console.log('balanceOf: ', addr, result)
  })
}

/*
function transfer(address _to, uint256 _value) returns (bool success)
function approve(address _spender, uint256 _value) returns (bool success)
function allowance(address _owner, address _spender) constant returns (uint256 remaining)
function transferFrom(address _from, address _to, uint256 _value) returns (bool success)
function mint(address account, uint256 amount) public onlyMinter returns (bool)
function burn(uint256 amount)
function burnFrom(address account, uint256 amount)
*/

async function erc20_mint(account, amount) {
  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.methods.mint(account, amount).estimateGas({
    from: account
  })
  console.log("[guess] gasPrice:", gasPrice)
  console.log("[guess] gas:", gas)

  await myContract.methods.mint(account, amount)
  .send({
    from: account,
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
    console.log("on receipt: ")//, receipt)
  })
  //#### if .on('confirmation'), then wait 24 confirmation default!
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log("confirmationNumber: ", confirmationNumber)
  // })
  .then(function(result){
    console.log('mint: ', account, amount, result)
  })
}

async function erc20_transfer(from, to, value) {
  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.methods.transfer(to, value).estimateGas({
    from: from
  })
  console.log("[guess] gasPrice:", gasPrice)
  console.log("[guess] gas:", gas)

  await myContract.methods.transfer(to, value)
  .send({
    from: from,
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
    console.log("on receipt: ")//, receipt)
  })
  //#### if .on('confirmation'), then wait 24 confirmation default!
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log("confirmationNumber: ", confirmationNumber)
  // })
  .then(function(result){
    console.log('transfer: ', from, to, value, result)
  })
}

async function erc20_burn(account, amount) {
  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.methods.burn(amount).estimateGas({
    from: account
  })
  console.log("[guess] gasPrice:", gasPrice)
  console.log("[guess] gas:", gas)

  await myContract.methods.burn(amount)
  .send({
    from: account,
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
    console.log("on receipt: ")//, receipt)
  })
  //#### if .on('confirmation'), then wait 24 confirmation default!
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log("confirmationNumber: ", confirmationNumber)
  // })
  .then(function(result){
    console.log('burn: ', account, amount, result)
  })
}

async function erc20_approve(account, spender, value) {
  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.methods.approve(spender, value).estimateGas()
  console.log("[guess] gasPrice:", gasPrice)
  console.log("[guess] gas:", gas)

  await myContract.methods.approve(spender, value)
  .send({
    from: account,
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
    console.log("on receipt: ")//, receipt)
  })
  //#### if .on('confirmation'), then wait 24 confirmation default!
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log("confirmationNumber: ", confirmationNumber)
  // })
  .then(function(result){
    console.log('approve: ', account, spender, value, result)
  })
}

async function erc20_allowance(account, spender) {
  myContract.methods.allowance(account, spender)
  .call({from: account}, function(error, result){
    if(error) {
      console.log('ddd: ', error)
    }
    //console.log(result)
  })
  .then(function(result){
    console.log('allowance: ', account, spender, result)
  })
}

async function erc20_transferFrom(account, from, to, value) {
  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.methods.transferFrom(from, to, value).estimateGas({
    from: account
  })
  console.log("[guess] gasPrice:", gasPrice)
  console.log("[guess] gas:", gas)

  await myContract.methods.transferFrom(from, to, value)
  .send({
    from: account,
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
    console.log("on receipt: ")//, receipt)
  })
  //#### if .on('confirmation'), then wait 24 confirmation default!
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log("confirmationNumber: ", confirmationNumber)
  // })
  .then(function(result){
    console.log('transferFrom: ', account, from, to, value, result)
  })
}

async function erc20_burnFrom(account, from, amount) {
  let gasPrice = await web3.eth.getGasPrice()
  let gas = await myContract.methods.burnFrom(from, amount).estimateGas({
    from: account
  })
  console.log("[guess] gasPrice:", gasPrice)
  console.log("[guess] gas:", gas)

  await myContract.methods.burnFrom(from, amount)
  .send({
    from: account,
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
    console.log("on receipt: ")//, receipt)
  })
  //#### if .on('confirmation'), then wait 24 confirmation default!
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log("confirmationNumber: ", confirmationNumber)
  // })
  .then(function(result){
    console.log('burnFrom: ', account, from, amount, result)
  })
}

///////////////////////////////////////////////////////////

async function erc20Detail() {
    await erc20_name()
    await erc20_symbol()
    await erc20_decimals()
    await erc20_totalSupply()
    await erc20_balanceOf(deployer)
}

///////////////////////////////////////////////////////////

async function testcase_1() {
  await erc20Detail()
  await sleep(500)
  await erc20_transfer(accountA, accountB, 545300)
  await sleep(1.5 * 1000)
  await erc20_balanceOf(accountA)
  await erc20_balanceOf(accountB)
}

async function testcase_2() {
  await erc20_burn(accountA, 100)
  await sleep(1.5 * 1000)
  await erc20_burn(accountB, 100)
  await sleep(1.5 * 1000)
  await erc20_balanceOf(accountA)
  await erc20_balanceOf(accountB)
  await erc20Detail()
}

async function testcase_3() {
  await erc20_approve(accountA, accountB, 50)
  await sleep(1.5 * 1000)
  await erc20_allowance(accountA, accountB)
  await erc20_balanceOf(accountA)
}

async function testcase_4() {
  //https://www.jianshu.com/p/496f8ba43036
  /*
approve、transferFrom及allowance解释：
账户A有1000个ETH，想允许B账户随意调用100个ETH。
A账户按照以下形式调用approve函数approve(B,100)。
当B账户想用这100个ETH中的10个ETH给C账户时，则调用transferFrom(A, C, 10)。
这时调用allowance(A, B)可以查看B账户还能够调用A账户多少个token。
   */
  await erc20_transferFrom(accountB, accountA, accountC, 30)
  await sleep(1.5 * 1000)
  await erc20_allowance(accountA, accountB)
  await sleep(500)
  await erc20_balanceOf(accountA)
  await erc20_balanceOf(accountB)
  await erc20_balanceOf(accountC)
}

async function testcase_5() {
  await erc20Detail()
  await sleep(500)
  await erc20_burnFrom(accountB, accountA, 10)
  await sleep(1.5 * 1000)
  await erc20_allowance(accountA, accountB)
  await erc20_balanceOf(accountA)
  await erc20_balanceOf(accountB)
  await erc20_balanceOf(accountC)
}

async function testcase_6() {
  await erc20_mint(accountA, 210)
  await sleep(1.5 * 1000)
  await erc20Detail()

  await sleep(500)
  //await erc20_mint(accountC, 100) //accountB mint denied!
}

async function testcase_final() {

}

async function main() {
  //await erc20Detail()
  //await testcase_1()
  //await testcase_2()
  //await testcase_3()
  //await testcase_4()
  //await testcase_5()
  //await testcase_6()
  await testcase_final()
}

main().catch(err => {
  console.log("error", err)
})
