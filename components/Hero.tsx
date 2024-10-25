import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Modern dark gradient background with mesh-like overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Hero text content */}
            <h1 className="text-5xl font-bold text-white">
              Discover Your Dream Property on the Blockchain
            </h1>
            <p className="text-xl text-gray-300">
              Experience the future of real estate with our decentralized property marketplace.
              Buy, sell, and invest in properties securely using blockchain technology.
            </p>
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Explore Properties
              </button>
              <button className="px-6 py-3 border border-gray-500 text-white rounded-lg hover:border-gray-400 transition-colors">
                List Property
              </button>
            </div>
          </div>
          {/* Featured property card */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
              alt="Featured Property"
              width={600}
              height={400}
              className="object-cover w-full h-[400px]"
              priority
            />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Luxury Villa #156</h3>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-mono">
                  ID: #A7B3F9
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">Current Value</p>
                  <p className="text-xl font-bold text-white">125 ETH</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
