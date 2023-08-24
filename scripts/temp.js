const {ethers, network, artifacts} = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    const feeData = await ethers.provider.getFeeData();

    const costLimit = {
        maxFeePerGas: feeData.maxFeePerGas,
      	maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        gasLimit: 6000000
    };

    // const NftTransferManager = await artifacts.readArtifact("NftTransferManager");

    // // console.log(NftTransferManager.abi);
    // const iface = new ethers.utils.Interface(NftTransferManager.abi);
    // const data = iface.encodeFunctionData("initialize");
    // console.log(data);
    // console.log(feeData.maxFeePerGas.toString());

    const RewardDistributor = await ethers.getContractFactory("RewardDistributor");
    const distributor = await RewardDistributor.deploy(deployer.address, costLimit);
    console.log(distributor.address);
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});