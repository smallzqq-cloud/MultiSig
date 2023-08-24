const { ethers, artifacts } = require("hardhat");
const config = require("../config/config");
const utils = require("./utils");

async function main() {

    const [deployer] = await ethers.getSigners();

    let rawdata = utils.readFileSync(config.helperFile);
    let json = JSON.parse(rawdata);

    const feeData = await ethers.provider.getFeeData();

    const costLimit = {
        maxFeePerGas: feeData.maxFeePerGas,
      	maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        gasLimit: 8000000
    };

    const proxyAdmin = json.proxyAdmin.address;

    const createProxyFactory = await ethers.getContractAt("CreateProxyFactory", json.createProxyFactory.address, deployer);

    const NftTransferManager = await artifacts.readArtifact("NftTransferManager");
	const iface = new ethers.utils.Interface(NftTransferManager.abi);

    const args = {
        owner: deployer.address
    };
	const data = iface.encodeFunctionData("initialize", [ args.owner ]);
    const transferManagerImpl = json.nftTransferManagerImpl.address;
    await createProxyFactory.deploy(transferManagerImpl, proxyAdmin, data, config.constant.NftTransferManager, costLimit);

    const transferManager = await createProxyFactory.computeAddress(config.constant.NftTransferManager);

    Object.assign(json, {
		"nftTransferManager": {
			args: args,
			address: transferManager
		}
	})

    let deployContent = JSON.stringify(json, null, "\t");
    utils.writeFileSync(config.helperFile, deployContent);

    const balance = await ethers.provider.getBalance(deployer.address);
	console.log("------------------------------------------------------------------------------ contract-helper after", balance.toString());

    console.log("finished");
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});