import React from 'react'
import { FaLock, FaGlobe, FaHandshake } from 'react-icons/fa'

const features = [
  {
    icon: <FaLock className="w-6 h-6" />,
    title: 'Secure Transactions',
    description: 'All property transactions are secured by blockchain technology, ensuring transparency and immutability.',
  },
  {
    icon: <FaGlobe className="w-6 h-6" />,
    title: 'Global Marketplace',
    description: 'Access a worldwide real estate market, breaking down geographical barriers for property investment.',
  },
  {
    icon: <FaHandshake className="w-6 h-6" />,
    title: 'Smart Contracts',
    description: 'Automated and trustless property deals through Ethereum smart contracts, reducing intermediaries.',
  },
]

const Features: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose SlvfxProp?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

