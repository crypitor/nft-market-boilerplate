// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;


/// @title defined the interface that will be referenced in main NFT core contract
interface GeneScienceInterface {
    /// @dev simply a boolean to indicate this is the contract we expect to be
    function isGeneScience() external pure returns (bool);

    /// @dev given genes of fish 1 & 2, return a genetic combination - may have a random factor
    /// @param genes1 genes of mom
    /// @param genes2 genes of sire
    /// @return the genes that are supposed to be passed down the child
    function mixGenes(uint256 genes1, uint256 genes2) external returns (uint256);

    /// @dev random gene for fish
    function randomeGene(uint256 seed) external view returns (uint256 genes);
}
