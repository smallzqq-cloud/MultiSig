pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Address.sol";


contract AbiEncode {
   using Address for address;

    function test(address _contract, bytes calldata data) external {
        (bool ok, ) = _contract.call(data);
        require(ok, "call failed");
    }


        struct PairNft {
        uint128 mainTokenId;
        uint128 bakcTokenId;
    }
// "0x7C09A4B1D02Ee22BD73cD2ab4B7870E004036A70"
    function encodeWithSignature(
        address userAddr,
        uint256[] calldata baycNfts,
        uint256[] calldata maycNfts,
        PairNft[] calldata baycPairNfts,
        PairNft[] calldata maycPairNfts
    ) external pure returns (bytes memory) {
        // Typo is not checked - "transfer(address, uint)"
        return
            abi.encodeWithSignature(
                "claimAndRestake(address,uint256[],uint256[],PairNft[],PairNft[])",
                userAddr,
                baycNfts,
                maycNfts,
                baycPairNfts,
                maycPairNfts
            );
    }

     function encodeWithSignature2(
        address userAddr,
        uint256[] calldata baycNfts,
        uint256[] calldata maycNfts,
        PairNft[] calldata baycPairNfts,
        PairNft[] calldata maycPairNfts
    ) external pure returns (bytes memory) {
        // Typo is not checked - "transfer(address, uint)"
        return
            abi.encodeWithSignature(
                "claimAndRestake(address,uint256[],uint256[],(uint128,uint128)[],(uint128,uint128)[])",
                userAddr,
                baycNfts,
                maycNfts,
                baycPairNfts,
                maycPairNfts
            );
    }

    function encodeWithSignature3(
        address userAddr,
        uint256[] calldata baycNfts,
        uint256[] calldata maycNfts,
        PairNft[] calldata baycPairNfts,
        PairNft[] calldata maycPairNfts
    ) external pure returns (bytes memory) { 
        // Typo is not checked - "transfer(address, uint)"
        return
            abi.encodeWithSignature(
                "claimAndRestake(address,uint256[],uint256[],(uint128,uint128)[],(uint128,uint128)[])",
                userAddr,
                baycNfts,
                maycNfts,
                abi.encode(baycPairNfts),
                abi.encode(maycPairNfts)
            );
    }

        /**
     * @notice Contract configuration info
     * @member addMinStakingRate Staking rate threshold
     * @member liquidateRate Safety threshold
     * @member borrowSafeRate Suspension rate
     * @member liquidatePawnAmount PAWN reward for triggering suspension
     * @member feeRate Reinvestment fee
     */
    struct StakingConfiguration {
        uint256 addMinStakingRate;
        uint256 liquidateRate;
        uint256 borrowSafeRate;
        uint256 liquidatePawnAmount;
        uint256 feeRate;
    }

    //   function setStakingConfiguration(StakingConfiguration memory newStakingConfiguration) external onlyRole(DEFAULT_ADMIN_ROLE) {
    //     stakingConfiguration = newStakingConfiguration;
    // }

        function encodeWithSignature4(StakingConfiguration memory newStakingConfiguration) external pure returns (bytes memory) { 
        // Typo is not checked - "transfer(address, uint)"
        return
            abi.encodeWithSignature(
                "setStakingConfiguration((uint256,uint256,uint256,uint256,uint256))",
              newStakingConfiguration
            );
        }

}
