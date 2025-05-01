import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

function PaymentVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically upload the file to your server
    // For now, we'll just navigate to success page
    navigate('/payment-success');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Upload Payment Screenshot
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="screenshot-upload"
            />
            <label
              htmlFor="screenshot-upload"
              className="cursor-pointer block"
            >
              {preview ? (
                <img 
                  src={preview} 
                  alt="Payment Screenshot" 
                  className="max-h-48 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-2">
                  <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Click to upload screenshot
                  </p>
                </div>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={!file}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Verification
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default PaymentVerification;