import hre, { deployments, ethers } from 'hardhat';
import { MyToken, NFTCore, NFTCreator } from '../typechain-types';
import { DeployFunction } from 'hardhat-deploy/dist/types';

const func: DeployFunction = async function () {
	console.log('\n******************* Deploy Creator *******************');
	const [deployer] = await hre.ethers.getSigners();

	const nftCore: NFTCore = await ethers.getContract("NFTCore");
	const myToken: MyToken = await ethers.getContract("MyToken");

	await deployments.deploy("NFTCreator", {
		from: deployer.address,
		args: [await nftCore.getAddress(), await myToken.getAddress()],
		log: true,
		autoMine: true,
	});

	const creator: NFTCreator = await ethers.getContract("NFTCreator");
	const tx = await nftCore.setSpawner(await creator.getAddress(), true);
	console.log("Spawner has been whitelisted at tx: " + tx.hash);

	try {
		await hre.run("verify:verify", {
			address: await creator.getAddress(),
			constructorArguments: [await nftCore.getAddress(), await myToken.getAddress()],
		});
	} catch (e) {
		console.error("Can not verify contract for network:", hre.network.name);
	}
};

export default func;
func.tags = ['NFTCreator'];