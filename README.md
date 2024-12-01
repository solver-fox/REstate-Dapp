# SlvfxProp - Decentralized Real Estate Marketplace

SlvfxProp is a decentralized application (dApp) built on the Ethereum blockchain that facilitates the buying, selling, and reviewing of real estate properties. This smart contract, written in Solidity, powers the core functionality of the SlvfxProp platform.

## Features

- Create and manage property listings
- Buy and sell properties using cryptocurrency
- Leave and manage reviews for properties
- ERC721 compliant (Non-Fungible Tokens for properties)
- Owner controls and service fee implementation

## Smart Contract Overview

The `SlvfxProp` contract inherits from OpenZeppelin's `ERC721`, `Ownable`, and `ReentrancyGuard` contracts, providing standard NFT functionality, ownership controls, and protection against reentrancy attacks.

### Key Structures

- `PropertyStruct`: Represents a real estate property
- `ReviewStruct`: Represents a review for a property
- `SaleStruct`: Represents a property sale transaction

### Main Functions

1. `createProperty`: List a new property for sale
2. `updateProperty`: Modify an existing property listing
3. `deleteProperty`: Remove a property listing
4. `buyProperty`: Purchase a listed property
5. `createReview`: Leave a review for a property
6. `updateReview`: Modify an existing review
7. `deleteReview`: Remove a review

### View Functions

- `getProperty`: Retrieve details of a specific property
- `getAllProperties`: Get a list of all available properties
- `getMyProperty`: Get a list of properties owned by the caller

## Getting Started

To interact with the SlvfxProp contract, you'll need:

1. An Ethereum wallet (e.g., MetaMask)
2. Some ETH for gas fees and property purchases
3. A connection to an Ethereum network (mainnet or testnet)

## Development

This project uses Solidity version >=0.8.0 <0.9.0. To set up the development environment:

1. Install [Hardhat](https://hardhat.org/)
2. Clone this repository
3. Install dependencies: `npm install`
4. Compile the contract: `truffle compile` or `npx hardhat compile`
5. Deploy to a local blockchain or testnet

## Security

The contract includes several security measures:

- ReentrancyGuard for `buyProperty` function
- Access control checks for property and review management
- Input validation for all user-provided data


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This smart contract is provided as-is. Users should conduct their own research and security audits before using it in a production environment.
