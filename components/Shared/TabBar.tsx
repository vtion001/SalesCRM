import React from 'react';

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = 'border-b border-gray-200',
}) => (
  <div className={`flex ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-colors relative ${
          activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {tab}
        {activeTab === tab && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
        )}
      </button>
    ))}
  </div>
);
