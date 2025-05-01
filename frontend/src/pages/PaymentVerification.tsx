import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateDonation } from '../hooks/graphql/mutations/update-donation';
import { DonationStatus } from '../types/graphql.type';
import { uploadFile } from '../utils/storageUtil';

function PaymentVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get donation ID from location state
  const { donationId } = location.state || {};
  
  // Update donation mutation
  const [updateDonation] = useUpdateDonation(
    (data) => {
      setIsSubmitting(false);
      // Navigate to success page or show success message
      navigate('/payment-success', {
        state: {
          donationId: data.updateDonation.id,
          amount: data.updateDonation.amount
        }
      });
    },
    (error) => {
      setIsSubmitting(false);
      setError(error.message || 'Failed to update donation. Please try again.');
    }
  );

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setScreenshot(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!donationId) {
      setError('Donation ID not found. Please try again.');
      return;
    }
    
    if (!screenshot) {
      setError('Please upload a payment screenshot.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Upload file to your storage service
      // This is a placeholder - replace with your actual upload logic
      const formData = new FormData();
      formData.append('file', screenshot);
      
      // Example upload to a server endpoint
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to upload screenshot.');
      // }
      
      // const { fileUrl } = await response.json();

      const fileUrl  = await uploadFile(screenshot)
        .then((fileUrl) => {
          // Handle successful upload
          console.log('File uploaded successfully:', fileUrl);
          return fileUrl;
        })
        .catch((error) => {
          // Handle upload error
          console.error('Error uploading file:', error);
          throw new Error('Failed to upload screenshot.');
        });
      
      // Update donation with screenshot link
      updateDonation({
        variables: {
          id: donationId,
          data: {
            screenshotLink: fileUrl || undefined,
            // Optional: You can also update status here
            status: DonationStatus.PENDING
          }
        }
      });
      
    } catch (error) {
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : 'Failed to upload screenshot.');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Payment Verification</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Payment Screenshot
          </label>
          <div className="flex flex-col items-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
               onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            {previewUrl ? (
              <div className="w-full space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Payment Screenshot" 
                  className="max-h-60 mx-auto object-contain"
                />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Click to change image
                </p>
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Click to upload a payment screenshot
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!screenshot || isSubmitting}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : 'Submit Verification'}
        </button>
      </form>
    </div>
  );
}

export default PaymentVerification;