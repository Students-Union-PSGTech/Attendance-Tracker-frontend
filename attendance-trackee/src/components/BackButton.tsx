import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-950 ${className}`}
      aria-label={label || 'Go back'}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default BackButton;
