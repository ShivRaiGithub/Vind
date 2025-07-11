"use client";

import { Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          Vind
        </h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <User className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
