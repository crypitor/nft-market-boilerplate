// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interface/INFTCore.sol";

contract NFTEvolver is Ownable {
    event EvolveItem(address owner, uint256 _tokenId);
    mapping(address => bool) public admins;
    bool public canEvolve;
    INFTCore nftCore;
    uint8 normalRange = 16;
    mapping(uint8 => uint256) public thresholds;


    modifier onlyAdmin() {
        require(admins[msg.sender], "only allowed admin!");
        _;
    }

    constructor(address core) {
        nftCore = INFTCore(core);
        admins[msg.sender] = true;
        canEvolve = false;
        thresholds[1] = 1000; // level 1 => 1000exp
        thresholds[2] = 10000; // level 2 => 10000 exp
        thresholds[3] = 50000; // level 3 => 50000 exp
        thresholds[4] = 100000; // level 4 => 100000 exp
    }

    function setAdmin(address _admin, bool _enable) public onlyOwner {
        admins[_admin] = _enable;
    }

    function enableEvolve(bool _enable) public onlyOwner {
        canEvolve = _enable;
    }

    function updateThreshold(uint8 _level, uint256 _threshold)
        public
        onlyOwner
    {
        thresholds[_level] = _threshold;
    }

    function _sliceNumber(
        uint256 _n,
        uint256 _nbits,
        uint256 _offset
    ) private pure returns (uint256) {
        // mask is made by shifting left an offset number of times
        uint256 mask = uint256((2**_nbits) - 1) << _offset;
        // AND n with mask, and trim to max of _nbits bits
        return uint256((_n & mask) >> _offset);
    }

    function _get5Bits(uint256 _input, uint256 _slot)
        internal
        pure
        returns (uint8)
    {
        return uint8(_sliceNumber(_input, uint256(5), _slot * 5));
    }

    function _evolveItem(uint256 _tokenId, uint256 _newExp)
        private
    {
        (uint256 characters,,,uint8 level) = nftCore.getNft(_tokenId);
    
        if (canEvolve && _newExp >= thresholds[level + 1] && thresholds[level + 1] != 0) {
            // reach new level if you passed the threshold
            level += 1;
            // random new evolution character as a gift
            uint256 rand = uint256(keccak256(abi.encodePacked(_tokenId, _newExp, blockhash(block.number-1), block.timestamp)));
            uint8 newCharacter = uint8(_sliceNumber(rand, 5, 0) % normalRange);
            characters = (characters << 5) | newCharacter;
        }

        nftCore.evolveNft(_tokenId, characters, _newExp, level);
        emit EvolveItem(msg.sender, _tokenId);
    }

    function evolveItem(uint256 _tokenId, uint256 _newExp) public onlyAdmin {
        _evolveItem(_tokenId, _newExp);
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount < address(this).balance, "WRONG AMOUNT!");
        payable(msg.sender).transfer(amount);
    }
}
