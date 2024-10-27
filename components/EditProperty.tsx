import React, { useState, useEffect } from 'react'
import { updateProperty, getProperty } from '@/services/blockchain'
import { PropertyParams } from '@/utils/type.dt'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

interface EditPropertyProps {
  propertyId: number
}

const EditProperty: React.FC<EditPropertyProps> = ({ propertyId }) => {
  const router = useRouter()
  const [imageInput, setImageInput] = useState<string>('')
  const [property, setProperty] = useState<PropertyParams>({
    id: propertyId,
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
  const [errors, setErrors] = useState<{ [key in keyof PropertyParams]?: string }>({})

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const fetchedProperty = await getProperty(propertyId)
        setProperty({
          ...fetchedProperty,
          bedroom: fetchedProperty.bedroom.toString(),
          bathroom: fetchedProperty.bathroom.toString(),
          built: fetchedProperty.built.toString(),
          squarefit: fetchedProperty.squarefit.toString(),
          price: fetchedProperty.price.toString(),
        })
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to fetch property details')
      }
    }
    fetchProperty()
  }, [propertyId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    try {
      await updateProperty(property)
      toast.success('Property updated successfully')
      router.push(`/properties/${propertyId}`)
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error('Failed to update property')
    }
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-95 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto relative"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Edit Property</h1>
          <p className="text-gray-400">Update your property information</p>
        </div>

        <div className="backdrop-blur-lg bg-gray-900 bg-opacity-50 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <select
                  name="category"
                  value={property.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                >
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <textarea
                name="description"
                value={property.description}
                onChange={handleChange}
                placeholder="Property Description"
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                required
              />
            </div>

            {/* Property Images */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Property Images</h3>

              {property.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {property.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
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

              <div className="flex gap-4">
                <input
                  type="url"
                  placeholder="Enter image URL"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (imageInput.trim()) {
                      setProperty((prev) => ({
                        ...prev,
                        images: [...prev.images, imageInput.trim()],
                      }))
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
              <h3 className="text-xl font-semibold text-white">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="number"
                  name="bedroom"
                  value={property.bedroom}
                  onChange={handleChange}
                  placeholder="Bedrooms"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
                <input
                  type="number"
                  name="bathroom"
                  value={property.bathroom}
                  onChange={handleChange}
                  placeholder="Bathrooms"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
                <input
                  type="number"
                  name="squarefit"
                  value={property.squarefit}
                  onChange={handleChange}
                  placeholder="Square Feet"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="location"
                  value={property.location}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={property.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={property.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={property.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  value={property.zipCode}
                  onChange={handleChange}
                  placeholder="Zip Code"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
              </div>
            </div>

            {/* Price and Year */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  name="price"
                  value={property.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
                <input
                  type="number"
                  name="built"
                  value={property.built}
                  onChange={handleChange}
                  placeholder="Year Built"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update Property
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default EditProperty
