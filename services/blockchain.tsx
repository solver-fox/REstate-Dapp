import { ethers, id } from 'ethers'
import address from '@/contracts/contractAddress.json'
import abi from '@/artifacts/contracts/HemProp.sol/HemProp.json'
import { PropertyParams, PropertyStruct, ReviewParams, ReviewStruct } from '@/utils/type.dt'
import { toast } from 'react-toastify'

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

const checkWalletAvailability = (): string => {
  if (typeof window === 'undefined') return 'Browser environment required'
  if (!window.ethereum) return 'No wallet detected'
  if (window.ethereum.isTrustWallet) return 'trustwallet'
  return 'ethereum'
}

const getEthereumContract = async () => {
  try {
    const walletStatus = checkWalletAvailability()
    if (walletStatus !== 'ethereum' && walletStatus !== 'trustwallet') {
      throw new Error(walletStatus || 'No wallet detected')
    }

    const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

    if (accounts?.length > 0) {
      const provider = new ethers.BrowserProvider(ethereum)
      const signer = await provider.getSigner()
      return new ethers.Contract(address.HemProp, abi.abi, signer)
    } else {
      // For read-only operations
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
      return new ethers.Contract(address.HemProp, abi.abi, provider)
    }
  } catch (error) {
    console.error('Contract connection error:', error)
    throw error
  }
}

// Create Property
const createProperty = async (property: PropertyParams): Promise<void> => {
  try {
    // Check if we're on mobile and have a wallet
    if (typeof window !== 'undefined' && !window.ethereum) {
      throw new Error('Please install a mobile web3 wallet like MetaMask or Trust Wallet')
    }

    // Validate property data before submission
    if (!property.name || !property.images.length) {
      throw new Error('Please fill in all required fields')
    }

    const contract = await getEthereumContract()
    if (!contract) {
      throw new Error('Unable to connect to blockchain. Please check your wallet connection')
    }

    console.log('Creating property with data:', property) // Debug log

    const tx = await contract.createProperty(
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

    console.log('Transaction initiated:', tx) // Debug log

    const receipt = await tx.wait()
    console.log('Transaction completed:', receipt) // Debug log

    return Promise.resolve(tx)
  } catch (error: any) {
    // Provide more specific error messages
    let errorMessage = 'Failed to create property'

    if (error.message.includes('user rejected')) {
      errorMessage = 'Transaction was rejected in wallet'
    } else if (error.message.includes('insufficient funds')) {
      errorMessage = 'Insufficient funds for gas fee'
    } else if (error.message.includes('Price must be greater than zero')) {
      errorMessage = 'Property price must be greater than 0 ETH'
    }

    console.error('Property creation error:', error)
    toast.error(errorMessage)
    return Promise.reject(errorMessage)
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
  if (!ethereum) {
    reportError('Please install a wallet provider')
    return Promise.reject(new Error('Browser provider not found'))
  }
  try {
    const contract = await getEthereumContract()
    const property = await contract.getProperty(id)
    console.log('Fetched property:', property)
    return propertyStructure([property])[0]
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
