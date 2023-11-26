import { ethers } from "hardhat";
import { NFTEvolver } from "../typechain-types";


async function main() {
    const [deployer] = await ethers.getSigners();

    let evolver: NFTEvolver = await ethers.getContract("NFTEvolver");

    let evolvetx = await evolver.evolveItem(98, 12000);
    console.log("evolve tx: " + evolvetx.hash);
    // let reward = await evolver.getUser(accounts[1].address);
    // console.log(reward[0].toString());
    // console.log(reward[1].toString());

    // let claim = await evolver.claim();
    // console.log("claim: "+ claim.tx);

    // let withdraw = await evolver.withdrawToken('0xf9cc6b0c2c01cdd44bc4d3f603cf6e774e54f92d', '0x7c3487cec3635ab75c6f7b30e002ef9fc20685e4', '100000000000');
    // console.log(withdraw.tx);
    //  let setmul = await evolver.setMultiplier('5000000000');
    //  console.log(setmul.tx);

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});