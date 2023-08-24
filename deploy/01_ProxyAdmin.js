const config = require("../config/config");


const func = async ({ getNamedAccounts, deployments, network }) => {
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();

	await deploy('ProxyAdmin', {
		from: deployer,
		maxFeePerGas: config.maxFeePerGas,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas,
		log: true,
	});

};
func.id = '01_ProxyAdmin';
module.exports = func;