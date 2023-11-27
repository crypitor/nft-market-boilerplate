import hre, { deployments, ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/dist/types';


const func: DeployFunction = async function () {
  console.log('\n******************* Deploy NFTCore *******************');
  const [deployer] = await hre.ethers.getSigners();

  await deployments.deploy('NFTCore', {
    from: deployer.address,
    log: true,
    autoMine: true,
  });
  try {
    await hre.run("verify:verify", {
      address: (await ethers.getContract("NFTCore")).getAddress(),
      constructorArguments: [],
    });
  } catch (e) {
    console.error("Can not verify contract for network:", hre.network.name);
  }
}

export default func;
func.tags = ['NFTCore'];