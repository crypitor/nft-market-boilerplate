import { ethers } from "hardhat";
import { NFTCreator } from "../typechain-types";
import { decode, encode } from "../utils/numeric";
import lodash from "lodash";

async function main() {
    const [deployer] = await ethers.getSigners();
    let creator: NFTCreator = await ethers.getContract("NFTCreator");
    let core = await ethers.getContract("NFTCore");
    let token = await ethers.getContract("MyToken");

    let tx = await creator.setFee(50000000000, true);
    console.log(tx.hash);
    let fee = await creator.fee();
    console.log(fee);
    let random = lodash.random(0, 1000000000);
    let char = encode(decode(BigInt(random), 0n), 0);
    console.log("Random char: " + char);
    let createNftOwner = await creator.createItem(char, { from: deployer });
    console.log("Created nft at txn: " + createNftOwner.hash);   

    // owner create new nft
    //00001001000011101001
    // {

    //     for (let i = 0; i < 20; i++) {
    //         let random = lodash.random(0, 1000000000);
    //         let char = encode(decode(random, 0), 0);
    //         console.log("Random char: " + char);
    //         let createNftOwner = await creator.createItem(char, { from: accounts[0], gas: 10000000 });
    //         console.log("Created nft at txn: " + createNftOwner.tx);   
    //     }
    // }


    // {
    //     let random = lodash.random(0, 1000000000);
    //     // mint token from outside 
    //     // 00001001000011101001
    //     let char = encode(decode(random, 0), 0);
    //     console.log("New character: " + char);
    //     let approve = await token.approve(NFTCreator.address, '1000000000000000000000000', { from: accounts[1] });
    //     console.log("approve token at txn: " + approve.tx);
    //     let mintNft = await creator.mint(char, { from: accounts[1], gas: 10000000 });
    //     console.log("mint nft at txn: " + mintNft.tx);
    // }

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});