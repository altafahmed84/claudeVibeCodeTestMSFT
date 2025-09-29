import AdminForm from '../components/AdminForm'
import { useNavigate } from 'react-router-dom'

const AddFeature = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-primary-background">
      <AdminForm
        mode="create"
        onClose={handleClose}
      />
    </div>
  )
}

export default AddFeature