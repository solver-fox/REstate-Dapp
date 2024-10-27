import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getProperty, createReview, getAllReviews, buyProperty, deleteReview } from '@/services/blockchain'
import { PropertyStruct, ReviewStruct } from '@/utils/type.dt'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { BiBed, BiBath, BiArea, BiMap, BiUser, BiCalendar, BiBuilding, BiTrash, BiShare, BiHeart, BiChevronLeft, BiChevronRight, BiMessageAdd, BiMessageDetail } from 'react-icons/bi'
import { FaEthereum } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyActions from '@/components/PropertyActions'
import Image from 'next/image'

const PropertyDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const { address } = useAccount()

  const [property, setProperty] = useState<PropertyStruct | null>(null)
  const [reviews, setReviews] = useState<ReviewStruct[]>([])
  const [newReview, setNewReview] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if the current user is an admin (you'll need to implement this logic)
  useEffect(() => {
    // Example: Check if the address matches the contract owner
    const checkAdmin = async () => {
      // Implement your admin check logic here
      setIsAdmin(true) // Temporary for demonstration
    }
    if (address) {
      checkAdmin()
    }
  }, [address])

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

  const handleDeleteReview = async (reviewId: number) => {
    if (!property) return
    
    try {
      await deleteReview(reviewId, property.id)
      toast.success('Review deleted successfully!')
      const updatedReviews = await getAllReviews(property.id)
      setReviews(updatedReviews)
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property?.name,
        text: property?.description,
        url: window.location.href,
      })
    } catch (error) {
      toast.error('Sharing failed')
    }
  }

  // First, add these buttons for image navigation
  const ImageNavigation = () => (
    <>
      {property && (  // Add null check
        <>
          <button
            onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition-all"
          >
            <BiChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setSelectedImage((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition-all"
          >
            <BiChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {property.images.length}
          </div>
        </>
      )}
    </>
  )

  // Then, update the ReviewsSection component
  const ReviewsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews</h2>
      </div>

      {/* Add Review Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmitReview(e)
        }} 
        className="space-y-4"
      >
        <textarea
          value={newReview}
          onChange={(e) => {
            e.preventDefault()
            setNewReview(e.target.value)
          }}
          placeholder="Write your review here..."
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white resize-none h-32"
          required
        />
        <button
          type="submit"
          disabled={!address || !newReview.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <BiMessageAdd className="w-5 h-5" />
          Post Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4 mt-8">
        {reviews.length > 0 ? (
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 p-6 rounded-xl relative group"
              >
                <p className="text-lg mb-4">{review.comment}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <BiUser />
                    <span>{review.reviewer.slice(0, 6)}...{review.reviewer.slice(-4)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <BiCalendar />
                      <span>{new Date(Number(review.timestamp) * 1000).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Delete Review Button */}
                    {(isAdmin || address?.toLowerCase() === review.reviewer.toLowerCase()) && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 
                          hover:bg-red-500/20 rounded-full"
                        title="Delete Review"
                      >
                        <BiTrash className="text-red-500 hover:text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-8">
            <BiMessageDetail className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Property not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section with Image Slider */}
      <div className="relative h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-full"
        >
          <Image
            src={property?.images[selectedImage] || ''}
            alt={property?.name || ''}
            layout="fill"
            objectFit="cover"
            priority
            className="brightness-75"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent h-1/3" />
        </motion.div>

        {/* Add Image Navigation */}
        <ImageNavigation />

        {/* Image Gallery Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {property?.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedImage === index ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 space-y-6">
              {/* Property Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold">{property?.name}</h1>
                  <div className="flex items-center mt-2 text-gray-300">
                    <BiMap className="mr-2" />
                    <span>{property?.location}, {property?.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-3xl font-bold text-blue-400 flex items-center">
                    <FaEthereum className="mr-1" />
                    {property?.price} ETH
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-700/50">
                <div className="text-center">
                  <BiBed className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{property.bedroom}</p>
                  <p className="text-sm text-gray-400">Bedrooms</p>
                </div>
                <div className="text-center">
                  <BiBath className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{property.bathroom}</p>
                  <p className="text-sm text-gray-400">Bathrooms</p>
                </div>
                <div className="text-center">
                  <BiArea className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{property.squarefit}</p>
                  <p className="text-sm text-gray-400">Sq Ft</p>
                </div>
                <div className="text-center">
                  <BiBuilding className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{property.built}</p>
                  <p className="text-sm text-gray-400">Built Year</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About this property</h2>
                <p className="text-gray-300 leading-relaxed">{property.description}</p>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-700/50">
                      <span className="text-gray-400">Property ID</span>
                      <span className="font-mono">#{property.id}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-700/50">
                      <span className="text-gray-400">Property Type</span>
                      <span>{property.category}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-700/50">
                      <span className="text-gray-400">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        property.sold ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {property.sold ? 'Sold' : 'Available'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-700/50">
                      <span className="text-gray-400">City</span>
                      <span>{property.city}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-700/50">
                      <span className="text-gray-400">State</span>
                      <span>{property.state}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-700/50">
                      <span className="text-gray-400">Country</span>
                      <span>{property.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <ReviewsSection />
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 space-y-6">
              <PropertyActions
                propertyId={property?.id || 0}
                isOwner={isOwner}
                isSold={Boolean(property?.sold)}
              />
              
              {/* Owner Info */}
              <div className="pt-6 border-t border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">Property Owner</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <BiUser className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-mono text-sm">
                      {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-400">Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
