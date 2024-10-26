// test/HemProp.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HemProp Contract", function () {
  let HemProp;
  let hemProp;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    HemProp = await ethers.getContractFactory("HemProp");
    [owner, addr1, addr2] = await ethers.getSigners();
    hemProp = await HemProp.deploy(5); // Example service percentage
    await hemProp.deployed();
  });

  describe("Property Management", function () {
    it("Should create a property", async function () {
      const images = ["image1.png", "image2.png"];
      await hemProp.createProperty("My Property", images, "House", "Nice house", "123 Main St", "City", "State", "Country", 12345, 3, 2, 2000, 1500, ethers.utils.parseEther("1"));
      
      const property = await hemProp.getProperty(1);
      expect(property.name).to.equal("My Property");
      expect(property.owner).to.equal(owner.address);
    });

    it("Should update a property", async function () {
      const images = ["image1.png", "image2.png"];
      await hemProp.createProperty("My Property", images, "House", "Nice house", "123 Main St", "City", "State", "Country", 12345, 3, 2, 2000, 1500, ethers.utils.parseEther("1"));
      
      const newImages = ["image3.png"];
      await hemProp.updateProperty(1, "Updated Property", newImages, "House", "Updated description", "456 Main St", "New City", "New State", "New Country", 54321, 4, 3, 2010, 2000, ethers.utils.parseEther("1.5"));
      
      const updatedProperty = await hemProp.getProperty(1);
      expect(updatedProperty.name).to.equal("Updated Property");
      expect(updatedProperty.images[0]).to.equal("image3.png");
    });

    it("Should delete a property", async function () {
      const images = ["image1.png", "image2.png"];
      await hemProp.createProperty("My Property", images, "House", "Nice house", "123 Main St", "City", "State", "Country", 12345, 3, 2, 2000, 1500, ethers.utils.parseEther("1"));
      
      await hemProp.deleteProperty(1);
      await expect(hemProp.getProperty(1)).to.be.revertedWith("Property does not exist");
    });

    it("Should buy a property", async function () {
      const images = ["image1.png", "image2.png"];
      await hemProp.createProperty("My Property", images, "House", "Nice house", "123 Main St", "City", "State", "Country", 12345, 3, 2, 2000, 1500, ethers.utils.parseEther("1"));
      
      await hemProp.connect(addr1).buyProperty(1, { value: ethers.utils.parseEther("1") });
      const property = await hemProp.getProperty(1);
      expect(property.owner).to.equal(addr1.address);
    });
  });
});

