// src/components/FeaturesSection.jsx
import React from 'react';

export default function FeaturesSection({ darkMode }) {
  const features = [
    {
      title: "Workload Optimized",
      description: "Get recommendations tailored specifically to your model training, inference, or data processing needs.",
      icon: (
        <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
          </svg>
        </div>
      )
    },
    {
      title: "Performance Focused",
      description: "Find GPUs that deliver the exact performance requirements for your specific ML/AI tasks.",
      icon: (
        <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      )
    },
    {
      title: "Budget Friendly",
      description: "Control costs with recommendations that match your budget constraints, whether hourly or monthly.",
      icon: (
        <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
      )
    },
    {
      title: "Data-Driven Insights",
      description: "Make informed decisions based on actual performance metrics and cost-efficiency analysis.",
      icon: (
        <div className={`p-3 rounded-full ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
            <path d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5" />
            <polyline points="7 10 12 15 17 10" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <section id="features" className={`py-24 px-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl font-bold text-center mb-4 bg-clip-text text-transparent ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}>
          Why Choose Our GPU Recommender
        </h2>
        
        <p className={`text-xl text-center mx-auto max-w-3xl mb-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Our intelligent system analyzes your specific requirements to find the perfect GPU match
          for your needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              } transition-colors shadow-lg`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}