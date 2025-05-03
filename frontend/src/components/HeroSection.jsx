// src/components/HeroSection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection({ darkMode }) {
  return (
    <section className="max-w-6xl mx-auto text-center py-16 px-4">
      <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'
      }`}>
        Find Your Optimal GPU
      </h1>
      
      <p className={`text-xl mx-auto max-w-3xl mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Get personalized GPU recommendations based on your specific workload, model 
        size, and budget requirements. No more guesswork.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
    <Link to="/gpu-optimizer">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg flex items-center justify-center transition-colors">
          Get Started <ArrowRight className="ml-2" size={18} />
        </button> </Link>
        <button className={`flex items-center justify-center py-3 px-8 rounded-lg ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        } transition-colors`}>
          Learn More <span className="ml-1">›</span>
        </button>
      </div>
      
      <div className="mt-16 relative">
        <div className={`absolute inset-0 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'} rounded-xl transform translate-y-4 translate-x-2 -z-10`}></div>
        <img 
          src="/path/to/your/hero-image.jpg" 
          alt="GPU Recommendation Dashboard" 
          className="rounded-xl shadow-xl mx-auto w-full max-w-4xl"
          onError={(e) => {
            e.target.src = 'https://plus.unsplash.com/premium_photo-1733267068387-727038c4b62e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            e.target.onerror = null;
          }}
        />
      </div>
    </section>
  );
}