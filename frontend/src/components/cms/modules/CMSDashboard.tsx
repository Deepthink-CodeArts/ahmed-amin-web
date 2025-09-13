import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { testAPIConnectivity } from '@/lib/api';
import { projectConfig } from '@/lib/projectConfig';
import { FileText, FileCheck, Calendar, Mail, Users, MapPin, Info, Database, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface CMSDashboardProps {
  setActiveModule?: (module: string) => void;
}

const CMSDashboard = ({ setActiveModule }: CMSDashboardProps) => {
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    setBackendStatus('checking');
    try {
      const result = await testAPIConnectivity();
      if (result.success) setBackendStatus('online');
      else setBackendStatus('offline');
    } catch {
      setBackendStatus('offline');
    }
  };

  const statCards = [
    {
      title: 'Content Management',
      value: 'Ready',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      description: 'CMS System Active'
    },
    {
      title: 'Database',
      value: 'Connected',
      icon: Database,
      color: 'from-purple-500 to-purple-600',
      description: 'PostgreSQL Ready'
    },
    {
      title: 'API Status',
      value: backendStatus === 'online' ? 'Online' : 'Offline',
      icon: FileCheck,
      color: backendStatus === 'online' ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600',
      description: 'Backend API'
    },
    {
      title: 'Admin Panel',
      value: 'Active',
      icon: Settings,
      color: 'from-orange-500 to-orange-600',
      description: 'Management Ready'
    },
    {
      title: 'User Management',
      value: 'Ready',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Role-based Access'
    },
  ];

  // Navigation handler for quick actions
  const handleQuickAction = (module: string) => {
    if (setActiveModule) {
      setActiveModule(module);
    } else {
      console.warn('setActiveModule not provided to CMSDashboard');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{projectConfig.project_display_name} Dashboard</h1>
        <p className="text-gray-600">Welcome to {projectConfig.project_display_name} - {projectConfig.project_description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 bg-gradient-to-br ${stat.color} text-white rounded p-0.5`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Info Card replaces Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">App Version:</span>
                <span>2.1.0</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Status:</span>
                <span className={
                  backendStatus === 'online' ? 'text-green-600' : backendStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
                }>
                  {backendStatus === 'checking' ? 'Checking...' : backendStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Developed by:</span>
                <span>Deepthink CodeArts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Project:</span>
                <span>{projectConfig.project_name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" onClick={() => handleQuickAction('site-management')}>
                <Settings className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-900">Site Settings</span>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors" onClick={() => handleQuickAction('staff')}>
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-900">Manage Staff</span>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors" onClick={() => handleQuickAction('blog')}>
                <FileText className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-orange-900">Content</span>
              </button>
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" onClick={() => handleQuickAction('contacts')}>
                <Mail className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-900">Messages</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CMSDashboard;
