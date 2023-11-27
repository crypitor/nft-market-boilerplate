// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTDependency.sol";

// solium-disable-next-line lbrace
contract NFTManager is
  INFTSpawningManager,
  INFTRetirementManager,
  INFTMarketplaceManager,
  INFTExpManager,
  Ownable
{

  bool public allowedAll = true;

  function setAllowAll(bool _allowedAll) external onlyOwner {
    allowedAll = _allowedAll;
  }

  function isSpawningAllowed(uint256 /*_characters*/, address owner) external view virtual override returns (bool) {
    require(owner != address(0), "Can not spawn nft to ZERO!");
    return allowedAll;
  }

  function isRebirthAllowed(uint256, uint256 /*_characters*/) external view virtual override returns (bool) {
    return allowedAll;
  }

  function isRetirementAllowed(uint256, bool) external view virtual override returns (bool) {
    return allowedAll;
  }

  function isTransferAllowed(address, address, uint256) external view virtual override returns (bool) {
    return allowedAll;
  }

  function isEvolvementAllowed(uint256, uint256) external view virtual override returns (bool) {
    return allowedAll;
  }
}

contract NFTDeepManager is NFTManager {
  mapping(uint256 => bool) public blackTransfer;

  function isSpawningAllowed(uint256 _character, address _owner) view external override returns (bool) {
    
  }

  function isRebirthAllowed(uint256 _tokenId, uint256 _character) view external override returns (bool) {

  }

  function isRetirementAllowed(uint256 _tokenId, bool _rip) view external override returns (bool) {

  }

  function isTransferAllowed(address _from, address _to, uint256 _tokenId) view external override returns (bool) {

  }

  function isEvolvementAllowed(uint256 _tokenId, uint256 _newStrength) view external override returns (bool) {

  }
}