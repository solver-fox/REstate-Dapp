import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getProperty, createReview, getAllReviews, buyProperty, deleteReview } from '@/services/blockchain'
import { PropertyStruct, ReviewStruct } from '@/utils/type.dt'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { BiBed, BiBath, BiArea, BiMap, BiUser, BiCalendar, BiBuilding, BiTrash, BiShare, BiHeart, BiChevronLeft, BiChevronRight } from 'react-icons/bi'
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

  // Image Navigation Component
  const ImageNavigation = () => (
    <div className="absolute inset-0 flex items-center justify-between p-4">
      <button
        onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : property!.images.length - 1))}
        className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all group"
      >
        <BiChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={() => setSelectedImage((prev) => (prev < property!.images.length - 1 ? prev + 1 : 0))}
        className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all group"
      >
        <BiChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  )

  // Loading and Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="text-4xl font-bold text-gray-300">404</div>
        <div className="text-xl text-gray-400">Property not found</div>
        <button 
          onClick={() => router.push('/properties')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Browse Properties
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[85vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-full"
        >
          <Image
            src={property.images[selectedImage]}
            alt={property.name}
            layout="fill"
            objectFit="cover"
            priority
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
          
          <ImageNavigation />

          {/* Image Counter */}
          <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm text-white text-sm">
            {selectedImage + 1} / {property.images.length}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all
                ${isLiked ? 'bg-red-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'}`}
            >
              <BiHeart className="w-6 h-6" />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
            >
              <BiShare className="w-6 h-6" />
            </button>
          </div>

          {/* Property Title & Price */}
          <div className="absolute bottom-0 inset-x-0 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-5xl font-bold text-white mb-4">{property.name}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-300">
                  <BiMap className="w-5 h-5 mr-2" />
                  <span>{property.location}, {property.city}</span>
                </div>
                <div className="flex items-center text-3xl font-bold text-white">
                  <FaEthereum className="mr-2" />
                  <span>{property.price} ETH</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Property Stats */}
            <div className="grid grid-cols-4 gap-6">
              <PropertyStat icon={<BiBed />} value={property.bedroom} label="Bedrooms" />
              <PropertyStat icon={<BiBath />} value={property.bathroom} label="Bathrooms" />
              <PropertyStat icon={<BiArea />} value={property.squarefit} label="Sq Ft" />
              <PropertyStat icon={<BiBuilding />} value={property.built} label="Built Year" />
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <p className="text-gray-300 leading-relaxed">{property.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Reviews</h2>
              {/* Keep existing ReviewsSection component */}
            </div>
          </div>

          {/* Right Column - Actions & Owner Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              <PropertyActions
                propertyId={property.id}
                isOwner={Boolean(isOwner)}  // Explicitly convert to boolean
                isSold={Boolean(property.sold)}
              />
              
              {/* Owner Card */}
              {property.owner && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-4">Property Owner</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <BiUser className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-mono text-white">
                        {`${property.owner.slice(0, 6)}...${property.owner.slice(-4)}`}
                      </p>
                      <p className="text-sm text-gray-400">Owner</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Component for Property Stats
const PropertyStat = ({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 text-center">
    <div className="text-blue-400 mb-2">{icon}</div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
)

export default PropertyDetails
