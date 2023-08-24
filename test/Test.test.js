const { expect } = require('chai');
const { ethers, artifacts } = require('hardhat');

let owner, other, another;

describe('Mock', () => {

	beforeEach(async () => {
		[owner, other, another] = await ethers.getSigners();
	});

	// it("Signature", async () => {
	// 	const PawnMultiSig = await ethers.getContractFactory("PawnMultiSig");
	// 	const multiSig = await PawnMultiSig.deploy([owner.address, other.address, another.address]);

	// 	const PawnMultiSigAbi = await artifacts.readArtifact("PawnMultiSig");
	// 	const iface = new ethers.utils.Interface(PawnMultiSigAbi.abi);
	// 	const data = iface.encodeFunctionData("sweepETH", [another.address, ethers.utils.parseEther("0")]);

	// 	const id = 1;
	// 	const targets = [multiSig.address];
	// 	const datas = [data];
	// 	const deadline = parseInt(new Date().getTime() / 1000) + 1800;
	// 	const signature1 = await owner._signTypedData(
	// 		// Domain
	// 		{
	// 			name: 'PawnMultiSig',
	// 			version: '1',
	// 			chainId: 31337,
	// 			verifyingContract: multiSig.address,
	// 		},
	// 		// Types
	// 		{
	// 			Execute: [
	// 				{ name: 'id', type: 'uint256' },
	// 				{ name: 'targets', type: 'address[]' },
	// 				{ name: 'datas', type: 'bytes[]' },
	// 				{ name: 'deadline', type: 'uint256' },
	// 			],
	// 		},
	// 		// Value
	// 		{ id, targets, datas, deadline },
	// 	);
	// 	const signature2 = await other._signTypedData(
	// 		// Domain
	// 		{
	// 			name: 'PawnMultiSig',
	// 			version: '1',
	// 			chainId: 31337,
	// 			verifyingContract: multiSig.address,
	// 		},
	// 		// Types
	// 		{
	// 			Execute: [
	// 				{ name: 'id', type: 'uint256' },
	// 				{ name: 'targets', type: 'address[]' },
	// 				{ name: 'datas', type: 'bytes[]' },
	// 				{ name: 'deadline', type: 'uint256' },
	// 			],
	// 		},
	// 		// Value
	// 		{ id, targets, datas, deadline },
	// 	);
	// 	console.log("owner", owner.address);
	// 	console.log("other", other.address);
	// 	const owners = await multiSig.getOwners();
	// 	console.log("owners", owners);
	// 	await multiSig.execute(id, targets, datas, [deadline, deadline], [signature1, signature2]);
	// 	const result1 = ethers.utils.verifyTypedData(
	// 		{
	// 			name: 'PawnMultiSig',
	// 			version: '1',
	// 			chainId: 31337,
	// 			verifyingContract: multiSig.address,
	// 		},
	// 		{
	// 			Execute: [
	// 				{ name: 'id', type: 'uint256' },
	// 				{ name: 'targets', type: 'address[]' },
	// 				{ name: 'datas', type: 'bytes[]' },
	// 				{ name: 'deadline', type: 'uint256' },
	// 			],
	// 		},
	// 		{ id, targets, datas, deadline },
	// 		signature1
	// 	);
	// 	console.log(result1);
	// });

	it("Test", async () => {
		const PawnToken = await ethers.getContractFactory("PawnToken");
		const supply = ethers.utils.parseEther("100");
		const pawnToken = await PawnToken.deploy("name", "symbol", supply);
		
	    const RewardDistributor = await ethers.getContractFactory("RewardDistributor");
	    const distributor = await RewardDistributor.deploy(owner.address);

		await pawnToken.transfer(distributor.address, supply);

		const receiver = owner.address;
		const tokens = [pawnToken.address];
		const amounts = [supply];
		const data = "0x01";
		const deadline = 0;

		const RewardDistributorAbi = await artifacts.readArtifact("RewardDistributor");
		const iface = new ethers.utils.Interface(RewardDistributorAbi.abi);
		const functionData = iface.encodeFunctionData("hashTypeData", [
			receiver, tokens, amounts, data, deadline
		]);
		console.log("functionData", functionData);

		const signature = await owner._signTypedData(
			// Domain
			{
				name: 'RewardDistributor',
				version: '1',
				chainId: 31337,
				verifyingContract: distributor.address,
			},
			// Types
			{
				Distribute: [
					{ name: 'receiver', type: 'address' },
					{ name: 'tokens', type: 'address[]' },
					{ name: 'amounts', type: 'uint256[]' },
					{ name: 'data', type: 'bytes' },
					{ name: 'deadline', type: 'uint256' },
				],
			},
			// Value
			{ receiver, tokens, amounts, data, deadline },
		);
		console.log("signature", signature);
	    
		const digest = await distributor.hashTypeData(receiver, tokens, amounts, data, deadline);
		console.log(digest);

		const signingKey = new ethers.utils.SigningKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
		const signature2 = signingKey.signDigest(digest);
		console.log("signature2", signature2);
		console.log(ethers.utils.joinSignature(signature2));

		await distributor.distribute(receiver, tokens, amounts, data, deadline, signature);

		console.log((await pawnToken.balanceOf(owner.address)).toString());
	});
});