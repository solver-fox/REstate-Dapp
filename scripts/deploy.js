require('dotenv').config()
const { ethers } = require('hardhat')

async function main() {
  console.log('Starting deployment process')
  try {
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contract with the account:', deployer.address)
    console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString())

    const SlvfxProp = await ethers.getContractFactory('SlvfxProp')
    console.log('Deploying Hemprop')
    const slvfxprop = await SlvfxProp.deploy(5)
    await slvfxprop.waitForDeployment()

    console.log('SlvfxProp deployed to:', await slvfxprop.getAddress())

    //Save the contract address to contract folder
    const fs = require('fs')
    const contractsDir = __dirname + '/../contracts'

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir)
    }

    fs.writeFileSync(
      contractsDir + '/contractAddress.json',
      JSON.stringify({ SlvfxProp: await slvfxprop.getAddress() }, undefined, 2)
    )
    console.log('Contract address saved to contractAddress.json')
  } catch (error) {
    console.log('Error in deployment process:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
