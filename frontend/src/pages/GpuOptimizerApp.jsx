import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import FilterForm from '../components/FilterForm';
import GpuCard from '../components/GpuCard';
import axios from 'axios';

export default function GpuOptimizerApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState("ap-south-mum-1"); // default region
  const [spotOnly, setSpotOnly] = useState(null); // null = no filter


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchGpuData = async (regionParam) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://dev-portal.openstack.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances&region=${regionParam}`
      );
      const gpuList = Array.isArray(res.data) ? res.data : res.data.data || [];
      setGpus(gpuList);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch GPU data.");
      setGpus([]); // prevent .map error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGpuData(region);
  }, [region]);

  const handleFilterChange = (filterData) => {
    if (filterData.region) setRegion(filterData.region);
    if (filterData.spot !== undefined) setSpotOnly(filterData.spot);
  };

  const displayedGpus = [...gpus]
  .sort((a, b) => {
    const aSpot = a.is_spot ? 1 : 0;
    const bSpot = b.is_spot ? 1 : 0;
    return bSpot - aSpot;
  })
  .filter(gpu => {
    if (spotOnly === true) return gpu.is_spot === 1;
    if (spotOnly === false) return gpu.is_spot === 0;
    return true;
  });

  console.log("spotOnly:", spotOnly);
console.log("Filtered GPUs:", displayedGpus);





  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <Header darkMode={darkMode} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FilterForm darkMode={darkMode} onFilterChange={handleFilterChange} spotOnly={spotOnly} />
          </div>
          <div className="lg:col-span-2">
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Recommended GPUs for Your Workload
            </h2>
            {loading ? (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent h-8 w-8 mr-2 align-middle"></div>
                <span>Loading GPU recommendations...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <div>
                {displayedGpus.map((gpu, index) => (
                  <GpuCard
                    key={gpu.id || index}
                    gpu={gpu}
                    darkMode={darkMode}
                    isRecommended={index === 0}
                  />
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
