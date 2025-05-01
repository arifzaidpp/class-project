import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PhoneIcon, ShareIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import { useDonationStats, useSponsors, useSponsorItems, useDeviceId, useTopContributors } from '../hooks'

function Home() {
  const navigate = useNavigate()
  const deviceId = useDeviceId()
  const [currentBanner, setCurrentBanner] = useState(0)
  const [currentSponsor, setCurrentSponsor] = useState(0)
  
  // Fetch data from backend using hooks
  const { data: statsData, loading: statsLoading } = useDonationStats()
  const { data: sponsorsData, loading: sponsorsLoading } = useSponsors()
  const { data: sponsorItemsData, loading: sponsorItemsLoading } = useSponsorItems()
  const { data: topContributorsData, loading: topContributorsLoading } = useTopContributors();
  
  const banners = [
    {
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg",
      title: "Smart Class Donation",
      description: "Help us build a better future through digital education"
    },
    {
      image: "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg",
      title: "Empower Education",
      description: "Your contribution makes a difference in students' lives"
    },
    {
      image: "https://images.pexels.com/photos/5905555/pexels-photo-5905555.jpeg",
      title: "Digital Learning",
      description: "Supporting modern education infrastructure"
    }
  ]

  // Map sponsors data from backend to UI format
  const sponsors = sponsorsLoading || !sponsorsData ? [
    // Fallback data until loading completes
    {
      name: "Loading...",
      role: "...",
      location: "...",
      image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg",
      contributions: [{ item: "Loading...", count: 0, totalValue: "..." }],
      totalAmount: "..."
    }
  ] : sponsorsData.getAllSponsors.map(sponsor => ({
    name: sponsor.name,
    role: sponsor.role || "Contributor",
    location: sponsor.place || "Kerala",
    image: sponsor.imageLink || "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg",
    contributions: sponsor.contributions?.map(contribution => ({
      item: contribution.sponsorItem.itemName,
      count: contribution.countContributed,
      totalValue: `₹${(contribution.sponsorItem.price * contribution.countContributed).toLocaleString('en-IN')}`
    })) || [],
    totalAmount: `₹${sponsor.contributions?.reduce((acc, curr) => acc + (curr.sponsorItem.price * curr.countContributed), 0).toLocaleString('en-IN') || 0}`
  }))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (sponsors.length > 0) {
      const timer = setInterval(() => {
        setCurrentSponsor((prev) => (prev + 1) % sponsors.length)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [sponsors.length])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Smart Class Initiative',
          text: 'Join us in building better educational facilities!',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  // Transform donation stats data from backend
  const collectionStats = statsLoading || !statsData ? {
    total: "Loading...",
    verified: "Loading..."
  } : {
    total: `₹${(statsData.getTotalConfirmedDonationAmount + statsData.getTotalPendingDonationAmount).toLocaleString('en-IN')}`,
    verified: `₹${statsData.getTotalConfirmedDonationAmount.toLocaleString('en-IN')}`
  }

  // This would normally come from a dedicated leaderboard query
  // For now we'll keep this static as an example
  const topContributors = topContributorsLoading || !topContributorsData ? [
    // Fallback data until loading completes
    { name: "Loading...", amount: "...", rank: 1 },
    { name: "Loading...", amount: "...", rank: 2 },
    { name: "Loading...", amount: "...", rank: 3 }
  ] : topContributorsData.getTopDonorsOfYesterday.map((donor, index) => ({
    name: donor.name || "Anonymous",
    amount: `₹${donor.amount.toLocaleString('en-IN')}`,
    rank: index + 1
  }));

  const quickPayAmounts = [100, 500, 1000, 5000]

  // Map sponsor items data from backend to UI format
  const sponsorItems = sponsorItemsLoading || !sponsorItemsData ? [
    // Fallback data until loading completes
    { name: "Loading...", price: "...", progress: 0, count: 0, id: "loading" }
  ] : sponsorItemsData.getAllSponsorItems.map(item => {
    const progress = item.count > 0 ? Math.round((item.sponsoredCount / item.count) * 100) : 0;
    return {
      name: item.itemName,
      price: `₹${item.price.toLocaleString('en-IN')}`,
      progress: progress,
      count: item.count - item.sponsoredCount,
      id: item.id
    };
  });

  const handleQuickPay = (amount: number) => {
    navigate(`/contribute/${amount}`)
  }

  const handleSponsorClick = (id: string) => {
    navigate(`/contribute/sponsor/${id}`)
  }

  return (
    <div className="space-y-8">
      {/* Banner Section */}
      <section className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
        {banners.map((banner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBanner === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 ${currentBanner === index ? 'z-10' : 'z-0'}`}
          >
            <img 
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col items-center justify-center text-center p-4 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">{banner.title}</h1>
              <p className="text-lg md:text-xl text-gray-200 mb-4 md:mb-8">{banner.description}</p>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <Link to="/contribute" className="bg-primary-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium hover:bg-primary-700 transition-colors">
                  Contribute Now
                </Link>
                <Link to="/leaderboard" className="bg-white text-gray-900 px-6 md:px-8 py-2 md:py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  Leaderboard
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Collection Summary and Top Contributors */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Collections</h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {statsLoading ? <span className="animate-pulse">Loading...</span> : collectionStats.total}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Verified Collections</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {statsLoading ? <span className="animate-pulse">Loading...</span> : collectionStats.verified}
            </p>
          </motion.div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Yesterday's Top Contributors</h3>
        <div className="space-y-4">
          {topContributorsLoading ? (
            <div className="animate-pulse flex justify-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Loading top contributors...</p>
            </div>
          ) : (
            topContributors.map((contributor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <span className="ml-3 text-gray-800 dark:text-gray-200">{contributor.name}</span>
                </div>
                <span className="font-semibold text-primary-600 dark:text-primary-400">{contributor.amount}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
      </section>

      {/* Quick Pay Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Quick Pay</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickPayAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickPay(amount)}
              className="relative overflow-hidden group bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 py-3 px-6 rounded-lg font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">₹{amount}</span>
              <div className="absolute inset-0 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-10" />
            </button>
          ))}
        </div>
      </section>

      {/* Sponsor Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Sponsor Items</h2>
        {sponsorItemsLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 dark:text-gray-400">Loading sponsor items...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {sponsorItems.map((item) => (
              <motion.div
                key={item.name}
                onClick={() => handleSponsorClick(item.id)}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                  <span className="text-primary-600 dark:text-primary-400 font-medium">{item.price}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.progress}% funded</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Need: {item.count} units</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Navigation Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Transactions', 'My History', 'Reports', 'Leaderboard'].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase().replace(' ', '-')}`}
            className="bg-white dark:bg-gray-800 p-6 bottom rounded-xl shadow-md text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 dark:text-white">{item}</h3>
          </Link>
        ))}
      </section>

      {/* Sponsors Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Our Major Contributors</h2>
        {sponsorsLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 dark:text-gray-400">Loading sponsors...</p>
          </div>
        ) : (
          <div className="relative h-[400px] md:h-[220px]">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: currentSponsor === index ? 1 : 0,
                  x: currentSponsor === index ? 0 : 100
                }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${currentSponsor === index ? 'z-10' : 'z-0'}`}
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Section */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg flex-shrink-0">
                        <img src={sponsor.image} alt={sponsor.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{sponsor.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{sponsor.role}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{sponsor.location}</p>
                      </div>
                    </div>
                    
                    {/* Contributions Section */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Contributions:</h4>
                        <div className="space-y-2">
                          {sponsor.contributions.map((contribution, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-300 truncate">
                                {contribution.item} × {contribution.count}
                              </span>
                              <span className="text-primary-600 dark:text-primary-400 font-medium">
                                {contribution.totalValue}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center font-semibold">
                              <span className="text-gray-800 dark:text-white">Total</span>
                              <span className="text-primary-600 dark:text-primary-400">
                                {sponsor.totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Rest of the component remains unchanged */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Video Section */}
        <div className="relative h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Smart Class Initiative"
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Share App Section */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-lg h-[400px] flex flex-col">
          <div className="grid grid-cols-2 flex-1">
            {/* Left side - Logo and QR */}
            <div className="p-6 flex flex-col items-center justify-center border-r border-primary-400/30">
              <div className="bg-white p-4 rounded-2xl mb-6">
                <img src="/hamsafar-logo.png" alt="Hamsafar Logo" className="h-16 w-16" />
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-4 rounded-2xl"
              >
                <QrCodeIcon className="h-16 w-16 text-primary-600" />
              </motion.div>
              <p className="mt-4 text-center text-primary-100 text-sm">
                Scan to share
              </p>
            </div>

            {/* Right side - App Preview */}
            <div className="p-6 flex flex-col items-center justify-center relative">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-400 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-600 rounded-full opacity-20 blur-xl"></div>
                <img 
                  src="https://images.pexels.com/photos/6393354/pexels-photo-6393354.jpeg" 
                  alt="Mobile App" 
                  className="h-48 relative z-10 rounded-xl shadow-2xl"
                />
              </motion.div>
            </div>
          </div>

          {/* Share button at bottom */}
          <div className="p-4 border-t border-primary-400/30">
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-primary-600 px-6 py-3 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-2 transition-colors hover:bg-primary-50"
            >
              <ShareIcon className="h-5 w-5" />
              <span>Share with Friends</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* App Support Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">App Support</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Our support team is here to help you</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://wa.me/1234567890"
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-sm sm:text-base">WhatsApp</span>
          </a>
          <a
            href="tel:1234567890"
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">Call Now</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link to="/privacy" className="flex items-center justify-center space-x-1">
            <span>Privacy Policy</span>
          </Link>
          <Link to="/terms" className="flex items-center justify-center space-x-1">
            <span>Terms & Conditions</span>
          </Link>
          <Link to="/about" className="flex items-center justify-center space-x-1">
            <span>Contact Us</span>
          </Link>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            © 2025 Smart Class Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home