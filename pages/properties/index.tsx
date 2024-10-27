import PropertyList from '@/components/PropertyList'
import React, { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/blockchain'
import { PropertyStruct } from '@/utils/type.dt'

const PropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyStruct[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProperties: PropertyStruct[] = await getAllProperties()
      setProperties(fetchedProperties)
    }
    fetchData()
  }, [])

  return (
    <div className="container pt-24 pb-16 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Properties</h1>
      <PropertyList properties={properties} />
    </div>
  )
}

export default PropertiesPage
