// If no price feed network available on the chain, deploy a mock/minimal version price feed contract on the network

const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {

  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const networkName = network.name;

  // Decimal, Initial Price feed ETH/USD
  const args = [8, 100000000000];

  if (developmentChains.includes(networkName)) {
    log("Development network detected. Deploying mock price feed...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: args,
    });
    log("Mock deployed.");
    log("---------------------------------");
  }
}

// Used to filter deploy scripts by tag eg. npx hardhat deploy --tags <all>
module.exports.tags = ["all", "mocks"];
