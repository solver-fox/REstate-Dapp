import Hero from '@/components/Hero'
import Features from '@/components/Features'
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
    <div className="bg-black min-h-screen">
      <Head>
        <title>HemProp | Web3 Real Estate Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
        <PropertyList properties={properties} />
        <Features />
       
       
      </main>
    </div>
  )
}

export default HomePage
