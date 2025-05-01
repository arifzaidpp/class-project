import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

function Support() {
  const faqs = [
    {
      question: 'How can I make a donation?',
      answer: 'You can make a donation by clicking the "Contribute Now" button and following the simple steps. We accept various payment methods including UPI, net banking, and cards.'
    },
    {
      question: 'Is my donation tax-deductible?',
      answer: 'Yes, all donations are eligible for tax deduction under Section 80G of the Income Tax Act. You will receive a receipt for your donation.'
    },
    {
      question: 'Can I donate anonymously?',
      answer: 'Yes, you can choose to hide your name while making a donation by checking the "Hide my name" option in the donation form.'
    },
    {
      question: 'How is the money being used?',
      answer: 'All donations go directly towards purchasing and installing smart classroom equipment. You can track the progress of various items in the Sponsor Section.'
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Support & FAQs</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Disclosure key={faq.question}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary-50 dark:bg-primary-900/30 px-4 py-3 text-left text-sm font-medium text-primary-900 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900/50 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                    <span>{faq.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-primary-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Need More Help?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Contact our support team:</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Email: support@smartclass.org
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Phone: +91 1234567890
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Working Hours: 9 AM - 6 PM (IST)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support