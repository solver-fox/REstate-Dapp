import { ethers } from 'ethers'
import address from '../contracts/contractAddress.json'
import abi from '../artifacts/contracts/SlvfxProp.sol/SlvfxProp.json'
import { PropertyParams, PropertyStruct, ReviewParams, ReviewStruct } from '../utils/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: string | number | null): string => {
  if (num === null || num === undefined) {
    return '0'
  }
  return ethers.formatEther(num.toString())
}

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum

const getEthereumContract = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.SlvfxProp, abi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const contracts = new ethers.Contract(address.SlvfxProp, abi.abi, provider)

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
      property.images,
      property.category,
      property.description,
      property.location,
      property.city,
      property.state,
      property.country,
      property.zipCode,
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
      property.images,
      property.category,
      property.description,
      property.location,
      property.city,
      property.state,
      property.country,
      property.zipCode,
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

const createReview = async (review: ReviewParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.createReview(review.propertyId, review.comment)
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const updateReview = async (review: ReviewParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.updateReview(review.propertyId, review.id, review.comment)

    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const deleteReview = async (reviewId: number, propertyId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.deleteReview(propertyId, reviewId)
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
    tx = await contract.buyProperty(property.id, { value: toWei(property.price) })
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const getProperty = async (id: number): Promise<PropertyStruct> => {
  if (!id || isNaN(id)) {
    console.error('Invalid property ID:', id)
    return Promise.reject(new Error('Invalid property ID'))
  }

  try {
    const contract = await getEthereumContract()
    console.log('Attempting to fetch property:', id)
    const property = await contract.getProperty(id)

    if (!property || !property.owner) {
      console.error('Property not found or invalid data')
      return Promise.reject(new Error('Property not found'))
    }

    const structuredProperty = propertyStructure([property])[0]
    console.log('Successfully structured property:', structuredProperty)
    return structuredProperty
  } catch (error) {
    console.error('Error in getProperty:', error)
    reportError(error)
    return Promise.reject(error)
  }
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

const getAllReviews = async (propertyId: number): Promise<ReviewStruct[]> => {
  const contract = await getEthereumContract()
  const reviews = await contract.getReviews(propertyId)
  return reviewStructure(reviews)
}

const getMyReviews = async (propertyId: number): Promise<ReviewStruct[]> => {
  const contract = await getEthereumContract()
  const reviews = await contract.getMyReviews(propertyId)
  return reviewStructure(reviews)
}

const getReview = async (propertyId: number, reviewId: number): Promise<ReviewStruct> => {
  const contract = await getEthereumContract()
  const review = await contract.getReview(propertyId, reviewId)
  return reviewStructure([review])[0]
}

const reviewStructure = (reviews: ReviewStruct[]): ReviewStruct[] =>
  reviews.map((review) => ({
    id: Number(review.id),
    propertyId: Number(review.propertyId),
    comment: review.comment,
    reviewer: review.reviewer,
    deleted: review.deleted,
    timestamp: Number(review.timestamp),
  }))

const propertyStructure = (properties: PropertyStruct[]): PropertyStruct[] =>
  properties.map((property) => ({
    id: Number(property.id),
    owner: property.owner,
    name: property.name,
    images: property.images,
    category: property.category,
    description: property.description,
    location: property.location,
    city: property.city,
    state: property.state,
    country: property.country,
    zipCode: property.zipCode,
    bedroom: Number(property.bedroom),
    bathroom: Number(property.bathroom),
    built: Number(property.built),
    squarefit: Number(property.squarefit),
    price: parseFloat(fromWei(property.price)),
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
  updateReview,
  deleteReview,
  getAllReviews,
  getMyReviews,
  getReview,
}
