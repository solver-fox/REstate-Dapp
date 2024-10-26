// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract HemProp is Ownable, ERC721, ReentrancyGuard {
  event PropertyCreated(uint256 indexed id, address indexed owner, uint256 price);
  event PropertyUpdated(uint256 indexed id);
  event PropertyDeleted(uint256 indexed id);
  event PropertySold(
    uint256 indexed id,
    address indexed oldOwner,
    address indexed newOwner,
    uint256 price
  );
  event ReviewCreated(uint256 indexed propertyId, uint256 indexed reviewId);
  event ReviewUpdated(uint256 indexed propertyId, uint256 indexed reviewId);
  event ReviewDeleted(uint256 indexed propertyId, uint256 indexed reviewId);

  constructor(uint256 _pct) ERC721('HemProperty', 'Hpt') {
    servicePct = _pct;
  }

  using Counters for Counters.Counter;
  Counters.Counter private _totalProperties;
  Counters.Counter private _totalSales;
  Counters.Counter private _totalReviews;

  struct PropertyStruct {
    uint256 id;
    address owner;
    string name;
    string[] images;
    string category;
    string description;
    string location;
    string city;
    string state;
    string country;
    uint256 zipCode;
    uint256 bedroom;
    uint256 bathroom;
    uint256 built;
    uint256 squarefit;
    uint256 price;
    bool sold;
    bool deleted;
  }

  struct ReviewStruct {
    uint256 id;
    uint256 propertyId;
    string comment;
    address reviewer;
    bool deleted;
    uint256 timestamp;
  }

  struct SaleStruct {
    uint256 id;
    uint256 propertyId;
    address owner;
  }

  mapping(uint256 => PropertyStruct) properties;
  mapping(uint256 => ReviewStruct[]) reviews;
  mapping(uint256 => SaleStruct[]) sales;
  mapping(uint256 => bool) propertyExist;
  mapping(uint256 => bool) reviewExist;
  mapping(uint256 => mapping(uint256 => uint256)) private reviewIndexInProperty;

  uint256 private servicePct;

  // Property Management Functions
  function createProperty(
    string memory name,
    string[] memory images,
    string memory category,
    string memory description,
    string memory location,
    string memory city,
    string memory state,
    string memory country,
    uint256 zipCode,
    uint256 bedroom,
    uint256 bathroom,
    uint256 built,
    uint256 squarefit,
    uint256 price
  ) public {
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(images.length > 0, 'At least one image is required');
    require(images.length <= 10, 'Maximum 10 images allowed');
    require(bytes(category).length > 0, 'Category cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(city).length > 0, 'City cannot be empty');
    require(bytes(state).length > 0, 'State cannot be empty');
    require(bytes(country).length > 0, 'Country cannot be empty');
    require(zipCode > 0, 'Zip Code cannot be empty');
    require(bedroom > 0, 'Bedroom cannot be zero or empty');
    require(bathroom > 0, 'Bathroom cannot be zero or empty');
    require(built > 0, 'Year built cannot be zero or empty');
    require(squarefit > 0, 'House size cannot be zero or empty');
    require(price > 0, 'Price must be greater than zero');

    // Validate each image URL
    for (uint i = 0; i < images.length; i++) {
      require(bytes(images[i]).length > 0, 'Image URL cannot be empty');
    }

    _totalProperties.increment();
    PropertyStruct memory property;

    property.id = _totalProperties.current();
    property.owner = msg.sender;
    property.name = name;
    property.images = images;
    property.category = category;
    property.description = description;
    property.location = location;
    property.city = city;
    property.state = state;
    property.country = country;
    property.zipCode = zipCode;
    property.bedroom = bedroom;
    property.bathroom = bathroom;
    property.built = built;
    property.squarefit = squarefit;
    property.price = price;

    uint256 newPropertyId = _totalProperties.current();
    _safeMint(msg.sender, newPropertyId);

    properties[property.id] = property;
    propertyExist[property.id] = true;

    emit PropertyCreated(property.id, property.owner, property.price);
  }

  function updateProperty(
    uint256 id,
    string memory name,
    string[] memory images,
    string memory category,
    string memory description,
    string memory location,
    string memory city,
    string memory state,
    string memory country,
    uint256 zipCode,
    uint256 bedroom,
    uint256 bathroom,
    uint256 built,
    uint256 squarefit,
    uint256 price
  ) public {
    require(propertyExist[id], 'Property does not exist');
    require(msg.sender == properties[id].owner, 'Only the property owner can edit this property');
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(images.length > 0, 'At least one image is required');
    require(images.length <= 10, 'Maximum 10 images allowed');
    require(bytes(category).length > 0, 'Category cannot be empty');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(city).length > 0, 'City cannot be empty');
    require(bytes(state).length > 0, 'State cannot be empty');
    require(bytes(country).length > 0, 'Country cannot be empty');
    require(zipCode > 0, 'Zip Code cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bedroom > 0, 'Bedroom cannot be zero or empty');
    require(bathroom > 0, 'Bathroom cannot be zero or empty');
    require(built > 0, 'Year built cannot be zero or empty');
    require(squarefit > 0, 'House size cannot be zero or empty');
    require(price > 0, 'Price must be greater than zero');

    // Validate each image URL
    for (uint i = 0; i < images.length; i++) {
      require(bytes(images[i]).length > 0, 'Image URL cannot be empty');
    }

    properties[id].name = name;
    properties[id].images = images;
    properties[id].category = category;
    properties[id].description = description;
    properties[id].location = location;
    properties[id].city = city;
    properties[id].state = state;
    properties[id].country = country;
    properties[id].zipCode = zipCode;
    properties[id].bedroom = bedroom;
    properties[id].bathroom = bathroom;
    properties[id].built = built;
    properties[id].squarefit = squarefit;
    properties[id].price = price;

    emit PropertyUpdated(id);
  }

  function deleteProperty(uint256 id) public {
    require(propertyExist[id], 'Property does not exist');
    require(
      msg.sender == properties[id].owner || msg.sender == owner(),
      'Only property owner can delete property'
    );

    properties[id].deleted = true;

    emit PropertyDeleted(id);
  }

  // Property View Functions
  function getProperty(uint256 id) public view returns (PropertyStruct memory) {
    require(propertyExist[id], 'Property does not exist');
    require(!properties[id].deleted, 'Property has been deleted');

    return properties[id];
  }

  function getAllProperties() public view returns (PropertyStruct[] memory myProperties) {
    uint256 availableProperties;
    for (uint256 i = 1; i <= _totalProperties.current(); i++) {
      if (!properties[i].deleted) {
        availableProperties++;
      }
    }

    myProperties = new PropertyStruct[](availableProperties);
    uint256 index;
    for (uint256 i = 1; i <= _totalProperties.current(); i++) {
      if (!properties[i].deleted) {
        myProperties[index++] = properties[i];
      }
    }
  }

  function getMyProperties() public view returns (PropertyStruct[] memory myProperties) {
    uint256 availableProperties;
    for (uint256 i = 1; i <= _totalProperties.current(); i++) {
      if (!properties[i].deleted && properties[i].owner == msg.sender) {
        availableProperties++;
      }
    }

    myProperties = new PropertyStruct[](availableProperties);
    uint256 index;

    for (uint256 i = 1; i <= _totalProperties.current(); i++) {
      if (!properties[i].deleted && properties[i].owner == msg.sender) {
        myProperties[index++] = properties[i];
      }
    }
  }

  // Property Purchase Function
  function buyProperty(uint256 id) public payable nonReentrant {
    require(propertyExist[id], 'Property does not exist');
    require(msg.value >= properties[id].price, 'Insufficient payment');
    require(!properties[id].deleted, 'Property has been deleted');
    require(!properties[id].sold, 'Property has been sold');

    _totalSales.increment();
    SaleStruct memory sale;

    sale.id = _totalSales.current();
    sale.propertyId = id;
    sale.owner = msg.sender;
    sales[id].push(sale);

    uint256 fee = (msg.value * servicePct) / 100;
    uint256 payment = msg.value - fee;

    payTo(properties[id].owner, payment);
    payTo(owner(), fee);

    address oldOwner = properties[id].owner;

    properties[id].sold = true;
    properties[id].owner = msg.sender;
    _transfer(oldOwner, msg.sender, id);

    emit PropertySold(id, oldOwner, msg.sender, properties[id].price);
  }

  function payTo(address to, uint256 price) internal {
    (bool success, ) = payable(to).call{ value: price }('');
    require(success);
  }

  // Review Management Functions
  function createReview(uint256 propertyId, string memory comment) public {
    require(propertyExist[propertyId], 'Property does not exist');
    require(!properties[propertyId].deleted, 'Property has been deleted');
    require(bytes(comment).length > 0, 'Review must not be empty');
    require(bytes(comment).length <= 1000, 'Review is too long');

    _totalReviews.increment();
    ReviewStruct memory review;
    uint256 reviewId = _totalReviews.current();

    review.id = reviewId;
    review.propertyId = propertyId;
    review.reviewer = msg.sender;
    review.comment = comment;
    review.deleted = false;
    review.timestamp = block.timestamp;

    reviewIndexInProperty[propertyId][reviewId] = reviews[propertyId].length;
    reviews[propertyId].push(review);
    reviewExist[reviewId] = true;

    emit ReviewCreated(propertyId, reviewId);
  }

  function updateReview(uint256 propertyId, uint256 reviewId, string memory comment) public {
    require(propertyExist[propertyId], 'Property does not exist');
    require(!properties[propertyId].deleted, 'Property has been deleted');
    require(reviewExist[reviewId], 'Review does not exist');
    require(bytes(comment).length > 0, 'Review must not be empty');
    require(bytes(comment).length <= 1000, 'Review is too long');

    uint256 reviewIndex = reviewIndexInProperty[propertyId][reviewId];
    require(reviewIndex < reviews[propertyId].length, 'Review not found for this property');
    require(reviews[propertyId][reviewIndex].reviewer == msg.sender, 'Only reviewer can update');
    require(!reviews[propertyId][reviewIndex].deleted, 'Review has been deleted');

    reviews[propertyId][reviewIndex].comment = comment;
    reviews[propertyId][reviewIndex].timestamp = block.timestamp;

    emit ReviewUpdated(propertyId, reviewId);
  }

  function deleteReview(uint256 propertyId, uint256 reviewId) public {
    require(propertyExist[propertyId], 'Property does not exist');
    require(reviewExist[reviewId], 'Review does not exist');

    uint256 reviewIndex = reviewIndexInProperty[propertyId][reviewId];
    require(reviewIndex < reviews[propertyId].length, 'Review not found for this property');
    require(
      reviews[propertyId][reviewIndex].reviewer == msg.sender || msg.sender == owner(),
      'Only reviewer or contract owner can delete'
    );
    require(!reviews[propertyId][reviewIndex].deleted, 'Review already deleted');

    reviews[propertyId][reviewIndex].deleted = true;

    emit ReviewDeleted(propertyId, reviewId);
  }

  // Review View Functions
  function getReviews(uint256 propertyId) public view returns (ReviewStruct[] memory) {
    require(propertyExist[propertyId], 'Property does not exist');

    uint256 activeCount = 0;
    for (uint256 i = 0; i < reviews[propertyId].length; i++) {
      if (!reviews[propertyId][i].deleted) {
        activeCount++;
      }
    }

    ReviewStruct[] memory activeReviews = new ReviewStruct[](activeCount);
    uint256 index = 0;

    for (uint256 i = 0; i < reviews[propertyId].length; i++) {
      if (!reviews[propertyId][i].deleted) {
        activeReviews[index] = reviews[propertyId][i];
        index++;
      }
    }

    return activeReviews;
  }

  function getMyReviews(uint256 propertyId) public view returns (ReviewStruct[] memory) {
    require(propertyExist[propertyId], 'Property does not exist');

    uint256 myReviewCount = 0;
    for (uint256 i = 0; i < reviews[propertyId].length; i++) {
      if (reviews[propertyId][i].reviewer == msg.sender && !reviews[propertyId][i].deleted) {
        myReviewCount++;
      }
    }

    ReviewStruct[] memory myReviews = new ReviewStruct[](myReviewCount);
    uint256 index = 0;

    for (uint256 i = 0; i < reviews[propertyId].length; i++) {
      if (reviews[propertyId][i].reviewer == msg.sender && !reviews[propertyId][i].deleted) {
        myReviews[index] = reviews[propertyId][i];
        index++;
      }
    }
    return myReviews;
  }

  function getReview(
    uint256 propertyId,
    uint256 reviewId
  ) public view returns (ReviewStruct memory) {
    require(propertyExist[propertyId], 'Property does not exist');
    require(reviewExist[reviewId], 'Review does not exist');

    uint256 reviewIndex = reviewIndexInProperty[propertyId][reviewId];
    require(reviewIndex < reviews[propertyId].length, 'Review not found for this property');
    require(!reviews[propertyId][reviewIndex].deleted, 'Review has been deleted');

    return reviews[propertyId][reviewIndex];
  }
}
