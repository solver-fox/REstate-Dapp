// //SPDX-License-Identifier:MIT
pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract HemProp is Ownable, ERC721, ReentrancyGuard {
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
    string image;
    string category;
    string description;
    string location;
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

  uint256 private servicePct;

  function createProperty(
    string memory name,
    string memory image,
    string memory category,
    string memory description,
    string memory location,
    uint256 price
  ) public {
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(bytes(image).length > 0, 'Image cannot be empty');
    require(bytes(category).length > 0, 'Category cannot be empty');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(price > 0, 'Price must be greater than zero');

    _totalProperties.increment();
    PropertyStruct memory property;

    property.id = _totalProperties.current();
    property.owner = msg.sender;
    property.name = name;
    property.image = image;
    property.category = category;
    property.description = description;
    property.location = location;
    property.price = price;

    properties[property.id] = property;
    propertyExist[property.id] = true;
  }

  function updateProperty(
    uint256 id,
    string memory name,
    string memory image,
    string memory category,
    string memory description,
    string memory location,
    uint256 price
  ) public {
    require(propertyExist[id], 'Property does not exist');
    require(msg.sender == properties[id].owner, 'Only the property owner can edit this event');
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(bytes(image).length > 0, 'Image cannot be empty');
    require(bytes(category).length > 0, 'Category cannot be empty');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(price > 0, 'Price must be greater than zero');

    properties[id].name = name;
    properties[id].category = category;
    properties[id].image = image;
    properties[id].description = description;
    properties[id].location = location;
    properties[id].price = price;
  }

  function deleteProperty(uint256 id) public {
    require(propertyExist[id], 'Property does not exisit');
    require(
      msg.sender == properties[id].owner || msg.sender == owner(),
      'Only property owner can delete property'
    );

    properties[id].deleted = true;
  }

  function getProperty(uint256 id) public view returns (PropertyStruct memory) {
    require(propertyExist[id], 'Property does not exist');
    require(!properties[id].deleted, 'Propery has been deleted');

    return properties[id];
  }

  function getAllProperties() public view returns (PropertyStruct[] memory Properties) {
    uint256 availableProperties;
    for (uint256 i = 1; i <= _totalProperties.current(); i++) {
      if (!properties[i].deleted) {
        availableProperties++;
      }
    }

    Properties = new PropertyStruct[](availableProperties);
    uint256 index;
    for (uint256 i = 1; i <= _totalProperties.current(); i++) {
      if (!properties[i].deleted) {
        Properties[index++] = properties[i];
      }
    }
  }

  function getMyProperty() public view returns (PropertyStruct[] memory Properties) {
    uint256 availableProperties;
    for (uint256 i = 1; i <= _totalProperties.current(); i++) {
      if (!properties[i].deleted && properties[i].owner == msg.sender) {
        availableProperties++;
      }
    }

    Properties = new PropertyStruct[](availableProperties);
    uint256 index;

    for (uint i = 1; i < _totalProperties.current(); i++) {
      if (!properties[i].deleted && properties[i].owner == msg.sender) {
        Properties[index++] = properties[i];
      }
    }
  }

  function buyProperty(uint256 id) public payable {
    require(propertyExist[id], 'Property does not exisit');
    require(msg.value > 0, 'price must be greater than Zero');
    require(!properties[id].deleted, 'Property has been deleted');
    require(!properties[id].sold, 'Property has been sold');

    _totalSales.increment();
    SaleStruct memory sale;

    sale.id = _totalSales.current();
    sale.propertyId = id;
    sale.owner = msg.sender;
    sales[id].push(sale);

    uint256 fee = (msg.value * servicePct) / 100;
    uint256 payment = (msg.value - fee);

    payTo(properties[id].owner, payment);
    payTo(0xcF34f424bBFA9105288268504981f9fF6A088C8b, fee);
    // payTo(owner(), fee);

    properties[id].sold = true;
  }

  function payTo(address to, uint256 price) internal {
    (bool success, ) = payable(to).call{ value: price }('');
    require(success);
  }

  function createReview(uint256 id, string memory comment) public {
    require(propertyExist[id], 'Property does not exist');
    require(!properties[id].deleted, 'Property has been deleted');
    require(bytes(comment).length > 0, 'Review must not be empty');

    _totalReviews.increment();
    ReviewStruct memory review;

    review.id = _totalReviews.current();
    review.propertyId = id;
    review.reviewer = msg.sender;
    review.comment = comment;

    reviews[id].push(review);
    reviewExist[review.id] = true;
  }

  function updateReview(uint256 id, string memory comment) public {
    require(reviewExist[id], 'Review does not exist');
    require(msg.sender == reviews[id][0].reviewer, 'Only the reviwer can edit review');
    require(bytes(comment).length > 0, 'Comment can not be empty');

    reviews[id][0].comment = comment;
  }

  function deleteReview(uint256 id) public {
    require(reviewExist[id], 'Review does not exist');
    require(msg.sender == reviews[id][0].reviewer, 'Only the reviewer can delete review');

    delete reviews[id];
    reviewExist[id] = false;
  }

  function getReviews(uint256 id) public view returns (ReviewStruct[] memory) {
    return reviews[id];
  }

  function getSales(uint256 id) public view returns (SaleStruct[] memory Sales) {
    return sales[id];
  }
}
