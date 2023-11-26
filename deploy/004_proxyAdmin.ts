import hre, { deployments, ethers } from 'hardhat';

export default async function () {
	console.log('\n******************* Deploy ProxyAdmin *******************');
	const [deployer] = await hre.ethers.getSigners();

	await deployments.deploy('ProxyAdmin', {
		from: deployer.address,
		log: true,
		autoMine: true,
	});

	try {
        await hre.run("verify:verify", {
            address: (await ethers.getContract("ProxyAdmin")).getAddress(),
            constructorArguments: [],
        });
    } catch(e) {
        console.error("Can not verify contract for network:", hre.network.name);
    }
};
// export default func;
// func.tags = ['MyToken'];