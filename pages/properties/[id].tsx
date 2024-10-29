import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getProperty, buyProperty } from '@/services/blockchain'
import { PropertyStruct } from '@/utils/type.dt'
import { toast } from 'react-toastify'
import { BiBed, BiBath, BiArea, BiMap, BiCalendar } from 'react-icons/bi'
import { FaEthereum } from 'react-icons/fa'
import PropertyActions from '@/components/PropertyActions'
import Image from 'next/image'
import { motion } from 'framer-motion'

const PropertyDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const { address } = useAccount()
  const [property, setProperty] = useState<PropertyStruct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || isNaN(Number(id))) return
      
      try {
        setLoading(true)
        const fetchedProperty = await getProperty(Number(id))
        setProperty(fetchedProperty)
        setSelectedImage(fetchedProperty.images[0])
      } catch (error) {
        console.error('Error fetching property:', error)
        setError('Failed to load property details')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const handleBuyProperty = async () => {
    if (!address) {
      toast.warn('Please connect your wallet')
      return
    }

    if (!property) return

    try {
      await toast.promise(
        buyProperty(property),
        {
          pending: 'Processing purchase...',
          success: 'Property purchased successfully!',
          error: 'Failed to purchase property'
        }
      )
      router.push('/properties/personal')
    } catch (error) {
      console.error('Error buying property:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-800 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-red-500">{error || 'Property not found'}</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src={selectedImage}
                alt={property.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {property.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 
                    ${image === selectedImage ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`${property.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{property.name}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <BiMap />
                {property.location}, {property.city}, {property.state}, {property.country}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <BiBed className="text-xl" />
                  <span>Bedrooms</span>
                </div>
                <p className="text-2xl font-bold text-white">{property.bedroom}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <BiBath className="text-xl" />
                  <span>Bathrooms</span>
                </div>
                <p className="text-2xl font-bold text-white">{property.bathroom}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <BiArea className="text-xl" />
                  <span>Area</span>
                </div>
                <p className="text-2xl font-bold text-white">{property.squarefit} sqft</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <BiCalendar className="text-xl" />
                  <span>Built</span>
                </div>
                <p className="text-2xl font-bold text-white">{property.built}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-400">{property.description}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Price</h2>
              <div className="flex items-center gap-2">
                <FaEthereum className="text-3xl text-blue-400" />
                <span className="text-3xl font-bold text-white">{property.price} ETH</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {!property.sold && address?.toLowerCase() !== property.owner.toLowerCase() && (
                <button
                  onClick={handleBuyProperty}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex-1"
                >
                  Buy Property
                </button>
              )}
              <PropertyActions
                propertyId={property.id}
                isOwner={address?.toLowerCase() === property.owner.toLowerCase()}
                isSold={property.sold}
                onBuy={handleBuyProperty}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PropertyDetails
