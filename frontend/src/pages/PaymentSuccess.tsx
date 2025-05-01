import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function PaymentSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center"
      >
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Thank You for Your Contribution!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We will verify your payment within 24 hours and update your contribution status.
          You will receive a confirmation notification once verified.
        </p>
        <Link 
          to="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default PaymentSuccess;