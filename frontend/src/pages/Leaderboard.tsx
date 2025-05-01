import { motion } from 'framer-motion'
import { useLeaderboard, useDeviceId, useDonationsByDevice } from '../hooks'
import { useState, useEffect } from 'react'

interface Donor {
  rank: number
  name: string
  amount: string
  contributions: number
  id: string
  deviceId: string
}

function Leaderboard() {
  const { data: leaderboardData, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();
  const deviceId = useDeviceId();
  const { data: userDonationsData } = useDonationsByDevice(deviceId || '');
  const [userRank, setUserRank] = useState<Donor | null>(null);
  
  // Process backend data into the format we need
  const donors: Donor[] = !leaderboardLoading && leaderboardData 
    ? leaderboardData.getLeaderboardByTopAmount.map((donation, index) => ({
        rank: index + 1,
        name: donation.name || 'Anonymous',
        amount: `₹${donation.amount.toLocaleString('en-IN')}`,
        contributions: 1, // This could be refined if backend provides count
        id: donation.id,
        deviceId: donation.deviceId
      }))
    : [];

  // Split donors into top 3 and others
  const topDonors = donors.slice(0, 3);
  const otherDonors = donors.slice(3, 10); // Show positions 4-10
  
  // Fix: Create a helper function to check for confirmed status in a case-insensitive way
  const isConfirmedStatus = (status: string): boolean => {
    return status.toUpperCase() === 'CONFIRMED';
  };
  
  // Calculate user's position if they have made donations
  useEffect(() => {
    if (deviceId && userDonationsData?.getDonations && donors.length > 0) {
      // Find all donations by this device - Fix: Use case-insensitive check
      const userTotalAmount = userDonationsData.getDonations.reduce(
        (sum, donation) => sum + (isConfirmedStatus(donation.status) ? donation.amount : 0), 
        0
      );
      
      if (userTotalAmount > 0) {
        // Find user's position in the leaderboard
        const userPosition = donors.findIndex(donor => donor.deviceId === deviceId);
        
        if (userPosition !== -1) {
          // User is already in the top donors
          setUserRank({
            ...donors[userPosition],
            name: 'You',
          });
        } else {
          // User is not in the top donors, calculate their position
          let rank = donors.length + 1;
          for (let i = donors.length - 1; i >= 0; i--) {
            if (userTotalAmount <= parseInt(donors[i].amount.replace(/[^\d]/g, ''))) {
              break;
            }
            rank--;
          }
          
          // Fix: Use the same helper function here
          setUserRank({
            rank,
            name: 'You',
            amount: `₹${userTotalAmount.toLocaleString('en-IN')}`,
            contributions: userDonationsData.getDonations.filter(d => isConfirmedStatus(d.status)).length,
            id: 'user',
            deviceId: deviceId
          });
        }
      }
    }
  }, [deviceId, userDonationsData, donors]);


  if (leaderboardLoading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (leaderboardError || !leaderboardData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Error loading leaderboard</h3>
        <p>{leaderboardError?.message || "Failed to load leaderboard data. Please try again later."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Top Contributors</h1>
      
      {/* Top 3 Contributors */}
      <div className="grid md:grid-cols-3 gap-6">
        {topDonors.map((donor, index) => (
          <motion.div
            key={donor.id}
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
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">{donor.contributions} contribution{donor.contributions !== 1 ? 's' : ''}</p>
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
                key={donor.id}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{donor.contributions} contribution{donor.contributions !== 1 ? 's' : ''}</p>
                </div>
              </motion.div>
            ))}
            
            {otherDonors.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No additional contributors yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* User's Position */}
      {userRank && (
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
              <p className="text-sm text-primary-700 dark:text-primary-300">{userRank.contributions} contribution{userRank.contributions !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Motivational CTA */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl shadow-md p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Make a Difference Today</h2>
        <p className="mb-4">Your contribution helps us build better educational facilities for students in need.</p>
        <button 
          onClick={() => window.location.href = '/contribute'}
          className="bg-white text-primary-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          Contribute Now
        </button>
      </div>
    </div>
  )
}

export default Leaderboard