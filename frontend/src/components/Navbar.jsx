import React from 'react';
import { Cpu, Sun, Moon } from 'lucide-react'; // Importing icons from lucide-react

const Navbar = ({ darkMode, toggleDarkMode }) => {
    return (
      <nav className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
        <div className="flex items-center space-x-2 ml-16">
          <Cpu className="h-6 w-6 text-purple-600" />
          <h1 className="text-xl font-bold">
            <span className="text-purple-600">GPU</span> <span className="text-teal-500"> Recommender</span>
          </h1>
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-400">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </nav>
    );
  };

export default Navbar;