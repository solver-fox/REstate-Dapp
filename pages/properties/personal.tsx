import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { getAllProperties } from '@/services/blockchain'
import PropertyList from '@/components/PropertyList'
import { PropertyStruct } from '@/utils/type.dt'

const PersonalPropertiesPage = () => {
  const router = useRouter()
  const { address } = useAccount()
  const [properties, setProperties] = useState<PropertyStruct[]>([])

  useEffect(() => {
    if (!address) {
      router.push('/properties')
      return
    }

    const fetchProperties = async () => {
      const allProperties = await getAllProperties()
      const userProperties = allProperties.filter(
        (property) => property.owner.toLowerCase() === address.toLowerCase()
      )
      setProperties(userProperties)
    }

    fetchProperties()
  }, [address, router])

  if (!address) return null

  return (
    <div className="container pt-24 pb-16 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Properties</h1>
      <PropertyList properties={properties} />
    </div>
  )
}

export default PersonalPropertiesPage
