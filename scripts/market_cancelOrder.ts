import { ethers } from "hardhat";
import { MetaverseMarket, MyToken, NFTCore } from "../typechain-types";

async function main() {
    const [deployer, user] = await ethers.getSigners();
    let market: MetaverseMarket = await ethers.getContract("MetaverseMarket");
    let core: NFTCore = await ethers.getContract("NFTCore");
    let token: MyToken = await ethers.getContract("MyToken");

    // retrieve open order
    let totalOpenOrder = await market.totalOpenOrder();
    let orderIds = await market.openOrderIdsByRange(0, totalOpenOrder);
    console.log(orderIds.toString());

    // // execute orderId[0]
    for (let i = 0; i < orderIds.length; i++) {
        const element = orderIds[i];
        console.log("Cancel orderId: " + element);
        let tx = await market.cancelOrder(element, { from: user});
        console.log("Cancel Order at transaction: " + tx.hash);
    }
};


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});