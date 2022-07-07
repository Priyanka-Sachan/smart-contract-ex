const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BasicNFT", function () {
    let basicNFT, deployer;

    beforeEach(async function () {
      deployer = (await getNamedAccounts()).deployer;
      await deployments.fixture(["basicNft"]);
      basicNFT = await ethers.getContract("BasicNFT", deployer);
    });

    describe("Constructor", function () {
      it("Set name, token and token counter correctly", async function () {
        const tokenCounter = await basicNFT.tokenCounter();
        assert.equal(tokenCounter.toString(), "0");
      });
    });

    describe("Mint NFT", function () {
      it("Updates token counter correctly", async function () {
        const tokenCounter = await basicNFT.tokenCounter();
        const txResponse = await basicNFT.mintNft()
        await txResponse.wait(1)
        const tokenURI = await basicNFT.tokenURI(0)
        const updatedTokenCounter = await basicNFT.tokenCounter()

        assert.equal(tokenURI, await basicNFT.TOKEN_URI())
        assert.equal(tokenCounter.add(1).toString(), updatedTokenCounter.toString());
      });
    });
  });