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
                <ConnectBtn className="px-8 py-4 rounded-lg border border-gray-700 bg-gray-900/50 text-white font-semibold hover:bg-gray-800 transition-colors" />
              </motion.div>
            </div>

            {/* Right column - Featured Property Card */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
