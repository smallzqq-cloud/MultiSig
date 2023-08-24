const {ethers, network} = require("hardhat");
const fs = require('fs');

async function main() {

    const [deployer] = await ethers.getSigners();

    const balance = await ethers.provider.getBalance(deployer.address);
	console.log("------------------------------------------------------------------------------ power transfer before", balance.toString());

    const env = "pre";

    const helper = getJson("../config/" + getPrefixes(env) + "helper_"+ network.name +".json");
    const v2 = getJson("../config/" + getPrefixes(env) + "v2_"+ network.name +".json");
    const sale = getJson("../config/" + getPrefixes(env) + "sale_"+ network.name +".json");
    const ilo = getJson("../config/" + getPrefixes(env) + "ilo_"+ network.name +".json");
    const dao = getJson("../config/" + getPrefixes(env) + "dao_"+ network.name +".json");
    const compound = getJson("../config/" + getPrefixes(env) + "compound_"+ network.name +".json");

    const feeData = await ethers.provider.getFeeData();

    const costLimit = {
        maxFeePerGas: feeData.maxFeePerGas,
      	maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        gasLimit: 800000
    };

    const ownerList = [
        helper.nftTransferManager.address,
        v2.randomTool.address,
        v2.upgradeableBeacon.address,
        v2.factory.address,
        sale.royaltyFeeManager.address,
        sale.pawnfiApproveTrade.address,
        dao.incentiveVoting.address,
        dao.iTokenStaking.address,
        dao.feeManager.address,
        ilo.ilo.address,
        ilo.fundingStrategy.address,
        compound.nftGateway.address,
        compound.multipleSourceOracle.address,
        compound.liquidator.address
    ];

    for(let i = 0; i < ownerList.length; i++) {
        // console.log(i);
        const ownable = await ethers.getContractAt("Ownable", ownerList[i], deployer);
        const owner = await ownable.owner();
        if(owner == deployer.address) {
            await ownable.transferOwnership(helper.multiSig.address, costLimit);
        }
    }

    const adminList = [
        v2.controller.address,
        v2.sale.address,
        compound.fallbackOracle.address
    ];

    for(let i = 0; i < adminList.length; i++) {
        const accessControl = await ethers.getContractAt("AccessControlUpgradeable", adminList[i], deployer);
        const adminRole = await accessControl.DEFAULT_ADMIN_ROLE();
        const checkResult = await accessControl.hasRole(adminRole, deployer.address);
        if(checkResult) {
            await accessControl.grantRole(adminRole, helper.multiSig.address, costLimit);
            // await accessControl.renounceRole(adminRole, deployer.address);
        }
    }

    const pendingAdminList = [
        compound.comptroller.address
    ];

    for(let i = 0; i < pendingAdminList.length; i++) {
        const adminControl = await ethers.getContractAt("TransferAdmin", pendingAdminList[i], deployer);
        const admin = await adminControl.admin();
        if(admin == deployer.address) {
            await adminControl._setPendingAdmin(helper.multiSig.address, costLimit);
        }
    }

    const balanceAfter = await ethers.provider.getBalance(deployer.address);
	console.log("------------------------------------------------------------------------------ power transfer after", balanceAfter.toString());
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