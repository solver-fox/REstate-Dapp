import React, { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/blockchain'
import { FaEthereum } from 'react-icons/fa'
import { BiBuilding } from 'react-icons/bi'
import Link from 'next/link'

interface Realtor {
  address: string
  propertyCount: number
}

const RealtorsPage = () => {
  const [realtors, setRealtors] = useState<Realtor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealtors = async () => {
      try {
        const properties = await getAllProperties()
        
        // Group properties by owner and count them
        const realtorMap = new Map<string, number>()
        
        properties.forEach(property => {
          if (!property.deleted) {
            const count = realtorMap.get(property.owner) || 0
            realtorMap.set(property.owner, count + 1)
          }
        })

        // Convert map to array of Realtor objects
        const realtorArray: Realtor[] = Array.from(realtorMap).map(([address, count]) => ({
          address,
          propertyCount: count
        }))

        // Sort by property count
        realtorArray.sort((a, b) => b.propertyCount - a.propertyCount)
        
        setRealtors(realtorArray)
      } catch (error) {
        console.error('Error fetching realtors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRealtors()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-4">
                <div className="h-6 bg-gray-800 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Property Owners</h1>
        
        <div className="space-y-4">
          {realtors.map((realtor) => (
            <Link
              key={realtor.address}
              href={`/properties?owner=${realtor.address}`}
              className="block bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors border border-gray-800 hover:border-blue-500"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-mono text-white">
                  {realtor.address.slice(0, 6)}...{realtor.address.slice(-4)}
                </h2>
                <div className="flex items-center text-gray-400">
                  <BiBuilding className="mr-2" />
                  {realtor.propertyCount} {realtor.propertyCount === 1 ? 'Property' : 'Properties'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {realtors.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No property owners found.
          </div>
        )}
      </div>
    </div>
  )
}

export default RealtorsPage
