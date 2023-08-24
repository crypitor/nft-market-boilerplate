const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy');
const NFTUpdater = artifacts.require('NFTUpdater');
const NFTCore = artifacts.require('NFTCore');
const MyToken = artifacts.require("MyToken");
const ProxyAdmin = artifacts.require('ProxyAdmin');

module.exports = async function (deployer, network, accounts) {
    let updater = await NFTUpdater.at(TransparentUpgradeableProxy.address);

    // let evolvetx = await updater.evolveItem(98, 12000);
    // console.log("evolve tx: " + evolvetx.tx);
    // let reward = await updater.getUser('0x7c3487cec3635ab75c6f7b30e002ef9fc20685e4');
    // console.log(reward[0].toString());
    // console.log(reward[1].toString());

    // let claim = await updater.claim();
    // console.log("claim: "+ claim.tx);

    // let withdraw = await updater.withdrawToken('0xf9cc6b0c2c01cdd44bc4d3f603cf6e774e54f92d', '0x7c3487cec3635ab75c6f7b30e002ef9fc20685e4', '100000000000');
    // console.log(withdraw.tx);
    //  let setmul = await updater.setMultiplier('5000000000');
    //  console.log(setmul.tx);

};