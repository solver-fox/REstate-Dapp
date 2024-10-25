import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import ConnectBtn from './ConnectBtn'

const Hero = () => {
  return (
    // Modern dark gradient background with mesh-like overlay
    <div className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute right-0 top-0 -translate-y-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Two-column layout for larger screens */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <span className="text-blue-400 font-mono">// NEXT GEN REAL ESTATE</span>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Own Digital Real Estate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Assets</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Revolutionary property ownership through blockchain technology. 
                Invest in premium real estate with complete transparency and security.
              </motion.p>

              {/* Stats with modern crypto styling */}
              <motion.div 
                className="grid grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { value: '$2.5M+', label: 'Total Value Locked' },
                  { value: '500+', label: 'Properties Tokenized' },
                  { value: '10K+', label: 'Active Investors' },
                ].map((stat, index) => (
                  <div key={index} className="border border-gray-800 rounded-xl p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-mono">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Section */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/properties"
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Explore Properties
                </Link>
                <Link
                  href="/property/list"
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  List Property
                </Link>
                
              </motion.div>
            </div>

            {/* Right column - Web3 Dashboard Style */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative h-[500px] p-6 bg-gradient-to-b from-gray-900/50 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800">
                {/* Market Overview */}
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-4">Market Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Floor Price', value: '45.5 ETH', change: '+2.5%' },
                      { label: 'Volume', value: '1.2K ETH', change: '+12.3%' },
                      { label: 'Properties Listed', value: '2.5K', change: '+5.7%' },
                      { label: 'Avg. Property Value', value: '75 ETH', change: '+1.2%' }
                    ].map((stat, index) => (
                      <div key={index} className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                        <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{stat.value}</span>
                          <span className="text-green-400 text-sm">{stat.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Properties */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-medium">Featured Properties</h3>
                    <div className="flex space-x-2">
                      <button className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                        24h
                      </button>
                      <button className="p-1.5 text-gray-400 hover:bg-gray-800/50 rounded-lg text-xs">
                        7d
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Azure Villa #1337",
                        price: "85.5 ETH",
                        change: "+12.3%",
                        tokenId: "#1337",
                        verified: true
                      },
                      {
                        name: "Meta Mansion #2048",
                        price: "120.0 ETH",
                        change: "+8.5%",
                        tokenId: "#2048",
                        verified: true
                      },
                      {
                        name: "Crypto Heights #892",
                        price: "95.2 ETH",
                        change: "+5.7%",
                        tokenId: "#892",
                        verified: false
                      }
                    ].map((property, index) => (
                      <div key={index} 
                        className="group flex items-center justify-between p-3 bg-gray-800/20 rounded-lg hover:bg-gray-800/40 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-blue-400 font-mono">{property.tokenId}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1">
                              <span className="text-white font-medium">{property.name}</span>
                              {property.verified && (
                                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-400 text-sm">Floor</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{property.price}</div>
                          <div className="text-green-400 text-sm">{property.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="absolute bottom-6 left-6 right-6">
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Connect Wallet to Trade
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
