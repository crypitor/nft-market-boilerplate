const ProxyAdmin = artifacts.require('ProxyAdmin');

module.exports = function (deployer, network, accounts) {
    deployer.deploy(ProxyAdmin, { from: accounts[0], overwrite: false });
};

// truffle run verify ProxyAdmin --network bscTestnet
// truffle run verify Upgradeable --network bscTestnet