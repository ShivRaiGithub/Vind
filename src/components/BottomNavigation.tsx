"use client";

import { Home as HomeIcon, Search, PlusCircle, Upload, User } from "lucide-react";
import { useState } from "react";

interface BottomNavigationProps {
  onUploadClick?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
}

export default function BottomNavigation({ 
  onUploadClick, 
  onSearchClick, 
  onProfileClick 
}: BottomNavigationProps) {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: HomeIcon, label: "Home", onClick: () => setActiveTab("home") },
    { id: "search", icon: Search, label: "Search", onClick: onSearchClick },
    { id: "create", icon: PlusCircle, label: "Create", isSpecial: true, onClick: onUploadClick },
    { id: "upload", icon: Upload, label: "Upload", onClick: onUploadClick },
    { id: "profile", icon: User, label: "Profile", onClick: onProfileClick },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800 z-50">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  item.onClick?.();
                }}
                className="vind-gradient p-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Icon className="w-6 h-6 text-black" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                item.onClick?.();
              }}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "text-white bg-white/10" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
