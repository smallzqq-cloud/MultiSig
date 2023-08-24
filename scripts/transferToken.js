const {ethers, network} = require("hardhat");
const fs = require('fs');

async function main() {

    const [deployer] = await ethers.getSigners();

    const env = "pre";

    const tokens = getJson("../config/" + getPrefixes(env) + "tokens_"+ network.name +".json");
    const dao = getJson("../config/" + getPrefixes(env) + "dao_"+ network.name +".json");
    const compound = getJson("../config/" + getPrefixes(env) + "compound_"+ network.name +".json");

    const feeData = await ethers.provider.getFeeData();

    const costLimit = {
        maxFeePerGas: feeData.maxFeePerGas,
      	maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        gasLimit: 800000
    };

    const pawnTokenAddr = tokens.pawnToken;
    const pawnToken = await ethers.getContractAt("PawnToken", pawnTokenAddr, deployer);
    await pawnToken.transfer(dao.iTokenStaking.address, ethers.utils.parseUnits(dao.params.maxMintable, 0), costLimit);

    await pawnToken.transfer(compound.comptroller.address, ethers.utils.parseUnits("1000000", 18), costLimit);

    const usdtInfo = tokens.erc20.filter(e => e.name == "Tether USD")[0];
    const usdt = await ethers.getContractAt("PawnToken", usdtInfo.address, deployer);
    const usdtAmount = ethers.utils.parseUnits("100000", usdtInfo.decimals);
    await usdt.transfer(compound.liquidator.address, usdtAmount, costLimit);

    console.log("finished");
}

function getPrefixes(env) {
    if(env == "dev") {
        return "dev_";
    }
    return "";
}

function readFileSync(filename) {
    let rawdata = fs.readFileSync(filename, "utf-8");
    return rawdata;
}

function getJson(filename) {
    let rawdata = readFileSync(filename);
    let json = JSON.parse(rawdata);
    return json;
}
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});