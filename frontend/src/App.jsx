// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GpuOptimiserApp from './pages/GpuOptimizerApp';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GpuOptimiserApp />} />
      </Routes>
    </Router>
  );
};

export default App;
