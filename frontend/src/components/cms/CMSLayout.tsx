import React, { useState, useEffect } from 'react';
import CMSSidebar from './CMSSidebar';
import CMSDashboard from './modules/CMSDashboard';
import SiteManagementModule from './modules/SiteManagementModule';
import BlogModule from './modules/BlogModule';
import ContactsModule from './modules/ContactsModule';
import StaffModule from './modules/StaffModule';

const CMSLayout = () => {
  // Get saved active module from localStorage or default to dashboard
  const [activeModule, setActiveModule] = useState(() => {
    const saved = localStorage.getItem('cms_active_module');
    return saved || 'dashboard';
  });

  // Save active module to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cms_active_module', activeModule);
    console.log('CMS active module saved:', activeModule);
  }, [activeModule]);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <CMSDashboard setActiveModule={setActiveModule} />;
      case 'site-management':
        return <SiteManagementModule />;
      case 'blog':
        return <BlogModule />;
      case 'contacts':
        return <ContactsModule />;
      case 'staff':
        return <StaffModule />;
      default:
        return <CMSDashboard setActiveModule={setActiveModule} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CMSSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 overflow-auto">
        {renderModule()}
      </div>
    </div>
  );
};

export default CMSLayout;
