const NFTUpdater = artifacts.require('NFTUpdater');

module.exports = function (deployer, network, accounts) {
    deployer.deploy(NFTUpdater, { from: accounts[0], overwrite: true }).then(async (instance) => {
    });
};