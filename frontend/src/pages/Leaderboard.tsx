import { motion } from 'framer-motion'

interface Donor {
  rank: number
  name: string
  amount: string
  contributions: number
}

function Leaderboard() {
  const topDonors: Donor[] = [
    { rank: 1, name: 'Anonymous', amount: '₹25,000', contributions: 3 },
    { rank: 2, name: 'John Doe', amount: '₹20,000', contributions: 2 },
    { rank: 3, name: 'Jane Smith', amount: '₹15,000', contributions: 4 },
  ]

  const otherDonors: Donor[] = [
    { rank: 4, name: 'Anonymous', amount: '₹12,000', contributions: 1 },
    { rank: 5, name: 'Robert Johnson', amount: '₹10,000', contributions: 2 },
    { rank: 6, name: 'Sarah Wilson', amount: '₹8,000', contributions: 1 },
    { rank: 7, name: 'Michael Brown', amount: '₹7,500', contributions: 2 },
    { rank: 8, name: 'Emily Davis', amount: '₹6,000', contributions: 1 },
  ]

  const userRank = { rank: 15, name: 'You', amount: '₹2,000', contributions: 1 }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Top Contributors</h1>
      
      {/* Top 3 Contributors */}
      <div className="grid md:grid-cols-3 gap-6">
        {topDonors.map((donor, index) => (
          <motion.div
            key={donor.rank}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-10 translate-y--10 rotate-45 ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              'bg-orange-500'
            }`} />
            <div className="relative">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {donor.rank}
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">{donor.name}</h3>
              <p className="text-2xl font-bold text-center text-primary-600 dark:text-primary-400 mb-1">{donor.amount}</p>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">{donor.contributions} contributions</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Other Contributors */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Other Contributors</h2>
          <div className="space-y-4">
            {otherDonors.map((donor, index) => (
              <motion.div
                key={donor.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center">
                  <span className="w-8 text-gray-600 dark:text-gray-400 font-medium">{donor.rank}</span>
                  <span className="text-gray-800 dark:text-white">{donor.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600 dark:text-primary-400">{donor.amount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{donor.contributions} contributions</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* User's Position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-50 dark:bg-primary-900/30 rounded-xl shadow-md p-6"
      >
        <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">Your Position</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-8 text-primary-600 dark:text-primary-400 font-medium">#{userRank.rank}</span>
            <span className="text-primary-900 dark:text-primary-100">{userRank.name}</span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-primary-600 dark:text-primary-400">{userRank.amount}</p>
            <p className="text-sm text-primary-700 dark:text-primary-300">{userRank.contributions} contribution</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Leaderboard