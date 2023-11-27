import { ethers } from "hardhat";
import { NFTCore } from "../typechain-types";


async function main() {
    let core: NFTCore = await ethers.getContract("NFTCore");
    let tx = await core.setTokenURI("https://assets-testing.nft.io/nft/", ".png")
    console.log("Set token uri at tx: " + tx.hash);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
