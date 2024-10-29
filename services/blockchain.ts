import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains' // replace with your chain

// Create a public client for read-only operations
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

export const getProperty = async (propertyId: number) => {
  try {
    // Use publicClient for read operations
    const property = await publicClient.readContract({
      // ... contract details
    })
    return property
  } catch (error) {
    console.error('Error in getProperty:', error)
    throw error
  }
}

export const getAllReviews = async (propertyId: number) => {
  try {
    // Use publicClient for read operations
    const reviews = await publicClient.readContract({
      // ... contract details
    })
    return reviews
  } catch (error) {
    console.error('Error in getAllReviews:', error)
    throw error
  }
} 