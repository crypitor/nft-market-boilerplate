// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;


import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./dependency/NFTDependency.sol";
import "./NFTAccessControl.sol";

contract NFTBase is ERC721Enumerable, NFTDependency, NFTAccessControl {
  string public tokenURIPrefix = "https://assets.nft.io/token/";
  string public tokenURISuffix = ".png";

  constructor() ERC721("NFT Token", "NFT") {
      
  }

  function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
      return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view override returns (string memory) {
      return tokenURIPrefix;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    string memory uri = super.tokenURI(tokenId);
      return bytes(uri).length > 0 ? string(abi.encodePacked(uri, tokenURISuffix)) : "";
  }

  function setTokenURI(string memory _prefix, string memory _suffix) external onlyCLevel {
    tokenURIPrefix = _prefix;
    tokenURISuffix = _suffix;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) 
    whenNotPaused
    whenTransferAllowed(from, to, tokenId) 
    internal 
    virtual 
    override{
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}