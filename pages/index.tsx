import Hero from '@/components/Hero'
import { getAllProperties } from '@/services/blockchain'
import { PropertyStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import PropertyList from '@/components/PropertyList'

const AllPropertyPage: NextPage = () => {
  const [end, setEnd] = useState<number>(6)
  const [count] = useState<number>(15)
  const [properties, setProperties] = useState<PropertyStruct[]>([])
  const [collection, setCollection] = useState<PropertyStruct[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProperties: PropertyStruct[] = await getAllProperties()
      setProperties(fetchedProperties)
    }
    fetchData
  }, [])

  useEffect(() => {
    setCollection(properties.slice(0, end))
  }, [properties, end])
  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>Hemproperty | All Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <Hero/>
        <PropertyList properties={collection} />
        {collection.length > 0 && properties.length > collection.length && (
          <div className="w-full flex justify-center items-center mt-10">
            <button
              className="px-6 py-3 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 duration-300 transition-all"
              onClick={() => setEnd(end + count)}
            >
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default AllPropertyPage
