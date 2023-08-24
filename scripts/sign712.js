// const {ethers} = require("ethers");
// // 将合约部署在 hardhat node 本地链上
// const provider = new ethers.providers.JsonRpcProvider();

// // 这里我们使用 hardhat node 自带的地址进行签名
// const privateKey = ``
// const wallet = new ethers.Wallet(privateKey, provider);
// console.log(wallet);

// async function sign() {
//     // 获取 chainId
//     const { chainId } = await provider.getNetwork();

//     // 构造 domain 结构体
//     // 最后一个地址字段，由于我们在合约中使用了 address(this)
//     // 因此需要在部署合约之后，将合约地址粘贴到这里
//     const domain = {
//         name: 'multisig',
//         version: '1',
//         chainId: 201,
//         verifyingContract: '0x6b670DfaA796493f0033dD20bBc981e91bfc0AbC',
//     };
//     // The named list of all type definitions
//     // 构造签名结构体类型对象
//     const types = {
//         GrantTokenBySig: [
//             {name: '_to', type: 'address'},
//             {name: '_data', type: 'bytes'},
//         ]
//     };
//     // The data to sign
//     // 自行构造一个结构体的值
//     const value = {
//         _to: '0xe42241114e2B344074e6aa7CF8D9684C9C6e41dE',
//         _data: '0x3fd4b76241123651c7ee183a68f79fa0bc3e07ebe900582d171bd921a2d61ef8'
 
//     };
//     const signature = await wallet._signTypedData(
//         domain,
//         types,
//         value
//     );

//     // 将签名分割成 v r s 的格式
//     let signParts = ethers.utils.splitSignature(signature);
//     console.log(">>> Signature:", signParts);
//     // 打印签名本身
//     console.log(signature);
// }

// sign()
//创建web3对象
var Web3 = require('web3');
var sigUtil = require("eth-sig-util")
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var web3 = new Web3(provider);
 
// // var json = require("../build/contracts/Demo.json");
// var contractAddr = '';
 
var account = "0xe42241114e2B344074e6aa7CF8D9684C9C6e41dE";
var account_to = "0xe42241114e2B344074e6aa7CF8D9684C9C6e41dE";
//签名人的私钥
var privateKey = "";
var privateKeyHex = Buffer.from(privateKey, 'hex')
 
// var demoContract = new web3.eth.Contract(json['abi'], contractAddr);
 
// //获取链ID
// demoContract.methods.getChainId().call({from: account}, function(error, result){
//   if (error) {
//     console.log(error);
//   }
//   console.log("getChainId:", result);
// });
 
//V4签名
const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'address[]' },
        { name: 'to', type: 'address' },
     //   { name: 'value', type: 'bytes' },
      ],
    },
    domain: {
      name: 'Demo',
      version: '123',
      chainId: 201,
      verifyingContract: "0xA8Eed5696123a8227bcF14E45B1dd387BF23ec48",
    },
    primaryType: 'Mail',
    message: {
      from: ["0xe42241114e2B344074e6aa7CF8D9684C9C6e41dE"],
      to: account_to,
      //value: "0x3fd4b76241123651c7ee183a68f79fa0bc3e07ebe900582d171bd921a2d61ef8",
    },
  }
  
 
//V4签名
var signature = sigUtil.signTypedData_v4(privateKeyHex, { data: typedData })
console.log("signature:", signature)
 
//V4验签
// const recovered = sigUtil.recoverTypedSignature_v4({
//   data: typedData,
//   sig: signature,
// });
// console.log("recovered：", recovered)
 
// //合约V4验签
// demoContract.methods.verify(typedData.message.from, typedData.message.to, typedData.message.value, signature).call({from: account}, function(error, result){
//   if (error) {
//     console.log(error);
//   }
//   console.log("verify：", result);
// });