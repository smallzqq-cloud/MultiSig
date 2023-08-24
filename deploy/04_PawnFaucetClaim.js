const config = require("../config/config");

const func = async ({ getNamedAccounts, deployments, network }) => {
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();

	await deploy('PawnFaucetClaim', {
		from: deployer,
		args: [config.signer],
		maxFeePerGas: config.maxFeePerGas,
		maxPriorityFeePerGas: config.maxPriorityFeePerGas,
		log: true,
	});

};
func.id = '04_PawnFaucetClaim';
module.exports = func;