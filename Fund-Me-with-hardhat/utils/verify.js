const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
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

module.exports = { verify };