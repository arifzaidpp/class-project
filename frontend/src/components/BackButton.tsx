import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/') {
    return null
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 z-50"
      aria-label="Go back"
    >
      <ArrowLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
    </button>
  )
}

export default BackButton