const {ethers, network} = require("hardhat");
const fs = require('fs');

async function main() {

    const [deployer] = await ethers.getSigners();


    const feeData = await ethers.provider.getFeeData();

    const costLimit = {
        maxFeePerGas: feeData.maxFeePerGas,
      	maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        gasLimit: 800000
    };

        const oldaddress = "0xd40c14fD2530067050343BC76b286d886F3a4DD6"
        const newaddress = "0xd40c14fD2530067050343BC76b286d886F3a4DD6"
        const check = await ethers.getContractFactory("ParamCheck",deployer);
        const checkP = await check.deploy();
        console.log(checkP.address);
        const checkPs = await checkP.pawnFaucetClaim(oldaddress,newaddress);
        console.log(checkPs);



}



  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});