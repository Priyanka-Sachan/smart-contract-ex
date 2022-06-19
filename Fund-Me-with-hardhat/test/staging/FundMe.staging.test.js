// For testing in test networks
// In staging, we assume we have already deployed the contract

const { assert, expect } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
    let fundMe, deployer;
    const sendValue = ethers.utils.parseEther("0.06"); //1e18

    beforeEach(async function () {
      deployer = (await getNamedAccounts()).deployer;
      fundMe = await ethers.getContract("FundMe", deployer);
    });

    it("Allows people to fund and withdraw", async function () {
      await fundMe.fund({ value: sendValue });
      await fundMe.withdraw();
      const endingBalance = await fundMe.provider.getBalance(fundMe.address);
      assert.equal(endingBalance.toString(), "0");
    });

  });
