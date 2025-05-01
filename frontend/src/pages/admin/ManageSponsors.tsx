import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SponsorItem {
  name: string;
  count: number;
}

interface Sponsor {
  id: string;
  name: string;
  role: string;
  image: File | string;
  items: SponsorItem[];
}

function ManageSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Chairman',
      image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
      items: [
        { name: 'Smart TV', count: 2 },
        { name: 'Benches', count: 10 },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: null as File | null,
    imagePreview: '',
    items: [{ name: '', count: 0 }],
  });

  const handleAddEdit = (sponsor?: Sponsor) => {
    if (sponsor) {
      setEditingSponsor(sponsor);
      setFormData({
        name: sponsor.name,
        role: sponsor.role,
        image: null,
        imagePreview: sponsor.image as string,
        items: [...sponsor.items],
      });
    } else {
      setEditingSponsor(null);
      setFormData({
        name: '',
        role: '',
        image: null,
        imagePreview: '',
        items: [{ name: '', count: 0 }],
      });
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: '',
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', count: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sponsorData = {
      id: editingSponsor?.id || Date.now().toString(),
      name: formData.name,
      role: formData.role,
      image: formData.image ? URL.createObjectURL(formData.image) : (editingSponsor?.image || ''),
      items: formData.items,
    };

    if (editingSponsor) {
      setSponsors(sponsors.map(s => 
        s.id === editingSponsor.id ? sponsorData : s
      ));
    } else {
      setSponsors([...sponsors, sponsorData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Sponsors</h1>
        <button
          onClick={() => handleAddEdit()}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Sponsor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <motion.div
            key={sponsor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={sponsor.image as string}
                  alt={sponsor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{sponsor.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{sponsor.role}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddEdit(sponsor)}
                  className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Sponsored Items</h4>
              <div className="space-y-2">
                {sponsor.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.count} units</span>
                  </div>
                ))}
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
            {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
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
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="space-y-1 text-center">
                  {formData.imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sponsored Items
              </label>
              {formData.items.map((item, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].name = e.target.value;
                      setFormData({ ...formData, items: newItems });
                    }}
                    placeholder="Item name"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    value={item.count}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index].count = parseInt(e.target.value);
                      setFormData({ ...formData, items: newItems });
                    }}
                    placeholder="Count"
                    className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Item</span>
              </button>
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
                {editingSponsor ? 'Update' : 'Add'} Sponsor
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}

export default ManageSponsors;