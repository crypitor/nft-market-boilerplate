const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy');
const NFTUpdater = artifacts.require('NFTUpdater');
const NFTCore = artifacts.require('NFTCore');
const MyToken = artifacts.require("MyToken");
const ProxyAdmin = artifacts.require('ProxyAdmin');

module.exports = async function (deployer, network, accounts) {
    let nft = NFTCore.address;
    let token = MyToken.address;

    const logic = NFTUpdater.address;
    const proxyAdmin = ProxyAdmin.address;
    const data = '0x';
    deployer.deploy(TransparentUpgradeableProxy, logic, proxyAdmin, data, { from: accounts[0], overwrite: true })
        .then(async (instance) => {
            let updater = await NFTUpdater.at(instance.address);
            await updater.initialize(nft, token);
            console.log(await updater.owner());

            let core = await NFTCore.at(NFTCore.address);
            let tx = await core.setExpScientist(updater.address, true);
            console.log("Exp Scientist has been whitelisted at tx: " + tx.tx);

            let setadmin = await updater.setAdmin(accounts[0], true);
            console.log("set admin at txn: " + setadmin.tx);

            let setmul = await updater.setMultiplier(5000000000);
            console.log("set multiplier tx: " + setmul.tx);
        });
};