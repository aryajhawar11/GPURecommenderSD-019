import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import FilterForm from '../components/FilterForm';
import GpuCard from '../components/GpuCard';
import axios from 'axios';

// GpuOptimizerApp.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Inside return (bottom, just before closing div):



// 1. Expanded KNOWLEDGE_BASE to include "L4" & "RTX" types,
//    and to match exactly the workloadType strings from the form.
const KNOWLEDGE_BASE = {
  "Model Training": {
    best_gpus: ["H100", "A100", "A30", "RTX"],
    requirements: "High memory capacity, tensor core performance, memory bandwidth",
    explanation:
      "Training models requires substantial GPU memory and high memory bandwidth to handle large parameter counts and batch sizes efficiently."
  },
  "Inference": {
    best_gpus: ["A100", "L40S", "A10G", "L4", "RTX"],
    requirements: "Balanced compute and memory, good tensor core performance",
    explanation:
      "Inference typically requires less GPU memory than training but still benefits from good tensor core performance for matrix operations."
  },
  "Computer Vision": {
    best_gpus: ["A100", "A30", "L40S", "RTX"],
    requirements: "Balanced compute and memory, moderate tensor core usage",
    explanation:
      "Computer vision tasks benefit from balanced GPU resources with good tensor core performance for convolutional operations."
  },
  "NLP Processing": {
    best_gpus: ["A100", "H100", "A30", "RTX"],
    requirements: "High memory capacity, good memory bandwidth",
    explanation:
      "NLP processing often involves transformer models requiring high memory capacity and bandwidth."
  },
  "Data Analytics": {
    best_gpus: ["A30", "A10G", "L40S", "RTX"],
    requirements: "High memory bandwidth, moderate memory capacity",
    explanation:
      "Data analytics benefits from fast memory access and good computational throughput."
  }
};

// 2. Simplified extractor that looks for those exact tokens:
function extractGpuType(description = "") {
  const desc = description.toUpperCase();
  const types = ["H100","A100","A30","A10G","L40S","L4","RTX"];
  for (let t of types) {
    if (desc.includes(t)) return t;
  }
  return "Unknown";
}

export default function GpuOptimizerApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState("ap-south-mum-1");
  const [spotOnly, setSpotOnly] = useState(null);
  const [recommendationInput, setRecommendationInput] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Fetch GPU list whenever region changes
  useEffect(() => {
    const fetchGpuData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `https://customer.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances&region=${region}`
        );
        // API sometimes wraps data in .data
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setGpus(list);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch GPU data.");
        setGpus([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGpuData();
  }, [region]);

  // Handle all filter callbacks from FilterForm
  const handleFilterChange = (filters) => {
    // region change re‐fetches
    if (filters.region) setRegion(filters.region);
    // spot filter
    if (filters.spot !== undefined) setSpotOnly(filters.spot);
    // "Generate Recommendations" click yields workloadType etc.
    if (filters.workloadType) {
      setRecommendationInput(filters);
    }
  };

  // Core filter/recommend logic
  const filterAndRecommend = () => {
    if (!recommendationInput) return [];

    const { workloadType, budget, budgetType } = recommendationInput;
    const kb = KNOWLEDGE_BASE[workloadType];
    if (!kb) return [];

    return gpus
      // 1) Spot vs on-demand
      .filter(gpu => {
        if (spotOnly === true) return gpu.is_spot === 1;
        if (spotOnly === false) return gpu.is_spot === 0;
        return true;
      })
      // 2) Workload‐type match
      .filter(gpu => {
        const type = extractGpuType(gpu.gpu_description);
        return kb.best_gpus.includes(type);
      })
      // 3) Budget constraint
      .filter(gpu => {
        let price;
        if (budgetType === "Hourly") price = gpu.price_per_hour;
        else if (budgetType === "Yearly") price = gpu.price_per_year;
        else price = gpu.price_per_month;
        return typeof price === "number" && price <= budget;
      })
      // 4) Sort by cheapest first (spot if available)
      .sort((a, b) => {
        const aPrice = a.is_spot ? a.price_per_spot : a.price_per_hour;
        const bPrice = b.is_spot ? b.price_per_spot : b.price_per_hour;
        return aPrice - bPrice;
      })
      // 5) Attach the explanation & requirements from KB
      .map(gpu => ({
        instance: gpu,
        requirements: kb.requirements,
        explanation: kb.explanation
      }));
  };

  const displayed = filterAndRecommend();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <Header darkMode={darkMode} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FilterForm
              darkMode={darkMode}
              onFilterChange={handleFilterChange}
              spotOnly={spotOnly}
            />
          </div>
          <div className="lg:col-span-2">
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Recommended GPUs for Your Workload
            </h2>

            {loading ? (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="inline-block animate-spin rounded-full border-4 border-current border-r-transparent h-8 w-8 mr-2" />
                <span>Loading GPU recommendations...</span>
              </div>

            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>

            ) : !recommendationInput ? (
              <div className="text-center py-8 text-gray-500">
                Complete the form and click “Generate Recommendations” to see results.
              </div>

            ) : displayed.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No GPUs match your criteria.
              </div>

            ) : (
              displayed.map((rec, i) => (
                <GpuCard
                  key={rec.instance.resource_name || i}
                  gpu={rec.instance}
                  requirements={rec.requirements}
                  explanation={rec.explanation}
                  darkMode={darkMode}
                  isRecommended={i === 0}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar
  newestOnTop={false}
  closeOnClick
  pauseOnHover
/>
    </div>
  );
}
