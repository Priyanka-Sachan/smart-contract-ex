const { task } = require("hardhat/config");

task("block-number", "Prints the current block number")
  .setAction(async (taskArgs, hre) => {
    // HRE-Hardhat Runtime Environment : like require("hardhat") as hre
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);
  });

module.exports = {};