const utils = require("../scripts/utils");
const config = require("../config/config");

const func = async ({getNamedAccounts, deployments, network}) => {
    const { get, execute } = deployments;

    const {deployer} = await getNamedAccounts();

    const multiSig = await get("PawnMultiSig");
    const proxyAdmin = await get("ProxyAdmin");
    const pawnToken = await get("PawnToken");
    const faucetClaim = await get("PawnFaucetClaim");
    const tokenInfo = await get("PawnTokenInfo");
    const transferManagerImpl = await get("NftTransferManager");
    const createProxyFactory = await get("CreateProxyFactory");
    const rewardDistributor = await get("RewardDistributor");
    const deployConfig = {
        "multiSig": {
			args: { owners: config.signers },
			address: multiSig.address
		},
        "proxyAdmin": {
			address: proxyAdmin.address
		},
        "pawnToken": {
			args: {
				name: config.pawnTokenName,
				symbol: config.pawnTokenSymbol,
				supply: config.pawnTokenTotalSupply.toString()
			},
			address: pawnToken.address
		},
        "pawnFaucetClaim": {
			args: {
				signer: config.signer 
			},
			address: faucetClaim.address
		},
        "pawnTokenInfo": {
			address: tokenInfo.address
		},
        "nftTransferManagerImpl": {
			address: transferManagerImpl.address
		},
        "createProxyFactory": {
			address: createProxyFactory.address
		},
        "rewardDistributor": {
            args: {
                signer: config.signer 
            },
            address: rewardDistributor.address
        },
		"params": {
            "signers": config.signers,
            "pawnTokenName": config.pawnTokenName,
            "pawnTokenSymbol": config.pawnTokenSymbol,
            "pawnTokenTotalSupply": config.pawnTokenTotalSupply.toString(),
            "signer": config.signer
        }
	};

    const erc20Addrs = config.tokenInfos.erc20.map(e => e.address);

    let erc20 = erc20Addrs.concat([pawnToken.address]);
    let types = Array(erc20.length).fill(20);

    await execute('PawnFaucetClaim', {
        from: deployer,
        maxFeePerGas: config.maxFeePerGas,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas,
    }, 'setTokenType', erc20, types);

    const erc721Addrs = config.tokenInfos.erc721.map(e => e.address);

    types = Array(erc721Addrs.length).fill(721);
    await execute('PawnFaucetClaim', {
        from: deployer,
        maxFeePerGas: config.maxFeePerGas,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas,
    }, 'setTokenType', erc721Addrs, types);

    Object.assign(config.tokenInfos, {
        "pawnToken": pawnToken.address
    });

    let tokenInfoContent = JSON.stringify(config.tokenInfos, null, "\t");
    utils.writeFileSync(config.tokenFile, tokenInfoContent);

    let deployContent = JSON.stringify(deployConfig, null, "\t");
    utils.writeFileSync(config.helperFile, deployContent);
};
func.id = '99_WriteToken';
module.exports = func;