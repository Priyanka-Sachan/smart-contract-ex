// Get chainId from https://chainlist.org/
const networkConfig = {
  4: {
    name: "Rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  1: {
    name: "mainnet",
    ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  }
}

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains
}