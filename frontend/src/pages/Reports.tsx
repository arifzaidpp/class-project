import { motion } from 'framer-motion'

function Reports() {
  const reports = [
    { title: 'Monthly Collections', amount: '₹45,000', growth: '+12%' },
    { title: 'Average Donation', amount: '₹2,500', growth: '+8%' },
    { title: 'Total Donors', count: '156', growth: '+15%' },
    { title: 'Completion Rate', percentage: '65%', growth: '+5%' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{report.title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {report.amount || report.count || report.percentage}
              </p>
              <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                {report.growth}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Monthly Progress</h2>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[60, 45, 75, 50, 80, 65, 70, 55, 85, 90, 75, 95].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full bg-primary-600 dark:bg-primary-500 rounded-t"
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports