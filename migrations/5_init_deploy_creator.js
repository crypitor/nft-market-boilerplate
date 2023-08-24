const NFTCreator = artifacts.require('NFTCreator');
const NFTCore = artifacts.require("NFTCore");
const MyToken = artifacts.require("MyToken");

module.exports = async function (deployer, network, accounts) {
    token = MyToken.address;
    nft = NFTCore.address;
    
    deployer.deploy(NFTCreator, nft, token, { from: accounts[0], overwrite: true }).then(async (instance) => {
        let core = await NFTCore.at(NFTCore.address);
        let tx = await core.setSpawner(instance.address, true);
        console.log("Spawner has been whitelisted at tx: " + tx.tx);
    });
    
    // let core = await NFTCore.at(NFTCore.address);
    // let tx = await core.setTokenURI("https://assets.nft.io/nft/", ".png", {from: accounts[0]});
    // console.log("set token uri at tx: " + tx.tx);
    // let token = await core.tokenURI(1);
    // console.log(token);
};