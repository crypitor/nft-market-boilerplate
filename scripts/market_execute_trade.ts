import { ethers } from "hardhat";
import { MetaverseMarket, MyToken, NFTCore } from "../typechain-types";


async function main() {
    const [deployer, user] = await ethers.getSigners();
    let market: MetaverseMarket = await ethers.getContract("MetaverseMarket");
    let core: NFTCore = await ethers.getContract("NFTCore");
    let token: MyToken = await ethers.getContract("MyToken");

    let approval = await token.approve(await market.getAddress(), '1000000000000000000000000', { from: user });
    console.log("Approve token transfer from at tx: " + approval.hash);

    let startingBalance = await token.balanceOf(user);
    console.log("Starting Balance: " + startingBalance);

    // retrieve open order
    let totalOpenOrder = await market.totalOpenOrder();
    let orderIds = await market.openOrderIdsByRange(0, totalOpenOrder);
    console.log(orderIds.toString());

    // retrieve orderId[0]
    let item = await market.getOrder(orderIds[0]);
    let price = item[3];
    console.log("OrderId: " + orderIds[0] + "\nItemId: " + item[1].toString() + "\nItem Price: " + price.toString());

    console.log("Expecting Balance After Buy: " + (startingBalance - price));
    // // execute orderId[0]
    let tx = await market.executeOrder(orderIds[0], { from: user });
    console.log("Execute Order at transaction: " + tx.hash);
    // // retrieve ending balance after Order
    let endingBalance = await token.balanceOf(user);
    console.log("Ending Balance: " + endingBalance);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});