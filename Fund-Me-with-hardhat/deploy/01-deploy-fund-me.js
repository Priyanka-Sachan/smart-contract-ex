// Hardhat deploys helps to remembers our deployments for a contract.
// On deploying, it deploys all the scripts in numerical order.

const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {

  const { deploy, log, get } = deployments;

  // getNamedAccounts : all the accounts in hardhat.config.js (depolyers+users?) 
  // console.log(`GET NAMED ACCOUNTS: ${await getNamedAccounts()}`);
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  
  let ethUsdPriceFeedAddress;
  // Get ethUsdPriceFeedAddress according to network
  if (developmentChains.includes(network.name)) {
    // On development chains, get address of just deployed MockV3Aggregator contract
    const ethUsdAggregtor = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregtor.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];
  // Deploying contract
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,/*put pricefeed address*/
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log('FundMe deployed.');

  // Verify on non-development chains
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args);
  }
  log("---------------------------------");
}

module.exports.tags = ["all", "fundme"];

