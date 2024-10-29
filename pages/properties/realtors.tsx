import React, { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/blockchain'
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
     
        const realtorMap = new Map<string, number>()
        
        properties.forEach(property => {
          if (!property.deleted) {
            const count = realtorMap.get(property.owner) || 0
            realtorMap.set(property.owner, count + 1)
          }
        })

        const realtorArray: Realtor[] = Array.from(realtorMap).map(([address, count]) => ({
          address,
          propertyCount: count
        }))


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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Property Owners
          </h1>
          <div className="text-gray-400">
            {realtors.length} {realtors.length === 1 ? 'Owner' : 'Owners'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realtors.map((realtor) => (
            <Link
              key={realtor.address}
              href={{
                pathname: '/properties',
                query: { realtor: realtor.address }
              }}
              className="group block"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 
                           hover:border-blue-500 transition-all duration-300 
                           hover:shadow-lg hover:shadow-blue-500/20 
                           hover:translate-y-[-2px]">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-500/10 rounded-lg px-4 py-2">
                      <h2 className="text-lg font-mono text-blue-400">
                        {realtor.address.slice(0, 6)}...{realtor.address.slice(-4)}
                      </h2>
                    </div>
                    <div className="flex items-center text-gray-400 group-hover:text-blue-400 transition-colors">
                      <BiBuilding className="mr-2 text-xl" />
                      <span className="font-semibold">
                        {realtor.propertyCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Click to view {realtor.propertyCount} {realtor.propertyCount === 1 ? 'property' : 'properties'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {realtors.length === 0 && (
          <div className="text-center text-gray-400 py-12 bg-gray-800/30 rounded-2xl backdrop-blur-sm">
            <BiBuilding className="mx-auto text-4xl mb-4" />
            No property owners found.
          </div>
        )}
      </div>
    </div>
  )
}

export default RealtorsPage
