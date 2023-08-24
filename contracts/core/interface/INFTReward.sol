// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

interface INFTReward {
    function getUser(address user) external view returns(uint256 pendingReward, uint256 totalRelease);
    function evolveItem(uint256 _tokenId, uint256 _newExp) external;
    function claim() external;
}
