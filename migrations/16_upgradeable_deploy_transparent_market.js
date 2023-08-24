const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy');
const MetaverseMarket = artifacts.require("MetaverseMarket");
const ProxyAdmin = artifacts.require('ProxyAdmin');
const MyToken = artifacts.require('MyToken');
const NFTCore = artifacts.require('NFTCore');

let marketAddress;

module.exports = function (deployer, network, accounts) {
    const logic = MetaverseMarket.address;
    const proxyAdmin = ProxyAdmin.address;
    const data = '0x';
    deployer.deploy(TransparentUpgradeableProxy, logic, proxyAdmin, data)
        .then(async (instance) => {
            marketAddress = instance.address;
            let market = await MetaverseMarket.at(instance.address);
            console.log("Init marketplace");
            await market.initialize(MyToken.address);
            console.log(await market.owner());
            await market.setTradingFee(5, { from: accounts[0] });
            await market.setTradingToken(MyToken.address, { from: accounts[0] });
        });
};

module.marketAddress = marketAddress;
// truffle run verify ProxyAdmin --network bscTestnet
// truffle run verify TransparentUpgradeableProxy --network bscTestnet