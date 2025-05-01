import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Mock payment data
  const payment = {
    id,
    date: '2024-03-15',
    name: 'John Doe',
    amount: '₹5,000',
    status: 'pending',
    mobile: '+91 9876543210',
    location: 'Mumbai, India',
    screenshot: 'https://images.pexels.com/photos/20787/pexels-photo.jpg',
    email: 'john@example.com',
    items: [
      { name: 'Smart TV', quantity: 1, amount: '₹35,000' },
    ],
  };

  const handleVerify = () => {
    // Handle verification logic
    navigate('/admin/payments');
  };

  const handleReject = () => {
    // Handle rejection logic with rejectionReason
    setShowRejectionModal(false);
    navigate('/admin/payments');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Payment Details</h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Donor Information</h2>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300">Name: {payment.name}</p>
                <p className="text-gray-600 dark:text-gray-300">Email: {payment.email}</p>
                <p className="text-gray-600 dark:text-gray-300">Mobile: {payment.mobile}</p>
                <p className="text-gray-600 dark:text-gray-300">Location: {payment.location}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment Information</h2>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300">Date: {payment.date}</p>
                <p className="text-gray-600 dark:text-gray-300">Amount: {payment.amount}</p>
                <p className="text-gray-600 dark:text-gray-300">Status: {payment.status}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sponsored Items</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              {payment.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">{item.name} × {item.quantity}</span>
                  <span className="text-gray-800 dark:text-gray-200">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment Screenshot</h2>
            <div 
              className="cursor-pointer"
              onClick={() => setShowImageModal(true)}
            >
              <img 
                src={payment.screenshot} 
                alt="Payment Screenshot" 
                className="max-h-48 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleVerify}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Verify Payment
            </button>
            <button
              onClick={() => setShowRejectionModal(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Reject Payment
            </button>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      <Dialog
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-3xl max-h-[90vh] overflow-auto">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <img 
            src={payment.screenshot} 
            alt="Payment Screenshot" 
            className="w-full h-auto"
          />
        </div>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog
        open={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Reject Payment
          </h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={4}
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowRejectionModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default PaymentDetails;