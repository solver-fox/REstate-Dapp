import { useRouter } from 'next/router'
import { deleteProperty } from '@/services/blockchain'
import { toast } from 'react-toastify'
import { BiEdit, BiTrash } from 'react-icons/bi'

interface PropertyActionsProps {
  propertyId: number
  isOwner: boolean
  isSold: boolean
}

const PropertyActions: React.FC<PropertyActionsProps> = ({ propertyId, isOwner, isSold }) => {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      await deleteProperty(propertyId)
      toast.success('Property deleted successfully')
      router.push('/properties')
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  if (!isOwner || isSold) return null

  return (
    <div className="flex gap-4">
      <button
        onClick={() => router.push(`/properties/edit/${propertyId}`)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <BiEdit />
        Edit Property
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <BiTrash />
        Delete Property
      </button>
    </div>
  )
}

export default PropertyActions

