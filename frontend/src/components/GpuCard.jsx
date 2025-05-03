import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const GpuCard = ({
  gpu,
  requirements,
  explanation,
  darkMode,
  isRecommended
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = () => {
    toast.success("Request sent successfully", {
      autoClose: 3000,
      hideProgressBar: true,
    });
    setRequested(true);
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg mb-6 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
      {isRecommended && (
        <div className="bg-purple-600 text-white py-1 px-4 text-xs font-semibold text-right">
          Recommended
        </div>
      )}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <Cpu className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h2 className="text-xl font-bold">
            NVIDIA {gpu.resource_class?.toUpperCase()} GPU Machine
          </h2>
        </div>

        {/* Description */}
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{gpu.description}</p>

        {/* Pricing */}
        <div className={`p-4 rounded-md mb-4 ${darkMode ? 'bg-teal-800 bg-opacity-30' : 'bg-teal-100'}`}>
          <div className="flex justify-between">
            <div>
              <span className={`text-2xl font-bold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>${gpu.price_per_hour?.toFixed(2)}</span>
              <span className={`text-sm ${darkMode ? 'text-teal-200' : 'text-teal-600'}`}>/hr</span>
            </div>
            <div className={`text-sm ${darkMode ? 'text-teal-200' : 'text-teal-600'}`}>${gpu.price_per_month?.toLocaleString()} /month</div>
            <div className={`text-sm ${darkMode ? 'text-teal-200' : 'text-teal-600'}`}>
              {gpu.price_per_year ? `$${gpu.price_per_year.toLocaleString()} /year` : '–'}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><p className="text-sm font-semibold">GPU</p><p>{gpu.gpu_description}</p></div>
          <div><p className="text-sm font-semibold">vCPUs</p><p>{gpu.vcpus}</p></div>
          <div><p className="text-sm font-semibold">Memory</p><p>{gpu.ram} GB</p></div>
          <div><p className="text-sm font-semibold">Region</p><p>{gpu.region}, {gpu.country}</p></div>
        </div>

        {/* Explanation */}
        {requirements && explanation && (
          <div className={`p-4 mb-4 rounded ${darkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
            <p className="italic text-sm"><strong>Requirements:</strong> {requirements}</p>
            <p className="mt-1 text-sm"><strong>Why recommended:</strong> {explanation}</p>
          </div>
        )}

        {/* Extra Details */}
        {showDetails && (
          <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-4 mt-4`}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><p className="text-sm font-semibold">OS</p><p>{gpu.operating_system}</p></div>
              <div><p className="text-sm font-semibold">Spot Price</p><p>${gpu.price_per_spot?.toFixed(2)}/hr</p></div>
              <div><p className="text-sm font-semibold">Resource Type</p><p>{gpu.resource_type}</p></div>
              <div><p className="text-sm font-semibold">Resource Name</p><p>{gpu.resource_name}</p></div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={() => setShowDetails(!showDetails)} className={`flex items-center text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
            {showDetails ? 'Show Less' : 'Show More'}
            {showDetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>
          {!gpu.is_spot && (
            <button
              onClick={handleRequest}
              disabled={requested}
              className={`px-4 py-2 rounded-md font-medium flex items-center ${darkMode ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'} ${requested ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              {requested ? 'Request Sent' : 'Request Spot'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GpuCard;
