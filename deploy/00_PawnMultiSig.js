const config = require("../config/config");
const { ethers } = require('hardhat');


const func = async ({ getNamedAccounts, deployments, network }) => {
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();
	const feeData = await ethers.provider.getFeeData();
	Object.assign(config, feeData);
    // console.log(feeData);

	const balance = await ethers.provider.getBalance(deployer);
	console.log("------------------------------------------------------------------------------ contract-helper beofre", balance.toString());

	await deploy('PawnMultiSig', {
		from: deployer,
        args: [config.signers],
		maxFeePerGas: config.maxFeePerGas,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas,
		log: true,
	});
};
func.id = '00_PawnMultiSig';
module.exports = func;