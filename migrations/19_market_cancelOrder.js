const MetaverseMarket = artifacts.require("MetaverseMarket");
const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy');
const NFTCore = artifacts.require("NFTCore");
const MyToken = artifacts.require("MyToken");

const Web3 = require('web3');

module.exports = async function (deployer, network, accounts) {
    var web3 = new Web3(deployer.provider);
    let market = await MetaverseMarket.at(TransparentUpgradeableProxy.address);
    let core = await NFTCore.at(NFTCore.address);
    let token = await MyToken.at(MyToken.address);

    // retrieve open order
    let totalOpenOrder = await market.totalOpenOrder();
    let orderIds = await market.openOrderIdsByRange(0, totalOpenOrder);
    console.log(orderIds.toString());

    // // execute orderId[0]
    for (let i = 0; i < orderIds.length; i++) {
        const element = orderIds[i];
        console.log("Cancel orderId: " + element);
        let tx = await market.cancelOrder(element, { from: accounts[0]});
        console.log("Cancel Order at transaction: " + tx.tx);
    }
};