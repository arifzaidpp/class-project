import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')
  const showBackButton = location.pathname !== '/' && !isAdmin

  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/payments', label: 'Payments' },
    { path: '/admin/sponsor-items', label: 'Manage Sponsor Items' },
    { path: '/admin/manage-sponsors', label: 'Manage Sponsors' },
  ]

  const regularLinks = [
    { path: '/', label: 'Home' },
    { path: '/contribute', label: 'Donate' },
    { path: '/about', label: 'About' },
  ]

  const links = isAdmin ? adminLinks : regularLinks

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
            )}
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Munashata Smart Class
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            <div className="hidden md:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
          <div className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar