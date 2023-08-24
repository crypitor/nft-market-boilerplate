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

    let approval = await token.approve(TransparentUpgradeableProxy.address, '1000000000000000000000000', {from: accounts[1]});
    console.log("Approve token transfer from at tx: " + approval.tx);

    let startingBalance = await token.balanceOf(accounts[1]);
    console.log("Starting Balance: " + startingBalance);

    // retrieve open order
    let totalOpenOrder = await market.totalOpenOrder();
    let orderIds = await market.openOrderIdsByRange(0, totalOpenOrder);
    console.log(orderIds.toString());

    // retrieve orderId[0]
    let item = await market.getOrder(orderIds[0]);
    let price = item[3];
    console.log("OrderId: " + orderIds[0] + "\nItemId: " + item[1].toString() + "\nItem Price: " + price.toString());

    console.log("Expecting Balance After Buy: " + (startingBalance - price));
    // // execute orderId[0]
    let tx = await market.executeOrder(orderIds[0], {from: accounts[1]});
    console.log("Execute Order at transaction: " + tx.tx);
    // // retrieve ending balance after Order
    let endingBalance = await token.balanceOf(accounts[1]);
    console.log("Ending Balance: " + endingBalance);
};