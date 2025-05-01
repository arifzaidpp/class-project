import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  CurrencyRupeeIcon, 
  ChartBarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

function Dashboard() {
  const [stats] = useState({
    totalViews: '15,482',
    totalContributors: '256',
    totalSponsors: '45',
    totalAmount: '₹12,45,000'
  });

  const cards = [
    { title: 'Total Views', value: stats.totalViews, icon: EyeIcon, color: 'bg-blue-500' },
    { title: 'Contributors', value: stats.totalContributors, icon: UserGroupIcon, color: 'bg-green-500' },
    { title: 'Sponsors', value: stats.totalSponsors, icon: UserGroupIcon, color: 'bg-yellow-500' },
    { title: 'Total Amount', value: stats.totalAmount, icon: CurrencyRupeeIcon, color: 'bg-purple-500' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Contributions Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3366FF" 
                  fill="#3366FF" 
                  fillOpacity={0.1} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div 
                key={index}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <ChartBarIcon className="h-8 w-8 text-primary-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New contribution received
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ₹5,000 from Anonymous
                  </p>
                </div>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  2 hours ago
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;