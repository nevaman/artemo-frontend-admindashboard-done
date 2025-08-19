import React, { useState } from 'react';
import type { AdminCategory } from '../types';
import { PlusIcon, EditIcon, TrashIcon, SettingsIcon } from './Icons';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([
    { id: '1', name: 'Ad Copy', displayOrder: 1, active: true },
    { id: '2', name: 'Email Copy', displayOrder: 2, active: true },
    { id: '3', name: 'Long Form Content', displayOrder: 3, active: true },
    { id: '4', name: 'Client Management', displayOrder: 4, active: true },
    { id: '5', name: 'Copy Improvement', displayOrder: 5, active: true },
    { id: '6', name: 'Sales & Funnel Copy', displayOrder: 6, active: true },
    { id: '7', name: 'Podcast Tools', displayOrder: 7, active: true },
    { id: '8', name: 'Other', displayOrder: 8, active: true },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formData, setFormData] = useState({ name: '', active: true });

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', active: true });
    setModalOpen(true);
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setFormData({ name: category.name, active: category.active });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: formData.name, active: formData.active }
          : cat
      ));
    } else {
      const newCategory: AdminCategory = {
        id: Date.now().toString(),
        name: formData.name,
        displayOrder: categories.length + 1,
        active: formData.active,
      };
      setCategories(prev => [...prev, newCategory]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const moveCategory = (id: string, direction: 'up' | 'down') => {
    setCategories(prev => {
      const sorted = [...prev].sort((a, b) => a.displayOrder - b.displayOrder);
      const index = sorted.findIndex(cat => cat.id === id);
      
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === sorted.length - 1)) {
        return prev;
      }

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [sorted[index], sorted[newIndex]] = [sorted[newIndex], sorted[index]];
      
      return sorted.map((cat, idx) => ({ ...cat, displayOrder: idx + 1 }));
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Categories
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Manage tool categories and their display order
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light-bg-sidebar dark:bg-dark-bg-sidebar">
              <tr>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Order</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Name</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Status</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.sort((a, b) => a.displayOrder - b.displayOrder).map((category) => (
                <tr key={category.id} className="border-t border-light-border dark:border-dark-border">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                        {category.displayOrder}
                      </span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => moveCategory(category.id, 'up')}
                          className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary hover:text-primary-accent"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveCategory(category.id, 'down')}
                          className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary hover:text-primary-accent"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <SettingsIcon className="w-5 h-5 text-primary-accent" />
                      <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-primary-accent hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page rounded-md"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-red-500 hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page rounded-md"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-bg-component dark:bg-dark-bg-component rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-light-border dark:border-dark-border">
              <h3 className="font-serif text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                  placeholder="Category name"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Active
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-light-border dark:border-dark-border flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85 transition-opacity"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};