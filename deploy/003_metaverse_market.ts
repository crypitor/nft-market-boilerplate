import hre, { deployments, ethers } from 'hardhat';
import { MetaverseMarket, MyToken, NFTCore } from '../typechain-types';


async function main() {
  console.log("\n******************* Deploy MetaverseMarket *******************");
  const [deployer, user] = await ethers.getSigners();
  const nftCore: NFTCore = await ethers.getContract("NFTCore");
  const myToken: MyToken = await ethers.getContract("MyToken");

  await deployments.deploy("MetaverseMarket", { from: deployer.address });

  const market: MetaverseMarket = await ethers.getContract("MetaverseMarket", deployer);
  // initialize market with integrated token
  await market.connect(deployer).initialize(await myToken.getAddress());

  // approve market to trade NFT
  const approveTxn = await nftCore.connect(deployer).setApprovalForAll(await market.getAddress(), true);
  console.log("Approve market trading for accounts[0] at txn: " + approveTxn.hash);

  try {
    await hre.run("verify:verify", {
      address: (await ethers.getContract("MetaverseMarket")).getAddress(),
      constructorArguments: [],
    });
  } catch (e) {
    console.error("Can not verify contract for network:", hre.network.name);
  }
}

export default main;