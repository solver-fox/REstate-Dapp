import React, { useState, useEffect } from 'react'
import { updateProperty, getProperty } from '@/services/blockchain'
import { PropertyParams } from '@/utils/type.dt'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

interface EditPropertyProps {
  propertyId: number
}

const EditProperty: React.FC<EditPropertyProps> = ({ propertyId }) => {
  const router = useRouter()
  const [property, setProperty] = useState<PropertyParams>({
    id: propertyId,
    name: '',
    images: [],
    category: 'House', // Set a default value or use any of the allowed categories
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const fetchedProperty = await getProperty(propertyId)
        setProperty(fetchedProperty)
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to fetch property details')
      }
    }
    fetchProperty()
  }, [propertyId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProperty((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Add form fields similar to the createProperty form */}
      <input
        type="text"
        name="name"
        value={property.name}
        onChange={handleChange}
        placeholder="Property Name"
        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white"
        required
      />
      {/* Add more form fields for other property attributes */}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Update Property
      </button>
    </form>
  )
}

export default EditProperty
