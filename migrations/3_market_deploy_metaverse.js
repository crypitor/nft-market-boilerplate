const MetaverseMarket = artifacts.require("MetaverseMarket");
const NFTCore = artifacts.require("NFTCore");
const MyToken = artifacts.require("MyToken");

module.exports = function (deployer, network, accounts) {
  let tokenAddress = MyToken.address;
  // if (deployer.network_id == 56) {
  //   tokenAddress = '0xffffffffffffffffffffffffffffffffffffffff';
  // }
  deployer.deploy(MetaverseMarket, { from: accounts[0], overwrite: true })
    .then(async (instance) => {
      await instance.initialize(tokenAddress);
      // approve trade NFT on market
      let core = await NFTCore.at(NFTCore.address);
      let approveTxn = await core.setApprovalForAll(instance.address, true, { from: accounts[0] });
      console.log("Approve market trading for accounts[0] at txn: " + approveTxn.tx);
    });
};

// truffle run verify MetaverseMarket --network bscTestnet