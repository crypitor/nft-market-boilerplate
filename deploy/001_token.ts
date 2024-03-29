import hre, { deployments, ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/dist/types';

const func: DeployFunction = async function () {
	console.log('\n******************* Deploy Mock MyToken *******************');
	const [deployer] = await hre.ethers.getSigners();

	await deployments.deploy('MyToken', {
		from: deployer.address,
		args: ['MyToken', 'MTK'],
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	});

	try {
		await hre.run("verify:verify", {
			address: (await ethers.getContract("MyToken")).getAddress(),
			constructorArguments: [],
		});
	} catch (e) {
		console.error("Can not verify contract for network:", hre.network.name);
	}
};

export default func;
func.tags = ['MyToken'];