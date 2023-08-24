const config = require("../config/config");

const func = async ({ getNamedAccounts, deployments, network }) => {
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();

	await deploy('PawnToken', {
		from: deployer,
		args: [config.pawnTokenName, config.pawnTokenSymbol, config.pawnTokenTotalSupply],
		maxFeePerGas: config.maxFeePerGas,
		maxPriorityFeePerGas: config.maxPriorityFeePerGas,
		log: true,
	});
};
func.id = '03_PawnToken';
module.exports = func;