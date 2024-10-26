import { PropertyStruct } from '@/utils/type.dt'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BsGrid, BsList } from 'react-icons/bs'
import { BiBed, BiBath, BiArea } from 'react-icons/bi'

interface PropertyCardProps {
  property: PropertyStruct
  viewMode: 'grid' | 'list'
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'h-48'}`}>
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${property.price.toLocaleString()}
        </div>
      </div>
      
      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-2">{property.name}</h3>
        <p className="text-zinc-400 mb-4">{property.location}</p>
        
        <div className="flex items-center space-x-4 text-zinc-400">
          <div className="flex items-center">
            <BiBed className="mr-2" />
            <span>{property.bedroom} beds</span>
          </div>
          <div className="flex items-center">
            <BiBath className="mr-2" />
            <span>{property.bathroom} baths</span>
          </div>
          <div className="flex items-center">
            <BiArea className="mr-2" />
            <span>{property.squarefit.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const PropertySkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  return (
    <div className={`animate-pulse bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden ${
      viewMode === 'list' ? 'flex' : ''
    }`}>
      <div className={`bg-zinc-800 ${
        viewMode === 'list' ? 'w-1/3' : 'h-48'
      }`} />
      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
        <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4" />
        <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4" />
        <div className="flex space-x-4">
          <div className="h-4 bg-zinc-800 rounded w-16" />
          <div className="h-4 bg-zinc-800 rounded w-16" />
          <div className="h-4 bg-zinc-800 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

const PropertyList: React.FC<{ properties: PropertyStruct[] }> = ({ properties }) => {
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'price' | 'size' | 'date'>('price')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const sortProperties = (props: PropertyStruct[]) => {
    return [...props].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price
        case 'size':
          return b.squarefit - a.squarefit
        default:
          return 0
      }
    })
  }

  return (
    <section className="pt-24 pb-16 bg-black">
      <main className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600"
          >
            Featured Properties
          </motion.h2>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400'}`}
              >
                <BsGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400'}`}
              >
                <BsList />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price">Price</option>
              <option value="size">Size</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'grid-cols-1 gap-4'
          }`}>
            {[1, 2, 3].map((i) => (
              <PropertySkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 1, scale: 0.8 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  delayChildren: 0.3,
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'grid-cols-1 gap-4'
            }`}
          >
            {sortProperties(properties).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        )}
      </main>
    </section>
  )
}

export default PropertyList
