const MyToken = artifacts.require("MyToken");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(MyToken, 'MyToken', 'MTK', { from: accounts[0], overwrite: false }).then(async (instance) => {
      await instance.mint(accounts[1], '1000000000000000', {from: accounts[0]});
  });
};
// truffle run verify MyToken --network bscTestnet