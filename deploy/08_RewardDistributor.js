const config = require("../config/config");

const func = async ({ getNamedAccounts, deployments, network }) => {
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();

	await deploy('RewardDistributor', {
		from: deployer,
        args: [config.signer],
		maxFeePerGas: config.maxFeePerGas,
		maxPriorityFeePerGas: config.maxPriorityFeePerGas,
		log: true,
	});

};
func.id = '08_RewardDistributor';
module.exports = func;