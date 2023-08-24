// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/INFTCore.sol";

interface INFTCreator {
    function mint(uint256 _characters) external returns(uint256);
}

contract NFTCreator is Ownable, INFTCreator {
    event CreateItem(address owner, uint256 _tokenId);
    event RebirthItem(uint256 _tokenId, uint256 _characters);
    event FeeUpdated(uint256 _newFee);
    event RollingUpdated(uint256 _changeLine, uint256 _changeRate);
    address public creatorFeeReiver;
    IERC20 public feeToken;
    INFTCore nftCore;
    uint8 normalRange = 16;

    uint256 changeLine = 1000;
    uint256 changeRate = 20;
    uint256 totalCreated = 0;
    uint256 public fee = 100*10**9; // init fee 100Token
    bool isSoftFee;

    constructor(address core, address token) {
        nftCore = INFTCore(core);
        feeToken = IERC20(token);
        creatorFeeReiver = msg.sender;
    }

    function getCurrentFee() internal returns(uint256){
        if(isSoftFee && totalCreated % changeLine == 0) {
            fee += fee * changeRate/100;
            emit FeeUpdated(fee);
        }
        return fee;
    }

    function setFeeToken(address _feeToken) public onlyOwner {
        feeToken = IERC20(_feeToken);
    }

    function setFee(uint256 _fee, bool _isSoftFee) public onlyOwner {
        fee = _fee;
        isSoftFee = _isSoftFee;
        emit FeeUpdated(fee);
    }

    function setRolling(uint256 _changeLine, uint256 _changeRate) public onlyOwner {
        require(changeRate <= 100, "changeRate must lower than 100");
        changeLine = _changeLine;
        _changeRate = _changeRate;
    }

    function _sliceNumber(uint256 _n, uint256 _nbits, uint256 _offset) private pure returns (uint256) {
        // mask is made by shifting left an offset number of times
        uint256 mask = uint256((2**_nbits) - 1) << _offset;
        // AND n with mask, and trim to max of _nbits bits
        return uint256((_n & mask) >> _offset);
    }

    function _get5Bits(uint256 _input, uint256 _slot) internal pure returns(uint8) {
        return uint8(_sliceNumber(_input, uint256(5), _slot * 5));
    }

    function decode(uint256 _characters) public pure returns(uint8[] memory) {
        uint8[] memory traits = new uint8[](4);
        uint256 i;
        for(i = 0; i < 4; i++) {
            traits[i] = _get5Bits(_characters, i);
        }
        return traits;
    }

    function encode(uint8[] memory _traits) public pure returns (uint256 _characters) {
        _characters = 0;
        for(uint256 i = 0; i < 4; i++) {
            _characters = _characters << 5;
            // bitwise OR trait with _characters
            _characters = _characters | _traits[3 - i];
        }
        return _characters;
    }

    function mint(uint256 _characters) public override returns(uint256){
        uint8[] memory decoded = decode(_characters);
        for(uint8 i = 0; i < 4; i++) {
            require(decoded[i] < normalRange, "Invalid Character!");
        }
        feeToken.transferFrom(msg.sender, creatorFeeReiver, getCurrentFee());
        _characters = encode(decoded);
        totalCreated += 1;
        return _createItem(_characters);
    }

    function _createItem(uint256 characters)
        private
        returns (uint256 tokenId)
    {
        tokenId = nftCore.spawnNft(characters, msg.sender, 0);
        emit CreateItem(msg.sender, tokenId);
    }

    function createItem(uint256 characters)
        public
        onlyOwner
        returns (uint256 tokenId)
    {
        return _createItem(characters);
    }

    function createMultiItem(uint8 amount, uint256 characters)
        public
        onlyOwner
    {
        require(amount <= 50, "You can only create max 50 Itemes per transaction");
        for (uint8 i; i < amount; i++) {
            _createItem(characters);
        }
    }

    function rebirthNft(uint256 _tokenId, uint256 _characters) public onlyOwner {
        nftCore.rebirthNft(_tokenId, _characters, 0);
        emit RebirthItem(_tokenId, _characters);
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount < address(this).balance, "WRONG AMOUNT!");
        payable(msg.sender).transfer(amount);
    }
}
