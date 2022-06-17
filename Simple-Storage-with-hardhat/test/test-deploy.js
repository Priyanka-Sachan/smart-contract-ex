const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleStorage", function () {

  let simpleStorageFactory, simpleStorage;
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with all favourite number of 0", async function () {
    const currentValue = await simpleStorage.allFavouriteNumber();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
    // expect(currentValue.toString()).to.equal(expectedValue);
  });

  it("Should update all favourite number on call", async function () {
    const expectedValue = "7";
    const txResponse = await simpleStorage.setAllFavouriteNumber(expectedValue);
    await txResponse.wait(1);
    const currentValue = await simpleStorage.allFavouriteNumber();
    assert.equal(currentValue.toString(), expectedValue);
  });
});