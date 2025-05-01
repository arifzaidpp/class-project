import { motion } from 'framer-motion'
import { useDonationsByDevice, useDeviceId } from '../hooks'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function History() {
  const deviceId = useDeviceId();
  const { data, loading, error } = useDonationsByDevice(deviceId || undefined);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Process data
  const donations = !loading && data?.getDonations ? data.getDonations.map(donation => ({
    id: donation.id,
    date: new Date(donation.createdAt),
    dateFormatted: new Date(donation.createdAt).toLocaleDateString(),
    amount: donation.amount,
    amountFormatted: `₹${donation.amount.toLocaleString('en-IN')}`,
    status: donation.status.toLowerCase(),
    name: donation.name || 'Anonymous',
    location: donation.cityName && donation.stateName ? 
      `${donation.cityName}, ${donation.stateName}` : 'Not provided',
    screenshotLink: donation.screenshotLink
  })) : [];
  
  // Sort donations
  const sortedDonations = [...donations].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    } else {
      return sortOrder === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    }
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Toggle sort order
  const handleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Error loading history</h3>
        <p>{error.message || "Failed to load your donation history. Please try again later."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Donation History</h1>

      {sortedDonations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">You haven't made any donations yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start contributing to our worthy cause today!</p>
          <Link 
            to="/contribute" 
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
          >
            Make Your First Donation
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {sortedDonations.length} {sortedDonations.length === 1 ? 'Donation' : 'Donations'}
            </h2>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${
                  sortBy === 'date' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 
                  'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleSort('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${
                  sortBy === 'amount' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 
                  'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleSort('amount')}
              >
                Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedDonations.map((donation, index) => (
                  <motion.tr
                    key={donation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {donation.dateFormatted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {donation.amountFormatted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusColor(donation.status)
                      }`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 hidden md:table-cell">
                      {donation.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {donation.status === 'confirmed' ? (
                        <Link
                          to={`/receipt/${donation.id}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                        >
                          View Receipt
                        </Link>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Not Available</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">About Your Donations</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          • <strong>Draft</strong>: Your donation has been initiated but payment is not yet completed
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          • <strong>Pending</strong>: Your payment is being verified by our team
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          • <strong>Confirmed</strong>: Payment has been verified and donation is complete
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          • <strong>Rejected</strong>: There was an issue with the payment that could not be resolved
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          to="/contribute" 
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
        >
          Make Another Donation
        </Link>
      </div>
    </div>
  );
}

export default History;