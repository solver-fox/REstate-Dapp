import { createProperty } from '@/services/blockchain'
import { PropertyParams } from '@/utils/type.dt'
import { NextPage } from 'next'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import Image from 'next/image'

const Page: NextPage = () => {
  const { address } = useAccount()

  const [property, setProperty] = useState<PropertyParams>({
    name: '',
    images: [],
    category: 'House',
    description: '',
    location: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    bedroom: '',
    bathroom: '',
    built: '',
    squarefit: '',
    price: '',
  })

  const [imageInput, setImageInput] = useState<string>('')

  const [errors, setErrors] = useState<{ [key in keyof PropertyParams]?: string }>({})

  // Replace the houseTypes array with this one to match the types exactly
  const houseTypes = [
    'House',
    'Apartment',
    'Condo',
    'Townhouse',
    'Villa'
  ] as const;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setProperty((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (errors[name as keyof PropertyParams]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) return toast.warn('Please connect your wallet')

    const requiredFields: (keyof PropertyParams)[] = [
      'name',
      'category',
      'description',
      'location',
      'city',
      'state',
      'country',
      'zipCode',
      'bedroom',
      'bathroom',
      'built',
      'squarefit',
      'price',
    ]

    const newErrors: { [key in keyof PropertyParams]?: string } = {}
    requiredFields.forEach((field) => {
      if (!property[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    if (property.images.length === 0) {
      newErrors.images = 'At least one image is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }

    setErrors({})

    console.log('Images:', property.images)

    if (property.images.length === 0 || property.images.some((image) => !image.trim())) {
      return toast.warn('Please provide at least one valid image URL')
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const tx = await createProperty(property)
          console.log(tx)
          resetForm()
          resolve(tx)
        } catch (error) {
          reject(error)
        }
      }),
      {
        pending: 'Uploading Property...',
        success: 'Property uploaded successfully',
        error: 'Failed to upload Property',
      }
    )
  }

  const resetForm = () => {
    setProperty({
      name: '',
      images: [],
      category: 'House',
      description: '',
      location: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      bedroom: '',
      bathroom: '',
      built: '',
      squarefit: '',
      price: '',
    })
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-95 py-12 mt-[4rem] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            List Your Property on the Blockchain
          </h1>
          <p className="text-gray-400 animate-fade-in-delay">
            Transform your real estate into digital assets
          </p>
        </div>

        {/* Main Form Card */}
        <div className="backdrop-blur-lg bg-gray-900 bg-opacity-50 rounded-2xl shadow-2xl p-8 border border-gray-800 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  📝
                </span>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <input
                    type="text"
                    name="name"
                    value={property.name}
                    onChange={handleChange}
                    placeholder="Property Name"
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="group">
                  <select
                    name="category"
                    value={property.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.category ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                    required
                  >
                    {houseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>
              </div>

              <textarea
                name="description"
                value={property.description}
                onChange={handleChange}
                placeholder="Property Description"
                rows={4}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500`}
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Property Images */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  🖼️
                </span>
                Property Images
              </h3>

              {/* Image Preview Section */}
              {property.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {property.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setProperty((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                        }}
                        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Image Input */}
              <div className="flex gap-4">
                <input
                  type="url"
                  placeholder="Enter image URL"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (imageInput.trim()) {
                      setProperty((prev) => {
                        const newImages = [...prev.images, imageInput.trim()]
                        console.log('Updated Images:', newImages)
                        return { ...prev, images: newImages }
                      })
                      setImageInput('')
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  🏠
                </span>
                Property Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="number"
                  name="bedroom"
                  value={property.bedroom}
                  onChange={handleChange}
                  placeholder="Bedrooms"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.bedroom ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.bedroom && <p className="mt-1 text-sm text-red-500">{errors.bedroom}</p>}

                <input
                  type="number"
                  name="bathroom"
                  value={property.bathroom}
                  onChange={handleChange}
                  placeholder="Bathrooms"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.bathroom ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.bathroom && <p className="mt-1 text-sm text-red-500">{errors.bathroom}</p>}

                <input
                  type="number"
                  name="squarefit"
                  value={property.squarefit}
                  onChange={handleChange}
                  placeholder="Square Feet"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.squarefit ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.squarefit && (
                  <p className="mt-1 text-sm text-red-500">{errors.squarefit}</p>
                )}
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  📍
                </span>
                Location Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="location"
                  value={property.location}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.location ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}

                <input
                  type="text"
                  name="city"
                  value={property.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.city ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="text"
                  name="state"
                  value={property.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.state ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}

                <input
                  type="text"
                  name="country"
                  value={property.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.country ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}

                <input
                  type="text"
                  name="zipCode"
                  value={property.zipCode}
                  onChange={handleChange}
                  placeholder="Zip Code"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
              </div>
            </div>

            {/* Additional Property Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  📅
                </span>
                Additional Property Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  name="built"
                  value={property.built}
                  onChange={handleChange}
                  placeholder="Year Built"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.built ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.built && <p className="mt-1 text-sm text-red-500">{errors.built}</p>}

                <input
                  type="number"
                  name="price"
                  value={property.price}
                  onChange={handleChange}
                  placeholder="Price (in ETH)"
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.price ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500`}
                  required
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
