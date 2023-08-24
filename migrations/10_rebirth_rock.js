const NFTCreator = artifacts.require('NFTCreator');
const NFTCore = artifacts.require("NFTCore");
const MyToken = artifacts.require("MyToken");
const lodash = require("lodash");

module.exports = async function (deployer, network, accounts) {
    let creator = await NFTCreator.at(NFTCreator.address);
    let core = await NFTCore.at(NFTCore.address);

    // let ownerNft = await core.balanceOf(accounts[0]);
    // {

    //     for (let i = 20; i < ownerNft; i++) {
    //         let tokenId = await core.tokenOfOwnerByIndex(accounts[0], i);
    //         let random = lodash.random(0, 1000000000);
    //         let char = encode(decode(random, 0), 0);
    //         console.log("Random char: " + char);
    //         console.log("Rebirth tokenId: " + tokenId.toString());
    //         let rebirthNft = await creator.rebirthNft(tokenId, char, { from: accounts[0], gas: 10000000 });
    //         console.log("Rebirth nft at txn: " + rebirthNft.tx);   
    //     }
    // }

};

function _sliceNumber(_n, _nbits, _offset) {
    // mask is made by shifting left an offset number of times
    let mask = (2 ** _nbits - 1) << _offset;
    // AND n with mask, and trim to max of _nbits bits
    return (_n & mask) >> _offset;
}

function _get5Bits(_input, _slot) {
    return _sliceNumber(_input, 5, _slot * 5);
}

function decode(_characters, level) {
    let totalparts = level + 4;
    let traits = Array(totalparts);
    let i;
    for (i = 0; i < totalparts; i++) {
        traits[i] = _get5Bits(_characters, i) % 16;
    }
    return traits;
}

function encode(_traits, level) {
    let totalparts = level + 4;
    let _characters = 0;
    for (let i = 0; i < totalparts; i++) {
        _characters = _characters << 5;
        // bitwise OR trait with _characters
        _characters = _characters | _traits[(totalparts - 1) - i];
    }
    return _characters;
}