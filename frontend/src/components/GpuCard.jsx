// GPU Card component
import { Cpu } from 'lucide-react';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const GpuCard = ({ gpu, darkMode, isRecommended }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg mb-6 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
      {isRecommended && (
        <div className="bg-purple-600 text-white py-1 px-4 text-xs font-semibold text-right">
          Recommended
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <Cpu className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h2 className="text-xl font-bold">NVIDIA {gpu.resource_class.toUpperCase()} GPU Machine</h2>
        </div>

        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {gpu.description}
        </p>

        <div className={`p-4 rounded-md mb-4 ${darkMode ? 'bg-teal-800 bg-opacity-30' : 'bg-teal-100'}`}>
          <div className="items-center justify-between">
            <div>
              <span className={`text-2xl font-bold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                ${Number(gpu.price_per_hour).toFixed(2)}
              </span>
              <span className={`text-sm ${darkMode ? 'text-teal-200' : 'text-teal-600'}`}>/hr</span>
            </div>
            <div className={`text-sm ${darkMode ? 'text-teal-200' : 'text-teal-600'}`}>
             $ {Number(gpu.price_per_month).toFixed(2)}/month
            </div>
            <div className={`text-sm ${darkMode ? 'text-teal-200' : 'text-teal-600'}`}>
              {gpu.price_per_year ? `${"$ " + Number(gpu.price_per_year).toFixed(2)} /year` : "-"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>GPU</p>
            <p className="font-medium">{gpu.gpu_description}</p>
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>vCPUs</p>
            <p className="font-medium">{gpu.vcpus}</p>
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Memory</p>
            <p className="font-medium">{gpu.ram} GB RAM</p>
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Region</p>
            <p className="font-medium">{gpu.region.charAt(0).toUpperCase() + gpu.region.slice(1)}, {gpu.country.charAt(0).toUpperCase() + gpu.country.slice(1)}</p>
          </div>
        </div>

        {showDetails && (
          <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-4 mt-4`}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>OS</p>
                <p className="font-medium">{gpu.operating_system.charAt(0).toUpperCase() + gpu.operating_system.slice(1)}</p>
              </div>
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Spot Price</p>
                <p className="font-medium">${gpu.price_per_spot}/hr</p>
              </div>
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Resource Type</p>
                <p className="font-medium">{gpu.resource_type.toUpperCase()}</p>
              </div>
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Resource Name</p>
                <p className="font-medium">{gpu.resource_name}</p>
              </div>
            </div>
          </div>
        )}
          
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className={`flex items-center text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}
          >
            {showDetails ? 'Show Less' : 'Show More'}
            {showDetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>

          {gpu.is_spot === 1 ? ("") : (
            <button className={`px-4 py-2 rounded-md font-medium flex items-center ${darkMode ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
              <AlertTriangle className="h-4 w-4 mr-1" /> Request Spot
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GpuCard;