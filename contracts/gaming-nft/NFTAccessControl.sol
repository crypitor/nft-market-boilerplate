// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract NFTAccessControl is Pausable {

  address public ceoAddress;
  address public cfoAddress;
  address public cooAddress;

  constructor() {
    ceoAddress = msg.sender;
    cfoAddress = msg.sender;
    cooAddress = msg.sender;
  }

  modifier onlyCEO() {
    require(msg.sender == ceoAddress);
    _;
  }

  modifier onlyCFO() {
    require(msg.sender == cfoAddress);
    _;
  }

  modifier onlyCOO() {
    require(msg.sender == cooAddress);
    _;
  }

  modifier onlyCLevel() {
    require(
      // solium-disable operator-whitespace
      msg.sender == ceoAddress ||
        msg.sender == cfoAddress ||
        msg.sender == cooAddress
      // solium-enable operator-whitespace
    );
    _;
  }

  function setCEO(address _newCEO) external onlyCEO {
    require(_newCEO != address(0));
    ceoAddress = _newCEO;
  }

  function setCFO(address _newCFO) external onlyCEO {
    cfoAddress = _newCFO;
  }

  function setCOO(address _newCOO) external onlyCEO {
    cooAddress = _newCOO;
  }

  function withdrawBalance() external onlyCFO {
    payable(cfoAddress).transfer(address(this).balance);
  }

  function withdrawToken(address token, address to, uint value) external onlyCFO {
      // bytes4(keccak256(bytes('transfer(address,uint256)')));
      (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
      require(success && (data.length == 0 || abi.decode(data, (bool))), 'TRANSFER_FAILED');
  }

  function pause() external onlyCLevel {
    _pause();
  }

  function unpause() external onlyCEO {
    _unpause();
  }
}
