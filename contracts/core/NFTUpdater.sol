// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/INFTCore.sol";
import "./interface/INFTReward.sol";

contract NFTUpdater is INFTReward, OwnableUpgradeable {
    event UpdateItem(uint256 indexed _tokenId, uint8 _newLevel, uint256 _newExp);
    event Reward(address indexed user, uint256 amount);
    event MultiplierChange(uint256 _newMul);
    mapping(address => bool) public admins;
    INFTCore nftCore;
    IERC20 integratedERC20;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public totalRewards;
    uint256 public totalDistributed;
    uint256 public mul;


    modifier onlyAdmin() {
        require(admins[msg.sender], "only allowed admin!");
        _;
    }

    function getUser(address user) external view override returns(uint256 pendingReward, uint256 totalReward) {
        return (rewards[user], totalRewards[user]);
    }

    function initialize(address core, address token) public initializer {
        OwnableUpgradeable.__Ownable_init();
        nftCore = INFTCore(core);
        integratedERC20 = IERC20(token);
        admins[msg.sender] = true;
    }

    function setAdmin(address _admin, bool _enable) public onlyOwner {
        admins[_admin] = _enable;
    }

    function calculateLevel(uint256 _newExp, uint8 currentLevel) public pure returns(uint8) {
        for (uint256 i = currentLevel; i <= 256; i++) {
            uint256 v = 1000*i*i + 4000*i;
            if(_newExp < v) {
                return uint8(i-1);
            }
        }
        // maximum level
        return 255;
    }    

    function calculateExp(uint256 level) public pure returns(uint256) {
        return 1000*level*level + 4000*level;
    }

    function _evolveItem(uint256 _tokenId, uint256 _newExp) internal {
        (uint256 characters,,,uint8 level) = nftCore.getNft(_tokenId);
        uint8 nextLevel = calculateLevel(_newExp, level);
        if(nextLevel > level) {
            _doReward(_tokenId, nextLevel);
        }
        nftCore.evolveNft(_tokenId, characters, _newExp, nextLevel);
        emit UpdateItem(_tokenId, nextLevel, _newExp);
    }

    function _doReward(uint256 _tokenId, uint8 _newLevel) internal {
        address nftOwner = nftCore.ownerOf(_tokenId);
        rewards[nftOwner] += _newLevel * mul; 
    }

    function evolveItem(uint256 _tokenId, uint256 _newExp) public override onlyAdmin {
        _evolveItem(_tokenId, _newExp);
    }

    function claim() public override {
        uint256 _reward = rewards[msg.sender];
        require(_reward > 0, "Nothing to claim!");
        require(integratedERC20.balanceOf(address(this)) >= _reward, "We are out of service. Please claim later!");
        rewards[msg.sender] = 0;
        totalRewards[msg.sender] += _reward;
        totalDistributed += _reward;
        integratedERC20.transfer(msg.sender, _reward);
        emit Reward(msg.sender, _reward);
    }

    function setMultiplier(uint256 _mul) public onlyOwner {
        mul = _mul;
        emit MultiplierChange(mul);
    }

    function setToken(address token) public onlyOwner {
        integratedERC20 = IERC20(token);
    }

    function withdrawToken(address token, address to, uint value) external onlyOwner {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TRANSFER_FAILED');
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(amount < address(this).balance, "WRONG AMOUNT!");
        payable(msg.sender).transfer(amount);
    }
}
