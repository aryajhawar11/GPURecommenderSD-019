// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GpuOptimiserApp from './pages/GpuOptimizerApp';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gpu-optimizer" element={<GpuOptimiserApp />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
