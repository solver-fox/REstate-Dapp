import PropertyList from '@/components/PropertyList'
import React, { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/blockchain'
import { PropertyStruct } from '@/utils/type.dt'

const PropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyStruct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const fetchedProperties: PropertyStruct[] = await getAllProperties()
        setProperties(fetchedProperties)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (error) return <div className="text-center text-red-500 pt-24">{error}</div>
  if (isLoading) return <div className="text-center pt-24">Loading...</div>

  return (
    <div className="container pt-24 pb-16 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Properties</h1>
      <PropertyList properties={properties} />
    </div>
  )
}

export default PropertiesPage
