import { useRouter } from 'next/router'
import EditProperty from '@/components/EditProperty'

const EditPropertyPage = () => {
  const router = useRouter()
  const { id } = router.query

  if (!id) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
      <EditProperty propertyId={Number(id)} />
    </div>
  )
}

export default EditPropertyPage

