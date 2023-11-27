import { ethers } from "hardhat";
import { decode, encode } from "../utils/numeric";
import lodash from "lodash";
import { NFTCore, NFTCreator } from "../typechain-types";

async function main() {
    const [deployer] = await ethers.getSigners();
    let creator: NFTCreator = await ethers.getContract("NFTCreator");
    let core: NFTCore = await ethers.getContract("NFTCore");

    let ownerNftBalance = await core.balanceOf(deployer);
    {
        for (let i = 0; i < ownerNftBalance; i++) {
            let tokenId = await core.tokenOfOwnerByIndex(deployer, i);
            let random = lodash.random(0, 1000000000);
            let char = encode(decode(BigInt(random), 0n), 0);
            console.log("Random char: " + char);
            console.log("Rebirth tokenId: " + tokenId.toString());
            let rebirthNft = await creator.rebirthNft(tokenId, char, { from: deployer });
            console.log("Rebirth nft at txn: " + rebirthNft.hash);   
        }
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});