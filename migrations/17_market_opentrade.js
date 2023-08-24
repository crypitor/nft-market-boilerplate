const MetaverseMarket = artifacts.require("MetaverseMarket");
const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy');
const NFTCore = artifacts.require("NFTCore");
const lodash = require("lodash");
const bn = require("bn.js");

module.exports = async function (deployer, network, accounts) {
    const marketAddress = TransparentUpgradeableProxy.address;
    const market = await MetaverseMarket.at(marketAddress);
    const core = await NFTCore.at(NFTCore.address);

    // check allow nft trading
    const isAllow = await market.approvedNfts(NFTCore.address);
    if(!isAllow) {
        let tx = await market.listing(NFTCore.address, true, {from: accounts[0]});
        console.log("Listing NFT to market at tx: " + tx.tx);
    }
    let isApproved = await core.isApprovedForAll(accounts[0], marketAddress);
    if(!isApproved) {
        let tx = await core.setApprovalForAll(marketAddress, true, {from: accounts[0]});
        console.log("Set approval for all to market at tx: " + tx.tx);
    }

    let ownerNftBalance = await core.balanceOf(accounts[0]);
    console.log("Current nft of accounts[0]: " + ownerNftBalance);
    for (let index = 0; index < ownerNftBalance; index++) {
        let tokenId = await core.tokenOfOwnerByIndex(accounts[0], index);
        let random = lodash.random(1, 100);
        let price = new bn('1000000000').muln(random);
        let txn = await market.openOrder(tokenId, core.address, price, 16417757388, { from: accounts[0] })
        console.log("Open trade nftId " + tokenId + " at txn: " + txn.tx);
    }
};