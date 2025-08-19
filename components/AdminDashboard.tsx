import React from 'react';
import { BoxIcon, UsersIcon, SettingsIcon, ActivityIcon } from './Icons';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Tools', value: '42', icon: BoxIcon, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Active Users', value: '1,234', icon: UsersIcon, color: 'text-green-600 dark:text-green-400' },
    { label: 'Categories', value: '8', icon: SettingsIcon, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Usage Today', value: '567', icon: ActivityIcon, color: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Admin Dashboard
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Manage your Artemo AI platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-lg">
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="font-serif text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
              { action: 'Tool "Email Writer" updated', user: 'admin@artemo.ai', time: '15 minutes ago' },
              { action: 'Category "Ad Copy" reordered', user: 'admin@artemo.ai', time: '1 hour ago' },
              { action: 'User promoted to admin', user: 'sarah@example.com', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {activity.action}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    by {activity.user}
                  </p>
                </div>
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};