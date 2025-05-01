import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative inline-block mb-8"
        >
          <div className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</div>
          <div className="absolute -bottom-4 -left-4 w-full h-full bg-primary-200 dark:bg-primary-800 rounded-xl -z-10 transform rotate-3"></div>
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;