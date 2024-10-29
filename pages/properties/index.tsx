import PropertyList from '@/components/PropertyList'
import React, { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/blockchain'
import { PropertyStruct } from '@/utils/type.dt'
import { useRouter } from 'next/router'
import { BiArrowBack, BiBuilding } from 'react-icons/bi';

const PropertiesPage = () => {
  const router = useRouter();
  const { realtor } = router.query;
  const [properties, setProperties] = useState<PropertyStruct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching properties...')
        const fetchedProperties: PropertyStruct[] = await getAllProperties()
        console.log('Fetched properties:', fetchedProperties)

        const filteredProperties = realtor
          ? fetchedProperties.filter(
              property => 
                property.owner.toLowerCase() === realtor.toString().toLowerCase() &&
                !property.deleted
            )
          : fetchedProperties.filter(property => !property.deleted);

        setProperties(filteredProperties);
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch properties')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [realtor])

  if (error) return <div className="text-center text-red-500 pt-24">{error}</div>
  if (isLoading) return <div className="text-center pt-24">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        {realtor ? (
          <div className="mb-12">
            <button 
              onClick={() => router.push('/properties/realtors')}
              className="flex items-center text-gray-400 hover:text-blue-400 transition-colors mb-4"
            >
              <BiArrowBack className="mr-2" />
              Back to All Realtors
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Realtor Properties
                </h1>
                <div className="mt-2 flex items-center text-gray-400">
                  <BiBuilding className="mr-2" />
                  <span className="font-mono">
                    {realtor.toString().slice(0, 6)}...{realtor.toString().slice(-4)}
                  </span>
                </div>
              </div>
              <div className="text-gray-400">
                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              All Properties
            </h1>
            <div className="text-gray-400">
              {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
            </div>
          </div>
        )}

        <PropertyList properties={properties} />
      </div>
    </div>
  )
}

export default PropertiesPage
