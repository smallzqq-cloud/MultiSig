const config = require("../config/config");

const func = async ({ getNamedAccounts, deployments, network }) => {
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();

	await deploy('CreateProxyFactory', {
		from: deployer,
		maxFeePerGas: config.maxFeePerGas,
		maxPriorityFeePerGas: config.maxPriorityFeePerGas,
		log: true,
	});

};
func.id = '07_CreateProxyFactory';
module.exports = func;