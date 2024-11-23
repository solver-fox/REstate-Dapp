import { PropertyStruct } from '@/utils/type.dt'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BsGrid, BsList, BsFilter } from 'react-icons/bs'
import { BiBed, BiBath, BiArea, BiMap } from 'react-icons/bi'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface PropertyCardProps {
  property: PropertyStruct
  viewMode: 'grid' | 'list'
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {
  const router = useRouter()

  const handlePropertyClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/properties/${property.id}`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onClick={handlePropertyClick}
      className={`cursor-pointer bg-[#1A2331] rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'h-64'}`}>
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
            property.sold ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {property.sold ? 'Sold' : 'Available'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-xl font-bold text-white truncate">{property.name}</h3>
          <p className="text-sm text-gray-300 flex items-center">
            <BiMap className="mr-1" />
            {property.location}
          </p>
        </div>
      </div>

      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3 flex flex-col justify-between' : ''}`}>
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1 transition-transform duration-200 ease-in-out hover:scale-105">
              <BiBed className="mr-2 text-blue-400" />
              <span className="text-sm text-gray-300">{property.bedroom} bedrooms</span>
            </div>
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1 transition-transform duration-200 ease-in-out hover:scale-105">
              <BiBath className="mr-2 text-blue-400" />
              <span className="text-sm text-gray-300">{property.bathroom} bathrooms</span>
            </div>
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1 transition-transform duration-200 ease-in-out hover:scale-105">
              <BiArea className="mr-2 text-blue-400" />
              <span className="text-sm text-gray-300">
                {property.squarefit.toLocaleString()} sqft
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">
              Listed by:
              <span className="font-mono bg-gray-800 px-2 py-1 rounded ml-2 inline-block">
                {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
              </span>
            </span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
              {property.category}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            {property.price.toLocaleString()} ETH
          </span>
          <Link href={`/properties/${property.id}`}>
            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold cursor-pointer">
              View Details
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

const PropertySkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  return (
    <div
      className={`animate-pulse bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div 
        className={`bg-zinc-800 ${
          viewMode === 'list' 
            ? 'w-1/3 h-[300px]' 
            : 'h-[240px]'
        }`} 
      />

      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
        <div className="flex flex-wrap gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-zinc-800 rounded-full w-24" />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-zinc-800 rounded w-32" />
          <div className="h-6 bg-zinc-800 rounded w-20" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="h-8 bg-zinc-800 rounded w-28" />
          <div className="h-10 bg-zinc-800 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

const PropertyList: React.FC<{ properties: PropertyStruct[] }> = ({ properties }) => {
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'price' | 'size' | 'date'>('price')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filteredProperties, setFilteredProperties] = useState<PropertyStruct[]>(properties)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: '',
    propertyType: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setFilteredProperties(properties)
  }, [properties])

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const applyFilters = () => {
    let filtered = properties.filter((property) => {
      if (filters.minPrice && property.price < parseFloat(filters.minPrice)) return false
      if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) return false
      if (filters.minBedrooms && property.bedroom < parseInt(filters.minBedrooms)) return false
      if (filters.minBathrooms && property.bathroom < parseInt(filters.minBathrooms)) return false
      if (filters.propertyType && property.category !== filters.propertyType) return false
      return true
    })
    setFilteredProperties(filtered)
    setFilterOpen(false)
  }

  return (
    <section className="pt-24 pb-16 min-h-screen">
      <main className="container mx-auto px-4">
        <div className="flex justify-end mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400'
                }`}
              >
                <BsGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400'
                }`}
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

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center"
            >
              <BsFilter className="mr-2" />
              Filter
            </button>
          </div>
        </div>

        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg p-2"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg p-2"
              />
              <input
                type="number"
                name="minBedrooms"
                placeholder="Min Bedrooms"
                value={filters.minBedrooms}
                onChange={handleFilterChange}
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg p-2"
              />
              <input
                type="number"
                name="minBathrooms"
                placeholder="Min Bathrooms"
                value={filters.minBathrooms}
                onChange={handleFilterChange}
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg p-2"
              />
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg p-2"
              >
                <option value="">All Property Types</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
              </select>
            </div>
            <button
              onClick={applyFilters}
              className="w-full sm:w-auto bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </motion.div>
        )}

        {loading ? (
          <div
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'grid-cols-1 gap-6'
            }`}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PropertySkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'grid-cols-1 gap-6'
              }`}
            >
              {sortProperties(filteredProperties).map((property) => (
                <PropertyCard key={property.id} property={property} viewMode={viewMode} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-zinc-400 mt-12"
          >
            No properties found matching your criteria.
          </motion.div>
        )}
      </main>
    </section>
  )
}

export default PropertyList
