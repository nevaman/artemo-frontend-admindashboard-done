import React, { useState } from 'react';
import type { AdminUser } from '../types';
import { PlusIcon, EditIcon, TrashIcon, UsersIcon, UserPlusIcon } from './Icons';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      email: 'admin@artemo.ai',
      name: 'Admin User',
      role: 'admin',
      active: true,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'user',
      active: true,
      createdAt: '2024-02-01T14:30:00Z',
    },
    {
      id: '3',
      email: 'sarah@example.com',
      name: 'Sarah Smith',
      role: 'user',
      active: false,
      createdAt: '2024-02-10T09:15:00Z',
    },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'user' | 'admin',
    active: true,
  });

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ email: '', name: '', role: 'user', active: true });
    setModalOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      const newUser: AdminUser = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, active: !user.active } : user
    ));
  };

  const promoteUser = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } : user
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Users
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85 transition-opacity"
        >
          <UserPlusIcon className="w-4 h-4" />
          Invite User
        </button>
      </div>

      <div className="bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light-bg-sidebar dark:bg-dark-bg-sidebar">
              <tr>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">User</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Role</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Status</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Created</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-light-border dark:border-dark-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-accent text-text-on-accent flex items-center justify-center font-semibold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-light-text-primary dark:text-dark-text-primary">
                          {user.name}
                        </div>
                        <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="px-2 py-1 text-xs rounded-md bg-light-bg-sidebar dark:bg-dark-bg-page text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                      >
                        {user.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => promoteUser(user.id)}
                        className="px-2 py-1 text-xs rounded-md bg-light-bg-sidebar dark:bg-dark-bg-page text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                      >
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-primary-accent hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page rounded-md"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
                {editingUser ? 'Edit User' : 'Invite User'}
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
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                  className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
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
                {editingUser ? 'Update' : 'Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};