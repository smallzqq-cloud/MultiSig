require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-log-remover');
require('hardhat-deploy');
require('@primitivefi/hardhat-dodoc');

module.exports = {
	namedAccounts: {
		deployer: {
			default: 0
		}
	},
	solidity: {
		compilers: [{
			version: "0.8.17",
			settings: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			},
		},{
			version: "0.7.6",
			settings: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			},
		}]
	},
	networks: {
		hardhat: {
			forking: {
				url: "https://eth-goerli.g.alchemy.com/v2/Ha8QNWLcgaj-X4AhjxF8-EAmMi422x8C",
				blockNumber: 8090040
			},
			deploy: []
		},
		goerli: {
			url: `${process.env.GOERLI_NETWORK}`,
			chainId: 5,
			gasPrice: 'auto',
			accounts: [`${process.env.PRIVATEKEY}`],
		},
		mumbai: {
			url: `${process.env.MUMBAI_NETWORK}`,
			chainId: 80001,
			gasPrice: 'auto',
			accounts: [`${process.env.PRIVATEKEY}`],
		}
	},
	contractSizer: {
		alphaSort: true,
		runOnCompile: false,
		disambiguatePaths: false,
	},
	dodoc: {
		runOnCompile: false,
		debugMode: false,
	}
};