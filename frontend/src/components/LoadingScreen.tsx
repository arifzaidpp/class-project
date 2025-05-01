import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4"
      >
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-400 dark:bg-primary-600 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-600 dark:bg-primary-400 rounded-full opacity-20 blur-xl"></div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <img 
              src="/hamsafar-logo.png" 
              alt="Smart Class Logo" 
              className="h-24 w-24 object-contain"
            />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Smart Class Connect
          </h1>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="h-32 rounded-lg overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg"
                  alt="Smart Class"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <div className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              Loading amazing things...
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-center text-xs">
              Developed by Smart Class Team
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoadingScreen;