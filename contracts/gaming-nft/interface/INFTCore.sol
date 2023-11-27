// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INFTCore is IERC721 {
    function getNft(uint256 _tokenId) external view returns (uint256 character, uint256 exp, uint256 bornAt,uint8 level);
    function spawnNft(uint256 _character,address _owner, uint256 _delay) external returns(uint256);
    function rebirthNft(uint256 _tokenId,uint256 _character,uint256 delay) external ;
    function evolveNft(uint256 _tokenId,uint256 _advanceCharacter,uint256 _newExp,uint8 _newLevel) external;
}