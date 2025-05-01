import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QrCodeIcon, CurrencyRupeeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function Payment() {
  const navigate = useNavigate();
  const [showBankDetails, setShowBankDetails] = useState(false);

  const handleUPIPayment = () => {
    const amount = "1000"; // Replace with actual amount
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = userAgent.includes("chrome");
    const isMobile = /android|iphone|ipad|mobile/.test(userAgent);
    
    let paymentUrl;
    if (isChrome && !isMobile) {
      paymentUrl = `upi://pay?pa=arifzaidaiju@oksbi&pn=Smart%20Class&am=${amount}.00&cu=INR&tn=Smart%20Class%20Donation`;
    } else if (isChrome && isMobile) {
      paymentUrl = `intent://pay?pa=arifzaidaiju@oksbi&pn=Smart%20Class&am=${amount}.00&cu=INR&tn=Smart%20Class%20Donation#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end;`;
    } else {
      paymentUrl = `upi://pay?pa=arifzaidaiju@oksbi&pn=Smart%20Class&am=${amount}.00&cu=INR&tn=Smart%20Class%20Donation`;
    }

    window.location.href = paymentUrl;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Complete Your Payment
          </h2>

          <div className="space-y-6">
            {/* QR Code Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
              <QrCodeIcon className="w-32 h-32 mx-auto mb-4 text-primary-600 dark:text-primary-400" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Scan QR code to pay
              </p>
            </div>

            {/* UPI Button */}
            <button
              onClick={handleUPIPayment}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CurrencyRupeeIcon className="w-5 h-5" />
              <span>Pay with UPI</span>
            </button>

            {/* Unable to pay section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => setShowBankDetails(!showBankDetails)}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>Unable to pay using UPI?</span>
              </button>

              {showBankDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bank Details</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>Account Name: Smart Class Fund</p>
                    <p>Account Number: 1234567890</p>
                    <p>IFSC Code: SBIN0123456</p>
                    <p>Bank: State Bank of India</p>
                    <p>Branch: Main Branch</p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => navigate('/payment-verification')}
                className="mt-4 w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Continue to Verification
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Payment;