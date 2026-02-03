import React from 'react';
import { Search } from 'lucide-react';

/**
 * SearchBar - Atom component for header search
 * Pure UI component with no business logic
 */
export const SearchBar: React.FC = () => {
    return (
        <div className="flex-1 max-w-xl">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search leads, contacts, or deals... (⌘K)"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 rounded-2xl text-sm font-medium transition-all outline-none text-slate-900 placeholder:text-slate-400"
                />
            </div>
        </div>
    );
};
