// src/pages/LandingPage.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <HeroSection darkMode={darkMode} />
      <FeaturesSection darkMode={darkMode} />
    </div>
  );
}