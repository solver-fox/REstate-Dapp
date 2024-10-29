import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  getProperty,
  createReview,
  getAllReviews,
  buyProperty,
  deleteReview,
  deleteProperty,
} from '@/services/blockchain'
import { PropertyStruct, ReviewStruct } from '@/utils/type.dt'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import {
  BiBed,
  BiBath,
  BiArea,
  BiMap,
  BiUser,
  BiCalendar,
  BiBuilding,
  BiTrash,
  BiShare,
  BiHeart,
  BiChevronLeft,
  BiChevronRight,
  BiEdit,
  BiGlobe,
  BiMapAlt,
} from 'react-icons/bi'
import { FaEthereum } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyActions from '@/components/PropertyActions'
import Image from 'next/image'
import { formatEther } from 'viem' // Add this import if not already present

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
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Check if the current user is an admin (you'll need to implement this logic)
  useEffect(() => {
    const checkAdmin = async () => {
      setIsAdmin(true)
    }
    if (address) {
      checkAdmin()
    }
  }, [address])

  useEffect(() => {
    const fetchPropertyAndReviews = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedProperty = await getProperty(Number(id))
        if (!fetchedProperty) {
          throw new Error('Property not found')
        }
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

    if (id) {
      fetchPropertyAndReviews()
    }
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

  const ImageNavigation = () => (
    <div className="absolute inset-0 flex items-center justify-between p-4">
      <button
        onClick={() =>
          setSelectedImage((prev) => (prev > 0 ? prev - 1 : property!.images.length - 1))
        }
        className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all group"
      >
        <BiChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={() =>
          setSelectedImage((prev) => (prev < property!.images.length - 1 ? prev + 1 : 0))
        }
        className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all group"
      >
        <BiChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  )

  const handleEditProperty = () => {
    router.push(`/properties/edit/${property?.id}`)
  }

  const handleDeleteProperty = async () => {
    if (!property) return

    try {
      await deleteProperty(property.id)
      toast.success('Property deleted successfully!')
      router.push('/properties/personal')
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!loading && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Property Not Found</h2>
          <p className="text-gray-400 mb-4">
            We couldn&apos;t find the property you&apos;re looking for. It may have been removed or
            doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push('/properties')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 pb-[100px] lg:pb-0">
      <div className="relative w-full" style={{ height: '50vh' }}>
        {' '}
        <Image
          src={property?.images[selectedImage] ?? ''}
          alt={property?.name ?? 'Property Image'}
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-2 sm:gap-4">
              {' '}
              <div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
                  {property?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-300">
                  <span className="flex items-center">
                    <BiMap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {property?.location}, {property?.city}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                  <FaEthereum className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                  {property?.price} ETH
                </div>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <BiShare className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 sm:mb-12">
          <PropertyStat icon={<BiBed />} value={property?.bedroom ?? 0} label="Bedrooms" />
          <PropertyStat icon={<BiBath />} value={property?.bathroom ?? 0} label="Bathrooms" />
          <PropertyStat icon={<BiArea />} value={property?.squarefit ?? 0} label="Square Feet" />
          <PropertyStat icon={<BiBuilding />} value={property?.built ?? 0} label="Year Built" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {property?.images.slice(0, 8).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setSelectedImage(index)
                      setShowModal(true)
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Property view ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}

                {/* Show more photos button (if there are more than 8 images) */}
                {(property?.images?.length ?? 0) > 8 && (
                  <div
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedImage(8)
                      setShowModal(true)
                    }}
                  >
                    <Image
                      src={property?.images[8] ?? ''}
                      alt="More photos"
                      layout="fill"
                      objectFit="cover"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        +{(property?.images?.length ?? 0) - 8} more
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description and Details */}
            <div className="space-y-8">
              {/* Description Section */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BiBuilding className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold">About this property</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">{property?.description}</p>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Details Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <BiUser className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold">Property Details</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailCard
                      icon={<BiBuilding className="w-5 h-5" />}
                      label="Category"
                      value={property?.category}
                      bgColor="bg-indigo-500/20"
                      textColor="text-indigo-400"
                    />
                    <DetailCard
                      icon={<BiBed className="w-5 h-5" />}
                      label="Bedrooms"
                      value={property?.bedroom}
                      bgColor="bg-blue-500/20"
                      textColor="text-blue-400"
                    />
                    <DetailCard
                      icon={<BiBath className="w-5 h-5" />}
                      label="Bathrooms"
                      value={property?.bathroom}
                      bgColor="bg-cyan-500/20"
                      textColor="text-cyan-400"
                    />
                    <DetailCard
                      icon={<BiArea className="w-5 h-5" />}
                      label="Square Feet"
                      value={property?.squarefit}
                      bgColor="bg-teal-500/20"
                      textColor="text-teal-400"
                    />
                    <DetailCard
                      icon={<BiCalendar className="w-5 h-5" />}
                      label="Year Built"
                      value={property?.built}
                      bgColor="bg-green-500/20"
                      textColor="text-green-400"
                    />
                    <DetailCard
                      icon={<FaEthereum className="w-5 h-5" />}
                      label="Price"
                      value={`${property?.price} ETH`}
                      bgColor="bg-yellow-500/20"
                      textColor="text-yellow-400"
                    />
                  </div>
                </div>

                {/* Location Details Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
                      <BiMap className="w-5 h-5 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-bold">Location Information</h3>
                  </div>

                  <div className="space-y-6">
                    <LocationDetail
                      label="Street Address"
                      value={property?.location}
                      icon={<BiMap className="w-5 h-5" />}
                    />
                    <LocationDetail
                      label="City"
                      value={property?.city}
                      icon={<BiBuilding className="w-5 h-5" />}
                    />
                    <LocationDetail
                      label="State"
                      value={property?.state}
                      icon={<BiMap className="w-5 h-5" />}
                    />
                    <LocationDetail
                      label="Country"
                      value={property?.country}
                      icon={<BiGlobe className="w-5 h-5" />}
                    />
                    <LocationDetail
                      label="Zip Code"
                      value={property?.zipCode}
                      icon={<BiMapAlt className="w-5 h-5" />}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Reviews</h2>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-gray-900 rounded-2xl p-6">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your thoughts about this property..."
                  className="w-full p-4 bg-gray-800 border-none rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Post Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-gray-900 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <BiUser className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {`${review.reviewer.slice(0, 6)}...${review.reviewer.slice(-4)}`}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(Number(review.timestamp) * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {(isAdmin || address?.toLowerCase() === review.reviewer.toLowerCase()) && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <BiTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 space-y-4 mb-20 lg:mb-0">
                {!isOwner && !property?.sold && (
                  <button
                    onClick={handleBuyProperty}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaEthereum className="w-5 h-5" />
                    <span>Buy for {property?.price} ETH</span>
                  </button>
                )}

                {isOwner && !property?.sold && (
                  <div className="space-y-3">
                    <div className="text-center py-2 px-4 bg-gray-800 rounded-xl">
                      <p className="text-gray-400">You own this property</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleEditProperty}
                        className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
                      >
                        <BiEdit className="w-5 h-5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
                      >
                        <BiTrash className="w-5 h-5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}

                {!isOwner && property?.sold && (
                  <div className="text-center py-2 px-4 bg-gray-800 rounded-xl">
                    <p className="text-gray-400">This property has been sold</p>
                  </div>
                )}
              </div>

              {/* Owner Info */}
              {property?.owner && (
                <div className="bg-gray-900 rounded-2xl p-6 hidden lg:block">
                  <h3 className="text-xl font-bold mb-4">Property Owner</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <BiUser className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-mono">
                        {`${property.owner.slice(0, 6)}...${property.owner.slice(-4)}`}
                      </p>
                      <p className="text-sm text-gray-400">Verified Owner</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="relative max-w-5xl w-full">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Image
                src={property?.images[selectedImage] ?? ''}
                alt={`Property image ${selectedImage + 1}`}
                width={1920}
                height={1080}
                className="rounded-xl"
              />
              <ImageNavigation />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          >
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Delete Property</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteProperty()
                    setShowDeleteModal(false)
                  }}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Updated PropertyStat Component
const PropertyStat = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string | number | undefined
  label: string
}) => (
  <div className="bg-gray-900 rounded-xl p-3 sm:p-4">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="text-blue-400 text-lg sm:text-xl">{icon}</div>
      <div>
        <div className="text-base sm:text-lg font-semibold">{value ?? 0}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  </div>
)

const DetailItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
)

const DetailCard = ({
  icon,
  label,
  value,
  bgColor,
  textColor,
}: {
  icon: React.ReactNode
  label: string
  value: string | number | undefined
  bgColor: string
  textColor: string
}) => (
  <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-2">
      <div
        className={`w-8 h-8 ${bgColor} ${textColor} rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
    <p className="text-lg font-semibold text-white pl-11">{value}</p>
  </div>
)

const LocationDetail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number | undefined
}) => (
  <div className="flex items-center gap-4">
    <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </div>
)

export default PropertyDetails
