import { ethers } from "hardhat";
import { MetaverseMarket, NFTCore } from "../typechain-types";
import lodash from "lodash";

async function main() {
    const [deployer, user] = await ethers.getSigners();
    const market: MetaverseMarket = await ethers.getContract("MetaverseMarket");
    const core: NFTCore = await ethers.getContract("NFTCore");

    // check allow nft trading
    const isAllow = await market.approvedNfts(await core.getAddress());
    if (!isAllow) {
        let tx = await market.listing(await core.getAddress(), true, { from: user });
        console.log("Listing NFT to market at tx: " + tx.hash);
    }
    let isApproved = await core.isApprovedForAll(user, await market.getAddress());
    if (!isApproved) {
        let tx = await core.setApprovalForAll(await market.getAddress(), true, { from: user });
        console.log("Set approval for all to market at tx: " + tx.hash);
    }

    let ownerNftBalance = await core.balanceOf(user);
    console.log("Current nft of user: " + ownerNftBalance);
    for (let index = 0; index < ownerNftBalance; index++) {
        let tokenId = await core.tokenOfOwnerByIndex(user, index);
        let random = lodash.random(1, 100);
        let price = 1000000000n * BigInt(random);
        let txn = await market.openOrder(tokenId, await core.getAddress(), price, 16417757388, { from: user })
        console.log("Open trade nftId " + tokenId + " at txn: " + txn.hash);
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});