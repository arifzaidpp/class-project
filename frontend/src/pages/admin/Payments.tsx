import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface Payment {
  id: string;
  date: string;
  amount: string;
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  mobile: string;
  location: string;
}

const columnHelper = createColumnHelper<Payment>();

function Payments() {
  const navigate = useNavigate();
  const [data] = useState<Payment[]>([
    {
      id: '1',
      date: '2024-03-15',
      name: 'John Doe',
      amount: '₹5,000',
      status: 'pending',
      mobile: '+91 9876543210',
      location: 'Mumbai, India',
    },
    {
      id: '2',
      date: '2024-03-14',
      name: 'Jane Smith',
      amount: '₹10,000',
      status: 'verified',
      mobile: '+91 9876543211',
      location: 'Delhi, India',
    },
  ]);

  const columns = [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() === 'verified' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : info.getValue() === 'rejected'
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: info => (
        <button 
          onClick={() => navigate(`/admin/payments/${info.getValue()}`)}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View Details
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Payment Verification</h1>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default Payments;