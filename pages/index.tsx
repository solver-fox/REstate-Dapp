import Hero from '@/components/Hero'
import { getAllProperties } from '@/services/blockchain'
import { PropertyStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import PropertyList from '@/components/PropertyList'

const HomePage: NextPage = () => {
  const [properties, setProperties] = useState<PropertyStruct[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProperties: PropertyStruct[] = await getAllProperties()
      setProperties(fetchedProperties)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>HemProp | Web3 Real Estate Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full mx-auto py-8">
        <Hero />
        <div className="px-4 sm:px-6 justify-center items-center lg:px-8 max-w-[1440px] mx-auto">
          <div className="max-w-3xl mx-auto text-center pt-32">
            <h1 className="text-4xl font-bold text-white mb-4">Discover Your Perfect Property</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Explore our curated collection of premium properties. Whether you're looking for a
              cozy apartment, a spacious family home, or a luxury estate.
            </p>
          </div>

          <div className="flex justify-center w-full">
            <PropertyList properties={properties} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
