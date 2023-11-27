// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;


import "./NFTBase.sol";


// solium-disable-next-line no-empty-blocks
contract NFTCore is NFTBase {
  struct NFTStruct {
    uint256 character;
    uint256 exp;
    uint256 bornAt;
    uint8 level;
  }

  NFTStruct[] public nftStruct;

  event NftSpawned(uint256 indexed _tokenId, address indexed _owner, uint256 _character, uint256 _exp, uint256 _bornAt, uint8 _level);
  event NftEvolved(uint256 indexed _tokenId, uint256 _newCharacter, uint256 _newExp, uint8 _newLevel);
  event NftRebirthed(uint256 indexed _tokenId, uint256 _character);
  event NftRetired(uint256 indexed _tokenId);

  modifier validateNft(uint256 _tokenId) {
    require(_exists(_tokenId));
    _;
  }

  constructor() NFTBase() {
    nftStruct.push(NFTStruct(0, ~uint256(0), block.timestamp, ~uint8(0))); // The void NFTStruct with super power
  }

  function getNft(
    uint256 _tokenId
  )
    external
    view
    validateNft(_tokenId)
    returns (
      uint256 character, 
      uint256 exp, 
      uint256 bornAt,
      uint8 level)
  {
    NFTStruct storage _token = nftStruct[_tokenId];
    return (_token.character, _token.exp, _token.bornAt, _token.level);
  }

  function spawnNft(
    uint256 _character,
    address _owner,
    uint256 delay
  )
    external
    onlySpawner
    whenNotPaused
    whenSpawningAllowed(_character, _owner)
    returns (uint256 _tokenId)
  {
    return _spawnNft(_character, _owner, delay);
  }

  function _spawnNft(
    uint256 _character,
    address _owner,
    uint256 delay
  )
    internal
    returns (uint256 _tokenId)
  {
    NFTStruct memory _token = NFTStruct(_character, 0, block.timestamp + delay, 0);
    nftStruct.push(_token);
    _tokenId = nftStruct.length - 1;
    _mint(_owner, _tokenId);
    emit NftSpawned(_tokenId, _owner, 
                    nftStruct[_tokenId].character, 
                    nftStruct[_tokenId].exp, 
                    nftStruct[_tokenId].bornAt,
                    nftStruct[_tokenId].level);
  }

  function evolveNft(
    uint256 _tokenId,
    uint256 _advanceCharacter,
    uint256 _newExp,
    uint8 _newLevel
  )
    external
    whenNotPaused
    onlyExpScientist
    validateNft(_tokenId)
    whenEvolvementAllowed(_tokenId, _newExp)
  {
    NFTStruct storage _token = nftStruct[_tokenId];
    _token.character = _advanceCharacter;
    _token.exp = _newExp;
    _token.level = _newLevel;
    emit NftEvolved(_tokenId, _token.character, _token.exp, _token.level);
  }

  function rebirthNft(
    uint256 _tokenId,
    uint256 _character,
    uint256 delay
  )
    external
    whenNotPaused
    onlySpawner
    validateNft(_tokenId)
    whenRebirthAllowed(_tokenId, _character)
  {
    NFTStruct storage nft = nftStruct[_tokenId];
    nft.character = _character;
    nft.bornAt = block.timestamp + delay;
    emit NftRebirthed(_tokenId, _character);
  }

  function retireNft(
    uint256 _tokenId,
    bool _rip
  )
    external
    whenNotPaused
    onlyByeSayer
    whenRetirementAllowed(_tokenId, _rip)
  {
    _burn(_tokenId);

    if (_rip) {
      delete nftStruct[_tokenId];
    }

    emit NftRetired(_tokenId);
  }


  function isValidNft(uint256 _tokenId) public view returns (bool){
    return nftStruct[_tokenId].character != 0 && nftStruct[_tokenId].bornAt != 0 && nftStruct[_tokenId].bornAt <= block.timestamp;
  }
}
