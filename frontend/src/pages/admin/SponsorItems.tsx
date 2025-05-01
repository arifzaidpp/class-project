import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SponsorItem {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
}

function SponsorItems() {
  const [items, setItems] = useState<SponsorItem[]>([
    {
      id: '1',
      name: 'TV',
      price: 35000,
      available: 2,
      description: '55-inch Smart TV for classroom',
    },
    {
      id: '2',
      name: 'Bench & Desk',
      price: 15000,
      available: 10,
      description: 'Student bench and desk set',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SponsorItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    available: 0,
    description: '',
  });

  const handleAddEdit = (item?: SponsorItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        available: item.available,
        description: item.description,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        price: 0,
        available: 0,
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      setItems([...items, { id: Date.now().toString(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sponsor Items</h1>
        <button
          onClick={() => handleAddEdit()}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddEdit(item)}
                  className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ₹{item.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Available</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.available} units
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Available Units
              </label>
              <input
                type="number"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                {editingItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}

export default SponsorItems;