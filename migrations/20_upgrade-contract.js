const MetaverseMarket = artifacts.require("MetaverseMarket");
const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy');

module.exports = async function (deployer, network, accounts) {
    // New market
    // deployer.deploy(MetaverseMarket, { from: accounts[0], overwrite: true })
    //     .then(async (instance) => {
    //         let market = await MetaverseMarket.at(TransparentUpgradeableProxy.address);
    //         const logic = instance.address;
    //         const proxyAdmin = await ProxyAdmin.at(ProxyAdmin.address);
    //         let tx = await proxyAdmin.upgrade(TransparentUpgradeableProxy.address, logic, { from: accounts[0] });
    //         console.log("Change implementation at tx: " + tx.tx);
    //         let impl = await proxyAdmin.getProxyImplementation(TransparentUpgradeableProxy.address);
    //         console.log("New Impl: " + impl);
    //         let trade = await market.getOrder(0);
    //         console.log("get order: " + trade.toString());
    //     });

    let market = await MetaverseMarket.at(TransparentUpgradeableProxy.address);
    // const logic = '0xb78f2B579d90582B53CB63D2a16b5DFDe231d7C2';
    // const proxyAdmin = await ProxyAdmin.at(ProxyAdmin.address);
    // let tx = await proxyAdmin.upgrade(TransparentUpgradeableProxy.address, logic, { from: accounts[0] });
    // console.log("Change implementation at tx: " + tx.tx);
    // let impl = await proxyAdmin.getProxyImplementation(TransparentUpgradeableProxy.address);
    // console.log("New Impl: " + impl);
    let setToken = await market.setToken('0xD301fC0F091d87f59Db47e0C7255c967c55CDd96');
    console.log("set token " + setToken.tx);
};

// truffle run verify ProxyAdmin --network bscTestnet
// truffle run verify TransparentUpgradeableProxy --network bscTestnet

// 0xC4A66D5Dd5C6F9291e1C4C5b9131191a94fD37b1