import { motion } from 'framer-motion';

function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms & Conditions</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Last updated: March 15, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              2. Donation Terms
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>All donations are final and non-refundable</li>
              <li>Donors must be at least 18 years old</li>
              <li>We reserve the right to decline any donation</li>
              <li>Tax receipts will be provided for eligible donations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              3. User Conduct
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with the proper working of the service</li>
              <li>Make fraudulent donations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              4. Intellectual Property
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              All content on this website is the property of Smart Class and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              5. Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              For any questions regarding these terms, please contact us at:
              <br />
              Email: legal@smartclass.org
              <br />
              Phone: +91 1234567890
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

export default Terms;