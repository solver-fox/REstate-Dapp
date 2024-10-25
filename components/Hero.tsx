import React from 'react'

import Link from 'next/link'

const Hero = () => {
  return (
    <div className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Keeping the existing background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left content section - Updated spacing and styling */}
          <div className="space-y-10">
            <div className="space-y-6">
              <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold inline-block">
                Web3 Real Estate Platform
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Discover Your Dream Property on the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Blockchain
                </span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Experience the future of real estate with our decentralized property marketplace.
                Buy, sell, and invest in properties securely using blockchain technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={'/properties/list'}
                className="px-8 py-4 bg-blue-500 backdrop-blur-sm text-white font-semibold rounded-md hover:bg-gray-700 hover:scale-105 transition-all duration-200 active:scale-95 text-center"
              >
                Explore Properties
              </Link>
              <Link
                href={'/properties/list'}
                className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white font-semibold rounded-md hover:bg-gray-700 hover:scale-105 transition-all duration-200 active:scale-95 text-center border border-white/40"
              >
                List Property
              </Link>
            </div>
          </div>

          {/* Right featured property card - Updated styling */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm group hover:border-blue-500/50 transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
            <img
              src="/hero.webp"
              alt="Featured Property"
              width={600}
              height={400}
              className="object-cover w-full h-[500px] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Luxury Villa #156</h3>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-mono">
                  ID: #A7B3F9
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-800/50 pt-4">
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">Current Value</p>
                  <p className="text-2xl font-bold text-white">25 ETH</p>
                </div>
                <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
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
