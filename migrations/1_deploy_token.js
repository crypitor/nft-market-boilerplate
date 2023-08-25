const MyToken = artifacts.require("MyToken");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(MyToken, 'MyToken', 'MTK', { from: accounts[0], overwrite: true }).then(async (instance) => {
      await instance.mint(accounts[1], '1000000000000000', {from: accounts[0]});
      const blockNumber = (await MyToken.web3.eth.getTransaction(instance.transactionHash)).blockNumber;
      console.log(blockNumber);
  });
};
// truffle run verify MyToken --network bscTestnet