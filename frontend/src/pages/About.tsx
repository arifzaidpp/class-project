import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function About() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 space-y-8"
      >
        {/* College Section */}
        <section className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg"
              alt="College Logo"
              className="w-full h-full rounded-full object-cover border-4 border-primary-200 dark:border-primary-700"
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary-400 dark:border-primary-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Government College
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Established in 1995, our institution has been at the forefront of quality education,
            serving the community with dedication and excellence.
          </p>
        </section>

        {/* Address Section */}
        <section className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p>Government College Road,</p>
            <p>Near Bus Stand,</p>
            <p>City - 123456</p>
            <p>State, India</p>
            <p>Phone: +91 1234567890</p>
            <p>Email: info@govtcollege.edu.in</p>
          </div>
        </section>

        {/* Project Section */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="/hamsafar-logo.png"
                alt="Smart Class Logo"
                className="w-24 h-24"
              />
              <motion.div
                className="absolute inset-0 bg-primary-400 dark:bg-primary-600 rounded-full -z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ opacity: 0.2 }}
              />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Smart Class Initiative
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            A project aimed at modernizing our classrooms and enhancing the learning experience
            through digital technology and smart infrastructure.
          </p>

          {/* Project Documents */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg"
                alt="Donation Request Letter"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">Donation Request Letter</h3>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src="https://images.pexels.com/photos/5905555/pexels-photo-5905555.jpeg"
                alt="Project Tariff"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">Project Tariff</h3>
              </div>
            </motion.div>
          </div>

          {/* PDF Viewer */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Project Brochure</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <Document
                file="/path/to/brochure.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
                className="mx-auto"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mx-auto"
                />
              </Document>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <p className="text-gray-600 dark:text-gray-300">
                  Page {pageNumber} of {numPages}
                </p>
                <button
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={pageNumber >= (numPages || 1)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

export default About;