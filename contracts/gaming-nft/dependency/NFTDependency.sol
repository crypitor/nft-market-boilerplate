// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

interface INFTSpawningManager {
	function isSpawningAllowed(uint256 _character, address _owner) external returns (bool);
  function isRebirthAllowed(uint256 _tokenId, uint256 _character) external returns (bool);
}

interface INFTRetirementManager {
  function isRetirementAllowed(uint256 _tokenId, bool _rip) external returns (bool);
}

interface INFTMarketplaceManager {
  function isTransferAllowed(address _from, address _to, uint256 _tokenId) external returns (bool);
}

interface INFTExpManager {
  function isEvolvementAllowed(uint256 _tokenId, uint256 _newStrength) external returns (bool);
}

contract NFTDependency {
  address public whitelistSetterAddress;

  INFTSpawningManager public spawningManager;
  INFTRetirementManager public retirementManager;
  INFTMarketplaceManager public marketplaceManager;
  INFTExpManager public expManager;

  mapping (address => bool) public whitelistedSpawner;
  mapping (address => bool) public whitelistedByeSayer;
  mapping (address => bool) public whitelistedMarketplace;
  mapping (address => bool) public whitelistedExpScientist;

  constructor() {
    whitelistSetterAddress = msg.sender;
  }

  modifier onlyWhitelistSetter() {
    require(msg.sender == whitelistSetterAddress);
    _;
  }

  modifier whenSpawningAllowed(uint256 _character, address _owner) {
    require(
      spawningManager == INFTSpawningManager(address(0)) ||
        spawningManager.isSpawningAllowed(_character, _owner)
    );
    _;
  }

  modifier whenRebirthAllowed(uint256 _tokenId, uint256 _character) {
    require(
      address(spawningManager) == address(0) ||
        spawningManager.isRebirthAllowed(_tokenId, _character)
    );
    _;
  }

  modifier whenRetirementAllowed(uint256 _tokenId, bool _rip) {
    require(
      address(retirementManager) == address(0) ||
        retirementManager.isRetirementAllowed(_tokenId, _rip)
    );
    _;
  }

  modifier whenTransferAllowed(address _from, address _to, uint256 _tokenId) {
    require(
      address(marketplaceManager) == address(0) ||
        marketplaceManager.isTransferAllowed(_from, _to, _tokenId)
    );
    _;
  }

  modifier whenEvolvementAllowed(uint256 _tokenId, uint256 _newStrength) {
    require(
      address(expManager) == address(0) ||
        expManager.isEvolvementAllowed(_tokenId, _newStrength)
    );
    _;
  }

  modifier onlySpawner() {
    require(whitelistedSpawner[msg.sender]);
    _;
  }

  modifier onlyByeSayer() {
    require(whitelistedByeSayer[msg.sender]);
    _;
  }

  modifier onlyMarketplace() {
    require(whitelistedMarketplace[msg.sender]);
    _;
  }

  modifier onlyExpScientist() {
    require(whitelistedExpScientist[msg.sender]);
    _;
  }

  /*
   * @dev Setting the whitelist setter address to `address(0)` would be a irreversible process.
   *  This is to lock changes to NFT's contracts after their development is done.
   */
  function setWhitelistSetter(address _newSetter) external onlyWhitelistSetter {
    whitelistSetterAddress = _newSetter;
  }

  function setSpawningManager(address _manager) external onlyWhitelistSetter {
    spawningManager = INFTSpawningManager(_manager);
  }

  function setRetirementManager(address _manager) external onlyWhitelistSetter {
    retirementManager = INFTRetirementManager(_manager);
  }

  function setMarketplaceManager(address _manager) external onlyWhitelistSetter {
    marketplaceManager = INFTMarketplaceManager(_manager);
  }

  function setExpManager(address _manager) external onlyWhitelistSetter {
    expManager = INFTExpManager(_manager);
  }

  function setSpawner(address _spawner, bool _whitelisted) external onlyWhitelistSetter {
    require(whitelistedSpawner[_spawner] != _whitelisted);
    whitelistedSpawner[_spawner] = _whitelisted;
  }

  function setByeSayer(address _byeSayer, bool _whitelisted) external onlyWhitelistSetter {
    require(whitelistedByeSayer[_byeSayer] != _whitelisted);
    whitelistedByeSayer[_byeSayer] = _whitelisted;
  }

  function setMarketplace(address _marketplace, bool _whitelisted) external onlyWhitelistSetter {
    require(whitelistedMarketplace[_marketplace] != _whitelisted);
    whitelistedMarketplace[_marketplace] = _whitelisted;
  }

  function setExpScientist(address _expScientist, bool _whitelisted) external onlyWhitelistSetter {
    require(whitelistedExpScientist[_expScientist] != _whitelisted);
    whitelistedExpScientist[_expScientist] = _whitelisted;
  }
}
