import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getProperty, createReview, getAllReviews, buyProperty } from '@/services/blockchain'
import { PropertyStruct, ReviewStruct } from '@/utils/type.dt'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { BiBed, BiBath, BiArea, BiMap, BiUser, BiCalendar } from 'react-icons/bi'
import { FaEthereum } from 'react-icons/fa'
import { motion } from 'framer-motion'

const PropertyDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const { address } = useAccount()

  const [property, setProperty] = useState<PropertyStruct | null>(null)
  const [reviews, setReviews] = useState<ReviewStruct[]>([])
  const [newReview, setNewReview] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchPropertyAndReviews = async () => {
      if (id) {
        try {
          const fetchedProperty = await getProperty(Number(id))
          setProperty(fetchedProperty)
          const fetchedReviews = await getAllReviews(Number(id))
          setReviews(fetchedReviews)
        } catch (error) {
          console.error('Error fetching property or reviews:', error)
          toast.error('Failed to load property details')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPropertyAndReviews()
  }, [id])

  const isOwner = address && property && address.toLowerCase() === property.owner.toLowerCase()

  const handleBuyProperty = async () => {
    if (!address) {
      toast.warn('Please connect your wallet')
      return
    }
    if (!property || isOwner) return

    try {
      await buyProperty(property)
      toast.success('Property purchased successfully!')
      router.push('/properties/personal')
    } catch (error) {
      console.error('Error buying property:', error)
      toast.error('Failed to purchase property')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) {
      toast.warn('Please connect your wallet')
      return
    }
    if (!property) return

    try {
      await createReview({ propertyId: property.id, comment: newReview })
      toast.success('Review submitted successfully!')
      const updatedReviews = await getAllReviews(property.id)
      setReviews(updatedReviews)
      setNewReview('')
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    }
  }

  if (loading) {
    return <div className="text-center text-white mt-20">Loading...</div>
  }

  if (!property) {
    return <div className="text-center text-white mt-20">Property not found</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white pt-20 pb-10"
    >
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-6"
        >
          {property.name}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={property.images[selectedImage]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {property.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.name} - ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity ${
                    index === selectedImage ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
            
            {/* Updated description section */}
            <div className="bg-gray-800 p-6 rounded-lg lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-300">{property.description}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
                <BiBed className="mr-2 text-blue-400" />
                <span className="text-sm">{property.bedroom} beds</span>
              </div>
              <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
                <BiBath className="mr-2 text-blue-400" />
                <span className="text-sm">{property.bathroom} baths</span>
              </div>
              <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
                <BiArea className="mr-2 text-blue-400" />
                <span className="text-sm">{property.squarefit} sqft</span>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Category</p>
                  <p className="font-semibold">{property.category}</p>
                </div>
                <div>
                  <p className="text-gray-400">Year Built</p>
                  <p className="font-semibold">{property.built}</p>
                </div>
                <div>
                  <p className="text-gray-400">Location</p>
                  <p className="font-semibold">{property.location}</p>
                </div>
                <div>
                  <p className="text-gray-400">City</p>
                  <p className="font-semibold">{property.city}</p>
                </div>
                <div>
                  <p className="text-gray-400">State</p>
                  <p className="font-semibold">{property.state}</p>
                </div>
                <div>
                  <p className="text-gray-400">Zip Code</p>
                  <p className="font-semibold">{property.zipCode}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-gray-400">Price</p>
                <p className="text-3xl font-bold flex items-center text-blue-400">
                  <FaEthereum className="mr-2" />
                  {property.price} ETH
                </p>
              </div>
              {!isOwner && (
                <button
                  onClick={handleBuyProperty}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={property.sold}
                >
                  {property.sold ? 'Sold' : 'Buy Now'}
                </button>
              )}
              {isOwner && (
                <span className="text-green-400 font-semibold">You own this property</span>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-800 p-6 rounded-lg"
                >
                  <p className="text-lg mb-4">{review.comment}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <BiUser className="mr-2" />
                      <span>
                        {review.reviewer.slice(0, 6)}...{review.reviewer.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BiCalendar className="mr-2" />
                      <span>{new Date(review.timestamp * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No reviews yet. Be the first to leave a review!</p>
          )}

          <form onSubmit={handleSubmitReview} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your thoughts about this property..."
              className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
              required
            />
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto"
            >
              Submit Review
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default PropertyDetails
