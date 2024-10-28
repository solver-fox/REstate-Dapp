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
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    HemProp = await ethers.getContractFactory("HemProp");
    hemProp = await HemProp.deploy(5); // 5% service fee
    await hemProp.waitForDeployment();
  });

  describe("Property Management", function () {
    it("Should create a property", async function () {
      const images = ["image1.png", "image2.png"];
      const price = ethers.parseEther("1.0");
      
      await hemProp.createProperty(
        "My Property",
        images,
        "House",
        "Nice house",
        "123 Main St",
        "City",
        "State",
        "Country",
        12345,
        3,
        2,
        2000,
        1500,
        price
      );
      
      const property = await hemProp.getProperty(1);
      expect(property.name).to.equal("My Property");
      expect(property.owner).to.equal(owner.address);
    });

    it("Should update a property", async function () {
      const images = ["image1.png", "image2.png"];
      const price = ethers.parseEther("1.0");
      
      await hemProp.createProperty(
        "My Property",
        images,
        "House",
        "Nice house",
        "123 Main St",
        "City",
        "State",
        "Country",
        12345,
        3,
        2,
        2000,
        1500,
        price
      );
      
      const newImages = ["image3.png"];
      const newPrice = ethers.parseEther("1.5");
      
      await hemProp.updateProperty(
        1,
        "Updated Property",
        newImages,
        "House",
        "Updated description",
        "456 Main St",
        "New City",
        "New State",
        "New Country",
        54321,
        4,
        3,
        2010,
        2000,
        newPrice
      );
      
      const property = await hemProp.getProperty(1);
      expect(property.name).to.equal("Updated Property");
      expect(property.images[0]).to.equal("image3.png");
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

    it("Should fail to create property with invalid parameters", async function () {
      const price = ethers.parseEther("1.0");
      
      await expect(
        hemProp.createProperty(
          "", // empty name
          ["image1.png"],
          "House",
          "Description",
          "123 Main St",
          "City",
          "State",
          "Country",
          12345,
          3,
          2,
          2000,
          1500,
          price
        )
      ).to.be.revertedWith("Name cannot be empty");

      await expect(
        hemProp.createProperty(
          "My Property",
          [], // empty images array
          "House",
          "Description",
          "123 Main St",
          "City",
          "State",
          "Country",
          12345,
          3,
          2,
          2000,
          1500,
          price
        )
      ).to.be.revertedWith("At least one image is required");
    });

    it("Should fail to buy property with insufficient funds", async function () {
      const images = ["image1.png"];
      const price = ethers.parseEther("1.0");
      
      await hemProp.createProperty(
        "My Property",
        images,
        "House",
        "Nice house",
        "123 Main St",
        "City",
        "State",
        "Country",
        12345,
        3,
        2,
        2000,
        1500,
        price
      );

      await expect(
        hemProp.connect(addr1).buyProperty(1, {
          value: ethers.parseEther("0.5"), // Less than price
        })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Review Management", function () {
    beforeEach(async function () {
      const images = ["image1.png"];
      await hemProp.createProperty(
        "Test Property",
        images,
        "House",
        "Nice house",
        "123 Main St",
        "City",
        "State",
        "Country",
        12345,
        3,
        2,
        2000,
        1500,
        ethers.utils.parseEther("1")
      );
    });

    it("Should create a review", async function () {
      await hemProp.connect(addr1).createReview(1, "Great property!");
      const reviews = await hemProp.getReviews(1);
      expect(reviews.length).to.equal(1);
      expect(reviews[0].comment).to.equal("Great property!");
      expect(reviews[0].reviewer).to.equal(addr1.address);
    });

    it("Should update a review", async function () {
      await hemProp.connect(addr1).createReview(1, "Initial review");
      await hemProp.connect(addr1).updateReview(1, 1, "Updated review");
      const review = await hemProp.getReview(1, 1);
      expect(review.comment).to.equal("Updated review");
    });

    it("Should delete a review", async function () {
      await hemProp.connect(addr1).createReview(1, "Test review");
      await hemProp.connect(addr1).deleteReview(1, 1);
      const reviews = await hemProp.getReviews(1);
      expect(reviews.length).to.equal(0);
    });

    it("Should fail to update someone else's review", async function () {
      await hemProp.connect(addr1).createReview(1, "Original review");
      await expect(
        hemProp.connect(addr2).updateReview(1, 1, "Malicious update")
      ).to.be.revertedWith("Only reviewer can update");
    });

    it("Should get my reviews", async function () {
      await hemProp.connect(addr1).createReview(1, "Review 1");
      await hemProp.connect(addr2).createReview(1, "Review 2");
      await hemProp.connect(addr1).createReview(1, "Review 3");

      const myReviews = await hemProp.connect(addr1).getMyReviews(1);
      expect(myReviews.length).to.equal(2);
      expect(myReviews[0].comment).to.equal("Review 1");
      expect(myReviews[1].comment).to.equal("Review 3");
    });
  });

  describe("Service Fee", function () {
    it("Should distribute service fee correctly on property purchase", async function () {
      const price = ethers.parseEther("1");
      const images = ["image1.png"];
      
      await hemProp.createProperty(
        "Fee Test Property",
        images,
        "House",
        "Nice house",
        "123 Main St",
        "City",
        "State",
        "Country",
        12345,
        3,
        2,
        2000,
        1500,
        price
      );

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      const initialSellerBalance = await ethers.provider.getBalance(owner.address);

      await hemProp.connect(addr1).buyProperty(1, { value: price });

      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      const finalSellerBalance = await ethers.provider.getBalance(owner.address);

      // Service fee should be 5% (as set in constructor)
      const expectedFee = price * BigInt(5) / BigInt(100);
      const expectedPayment = price - expectedFee;

      expect(finalOwnerBalance - initialOwnerBalance).to.equal(expectedFee);
      expect(finalSellerBalance - initialSellerBalance).to.equal(expectedPayment);
    });
  });
});
