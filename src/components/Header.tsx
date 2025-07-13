"use client";

import { Search, User, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onSearchClick: () => void;
  onAuthClick: () => void;
}

export default function Header({ onSearchClick, onAuthClick }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleUserClick = () => {
    if (user) {
      // Show user menu or profile
      onAuthClick();
    } else {
      // Show auth modal
      onAuthClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Vind
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onSearchClick}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleUserClick}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-white text-sm hidden sm:block">
                  {user.displayName}
                </span>
              </button>
              <button 
                onClick={logout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleUserClick}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
