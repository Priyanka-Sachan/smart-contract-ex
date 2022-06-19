// Unit tests on development chains
const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
    let fundMe, deployer, mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1"); //1e18

    beforeEach(async function () {
      // Deploy our fundMe contract using hardhat-deploy
      // This allows us to deploy all scripts of the tag
      // const accounts = await ethers.getSigners();
      deployer = (await getNamedAccounts()).deployer;
      await deployments.fixture(["all"]);
      // Get the most recently deployed contract
      // & connect to deployer, so every call to contract is from deployer account
      mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
      fundMe = await ethers.getContract("FundMe", deployer);
    });

    describe("Constructor", function () {
      it("Set the aggregator address correctly", async function () {
        const response = await fundMe.getPriceFeed();
        assert.equal(response, mockV3Aggregator.address);
      });
    });

    describe("Fund", function () {
      it("Fails if you don't send enough eth", async function () {
        await expect(fundMe.fund()).to.be.reverted;
      });

      it("Updates the amount  funded data structure", async function () {
        await fundMe.fund({ value: sendValue });
        const response = await fundMe.getFundMapping(deployer);
        assert.equal(response.toString(), sendValue);
      });

      it("Adds funder to array of funders", async function () {
        await fundMe.fund({ value: sendValue });
        const response = await fundMe.getFunder(0);
        assert.equal(response, deployer);
      });
    });

    describe("Withdraw", function () {
      beforeEach(async function () {
        await fundMe.fund({ value: sendValue });
      });

      it("Withdraw ETH from a single funder", async function () {
        // Arrange
        const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

        // Act
        const transactionResponse = await fundMe.withdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        // Gas Cost
        const { gasUsed, effectiveGasPrice } = transactionReceipt;
        const gasCost = gasUsed.mul(effectiveGasPrice);
        const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

        // Assert
        assert.equal(endingFundMeBalance, 0);
        assert.equal(endingDeployerBalance.add(gasCost).toString(), startingDeployerBalance.add(startingFundMeBalance).toString());
      })

      it("Withdraw ETH from multiple funders", async function () {
        // Arrange
        const accounts = await ethers.getSigners();
        for (let i = 1; i < 6; i++) {
          // Connect to different accounts to fund 
          const fundMeConnectedContract = await fundMe.connect(accounts[i]);
          await fundMeConnectedContract.fund({ value: sendValue });
        }
        const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

        // Act
        const transactionResponse = await fundMe.withdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        // Gas Cost
        const { gasUsed, effectiveGasPrice } = transactionReceipt;
        const gasCost = gasUsed.mul(effectiveGasPrice);
        const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

        // Assert
        assert.equal(endingFundMeBalance, 0);
        assert.equal(endingDeployerBalance.add(gasCost).toString(), startingDeployerBalance.add(startingFundMeBalance).toString());

        // Make sure funders anfd mapping reverted properly
        await expect(fundMe.getFunder(0)).to.be.reverted;

        // Watchout account.address
        for (let i = 1; i < 6; i++) {
          assert.equal(await fundMe.getFundMapping(accounts[i].address), 0);
        }
      });

      it("Cheaper Withdraw ETH from multiple funders", async function () {
        // Arrange
        const accounts = await ethers.getSigners();
        for (let i = 1; i < 6; i++) {
          // Connect to different accounts to fund 
          const fundMeConnectedContract = await fundMe.connect(accounts[i]);
          await fundMeConnectedContract.fund({ value: sendValue });
        }
        const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

        // Act
        const transactionResponse = await fundMe.cheaperWithdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        // Gas Cost
        const { gasUsed, effectiveGasPrice } = transactionReceipt;
        const gasCost = gasUsed.mul(effectiveGasPrice);
        const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

        // Assert
        assert.equal(endingFundMeBalance, 0);
        assert.equal(endingDeployerBalance.add(gasCost).toString(), startingDeployerBalance.add(startingFundMeBalance).toString());

        // Make sure funders anfd mapping reverted properly
        await expect(fundMe.getFunder(0)).to.be.reverted;

        // Watchout account.address
        for (let i = 1; i < 6; i++) {
          assert.equal(await fundMe.getFundMapping(accounts[i].address), 0);
        }
      });

      it("Only allows owner to withdraw", async function () {
        const accounts = await ethers.getSigners();
        const attacker = accounts[1];
        const attackerConnectedContract = await fundMe.connect(attacker);
        await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner");
      });

    });

  });