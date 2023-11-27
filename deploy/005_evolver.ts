import hre, { deployments, ethers } from 'hardhat';
import { MyToken, NFTCore, NFTEvolver } from '../typechain-types';
import { DeployFunction } from 'hardhat-deploy/dist/types';

const func: DeployFunction = async function () {
	console.log('\n******************* Deploy Evolver *******************');
	const [deployer] = await hre.ethers.getSigners();

	const nftCore: NFTCore = await ethers.getContract("NFTCore");
	const myToken: MyToken = await ethers.getContract("MyToken");

	await deployments.deploy("NFTEvolver", {
		from: deployer.address,
		args: [await nftCore.getAddress()],
		log: true,
		autoMine: true,
	});

	const evolver: NFTEvolver = await ethers.getContract("NFTEvolver");
	const tx = await nftCore.setExpScientist(await evolver.getAddress(), true);
	console.log("Evolver has been whitelisted at tx: " + tx.hash);

	try {
		await hre.run("verify:verify", {
			address: await evolver.getAddress(),
			constructorArguments: [await nftCore.getAddress()],
		});
	} catch (e) {
		console.error("Can not verify contract for network:", hre.network.name);
	}
};

export default func;
func.tags =	['NFTEvolver'];