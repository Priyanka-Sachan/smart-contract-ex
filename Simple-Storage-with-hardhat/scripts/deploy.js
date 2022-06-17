// Ethers like ethers.js
// Run allows us to run any command on hre
const { ethers, run, network } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  // We get the contract to deploy
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log("simpleStorage deployed to:", simpleStorage.address);

  // Verify contract if network if rinkeby and etherscan api key present
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    // Wait for few more block confirmations, here, 6
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const allFavouriteNumber = await simpleStorage.allFavouriteNumber();
  console.log(`AllFavouriteNumber: ${allFavouriteNumber.toString()}`);

  const txResponse = await simpleStorage.setAllFavouriteNumber("9");
  // Wait for 1 block confirmation
  const txReceipt = await txResponse.wait(1);
  const updatedAllFavouriteNumber = await simpleStorage.allFavouriteNumber();
  console.log(`UpdatedAllFavouriteNumber: ${updatedAllFavouriteNumber.toString()}`);

}

async function verify(contractAddress, args) {
  // To auto-verify contract on block explorers like etherscan
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
