import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import abi from '@/artifacts/contracts/HemProp.sol/HemProp.json'
import { PropertyParams, PropertyStruct, ReviewParam, ReviewStruct } from '@/utils/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: string | number | null): string => {
  if (num === null || num === undefined) {
    return '0'
  }
  return ethers.formatEther(num.toString())
}

let ethereum: any
let tx: any

if (typeof window != 'undefined') ethereum = (window as any).ethereum

const getEthereumContract = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.HemProp, abi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const contracts = new ethers.Contract(address.HemProp, abi.abi, provider)

    return contracts
  }
}

// Create Property
const createProperty = async (property: PropertyParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.createProperty(
      property.name,
      property.image,
      property.category,
      property.description,
      property.location,
      property.bedroom,
      property.bathroom,
      property.built,
      property.squarefit,
      toWei(Number(property.price))
    )
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const updateProperty = async (property: PropertyParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.updateProperty(
      property.id,
      property.name,
      property.image,
      property.category,
      property.description,
      property.location,
      property.bedroom,
      property.bathroom,
      property.built,
      property.squarefit,
      toWei(Number(property.price))
    )
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const deleteProperty = async (id: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.deleteProperty(id)
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const createReview = async (review: ReviewParam): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.createReview(review.comment, review.timestamp)
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const buyProperty = async (property: PropertyStruct): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.buyProperty(property.id)

    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const getProperty = async (id: number): Promise<PropertyStruct> => {
  const contract = await getEthereumContract()
  const property = await contract.getProperty(id)
  return propertyStructure([property])[0]
}

const getAllProperties = async (): Promise<PropertyStruct[]> => {
  const contract = await getEthereumContract()
  const properties = await contract.getAllProperties()
  return propertyStructure(properties)
}

const getMyProperties = async (): Promise<PropertyStruct[]> => {
  const contract = await getEthereumContract()
  const properties = await contract.getMyProperties()
  return propertyStructure(properties)
}

const propertyStructure = (properties: PropertyStruct[]): PropertyStruct[] =>
  properties.map((property) => ({
    id: Number(property.id),
    owner: property.owner,
    name: property.name,
    image: property.image,
    category: property.category,
    description: property.description,
    location: property.location,
    bedroom: Number(property.bedroom),
    bathroom: Number(property.bathroom),
    built: Number(property.built),
    squarefit: Number(property.squarefit),
    price: property.price,
    sold: property.sold,
    deleted: property.deleted,
  }))

export {
  createProperty,
  updateProperty,
  deleteProperty,
  buyProperty,
  getProperty,
  getAllProperties,
  getMyProperties,
  createReview,
}
