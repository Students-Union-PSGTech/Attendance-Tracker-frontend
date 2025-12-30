import React, { useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  menuItems: MenuItem[];
  user?: { name?: string; username?: string; roll_no?: string } | null;
  onLogout: () => void;
  title?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  menuItems,
  onLogout,
  title = 'Menu'
}) => {
  // Ensure sidebar is open on desktop, closed on mobile on initial load
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint
    onToggle(isDesktop);
  }, []); // Run only on initial mount
  return (
    <>
      {/* Desktop Sidebar Container */}
      <div className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out hidden lg:block flex-shrink-0`}>
        <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-64'
          }`}>
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-slate-800">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h1>
            <button
              onClick={() => onToggle(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="mt-6 px-3 pb-6 overflow-y-auto" style={{ height: 'calc(100vh - 64px - 140px)' }}>
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors ${item.variant === 'danger'
                    ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <span className="mr-3 w-5 h-5 flex-shrink-0">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom section with Theme Toggle and Logout */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
            <div className="flex items-center justify-center mb-4">
              <ThemeToggle />
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
            >
              <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-slate-800">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <button
            onClick={() => onToggle(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="mt-6 px-3 pb-6 overflow-y-auto" style={{ height: 'calc(100vh - 64px - 120px)' }}>
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors ${item.variant === 'danger'
                  ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
              >
                <span className="mr-3 w-5 h-5 flex-shrink-0">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section with Theme Toggle and Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-center mb-4">
            <ThemeToggle />
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
          >
            <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
