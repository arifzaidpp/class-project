import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contribute from './pages/Contribute'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import Leaderboard from './pages/Leaderboard'
import Support from './pages/Support'
import Payment from './pages/Payment'
import PaymentVerification from './pages/PaymentVerification'
import PaymentSuccess from './pages/PaymentSuccess'
import Dashboard from './pages/admin/Dashboard'
import AdminPayments from './pages/admin/Payments'
import SponsorItems from './pages/admin/SponsorItems'
import ManageSponsors from './pages/admin/ManageSponsors'
import PaymentDetails from './pages/admin/PaymentDetails'
import Login from './pages/admin/Login'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'
import { HeartIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './config/apolloClient'
import History from './pages/History'
import { DeviceRegistration } from './components/DeviceRegistration';


function ContributeButton() {
  const location = useLocation();

  if (location.pathname.includes('/contribute') ||
    location.pathname.includes('/payment') ||
    location.pathname.includes('payment-verification') ||
    location.pathname.includes('payment-success') ||
    location.pathname.includes('/admin') ||
    location.pathname.includes('/privacy') ||
    location.pathname.includes('/terms') ||
    location.pathname === '/about') {
    return null;
  }

  return (
    <div className="fixed -bottom-1 bg-gray-50 dark:bg-gray-900 left-0 right-0 z-50 p-4 flex justify-center">
      <Link to="/contribute">
        <motion.button
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <HeartIcon className="w-6 h-6 group-hover:text-red-200 transition-colors duration-300" />
          <span className="relative">
            <span className="relative z-10">Contribute Now</span>
            <motion.span
              className="absolute inset-0 bg-primary-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{ originX: 0, opacity: 0.3 }}
            />
          </span>
        </motion.button>
      </Link>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const [deviceId, setDeviceId] = useState('')

  useEffect(() => {
    // Generate a unique device ID
    const generateDeviceId = () => {
      const nav = window.navigator;
      const screen = window.screen;
      let uuid = nav.userAgent + screen.height + screen.width + nav.language;
      return btoa(uuid).slice(0, 32);
    };

    const id = localStorage.getItem('deviceId') || generateDeviceId();
    localStorage.setItem('deviceId', id);
    setDeviceId(id);
    console.log('Device ID:', deviceId);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <DeviceRegistration />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <ScrollToTop />

          <main className="container mx-auto px-4 py-8 pb-28 mt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contribute" element={<Contribute />} />
              <Route path="/contribute/:amount" element={<Contribute />} />
              <Route path="/contribute/sponsor/:sponsor" element={<Contribute />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/my-history" element={<History />} />
              <Route path="/support" element={<Support />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-verification" element={<PaymentVerification />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path='/terms' element={<Terms />} />
              <Route path='*' element={<NotFound />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/payments/:id" element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>} />
              <Route path="/admin/sponsor-items" element={<ProtectedRoute><SponsorItems /></ProtectedRoute>} />
              <Route path="/admin/manage-sponsors" element={<ProtectedRoute><ManageSponsors /></ProtectedRoute>} />
            </Routes>
          </main>
          <ContributeButton />
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App