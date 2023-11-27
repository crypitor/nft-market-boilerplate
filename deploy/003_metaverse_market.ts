import hre, { deployments, ethers, upgrades } from 'hardhat';
import { MetaverseMarket, MyToken, NFTCore } from '../typechain-types';
import { DeployFunction } from 'hardhat-deploy/dist/types';


const func: DeployFunction = async function () {
  console.log("\n******************* Deploy MetaverseMarket *******************");
  const [deployer, user] = await ethers.getSigners();
  const nftCore: NFTCore = await ethers.getContract("NFTCore");
  const myToken: MyToken = await ethers.getContract("MyToken");

  const market = await deployments.deploy("MetaverseMarket", {
    from: deployer.address,
    args: [],
    log: true,
    autoMine: true,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [await myToken.getAddress()],
        },
      },
    }
  })

  // approve market to trade NFT
  const approveTxn = await nftCore.connect(deployer).setApprovalForAll(market.address, true);
  console.log("Approve market trading for market at txn: " + approveTxn.hash);

  try {
    await hre.run("verify:verify", {
      address: (await ethers.getContract("MetaverseMarket")).getAddress(),
      constructorArguments: [],
    });
  } catch (e) {
    console.error("Can not verify contract for network:", hre.network.name);
  }
}

export default func;
func.tags = ["MetaverseMarket"]