import Hero from '@/components/Hero'
import { getAllProperties } from '@/services/blockchain'
import { PropertyStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import PropertyList from '@/components/PropertyList'

const AllPropertyPage: NextPage = () => {
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
        <title>Hemproperty | All Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <Hero />
        <PropertyList properties={properties} /> {/* Pass properties here */}
      </main>
    </div>
  )
}

export default AllPropertyPage
