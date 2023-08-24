const NFTCore = artifacts.require("NFTCore");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(NFTCore, { from: accounts[0], overwrite: false }).then(async (instance) => {
  });

};