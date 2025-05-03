// Filter form component

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react'; // Importing icons from lucide-react

const FilterForm = ({ darkMode, onFilterChange, spotOnly }) => {
    const [workloadType, setWorkloadType] = useState("Model Training");
    const [modelSize, setModelSize] = useState("Medium (5B-20B parameters)");
    const [datasetSize, setDatasetSize] = useState("Medium (10GB-100GB)");
    const [budgetType, setBudgetType] = useState("Monthly");

    // Calculate the default budget as half of the range
    const getDefaultBudget = (type) => {
        const min = type === "Hourly" ? 1 : type === "Yearly" ? 1200 : 100;
        const max = type === "Hourly" ? 100 : type === "Yearly" ? 50000 : 3000;
        return Math.floor((min + max) / 2);
    };

    const [budget, setBudget] = useState(getDefaultBudget(budgetType));

    useEffect(() => {
        // Reset budget to half of the range when budget type changes
        setBudget(getDefaultBudget(budgetType));
    }, [budgetType]);

    const [region, setRegion] = useState("ap-south-mum-1");

    const handleGenerateRecommendations = () => {
        onFilterChange({
            workloadType,
            modelSize,
            datasetSize,
            budget,
            budgetType,
            region,
        });
    };

    return (
        <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl font-bold mb-4">Find Your Optimal GPU</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Tell us about your workload and we'll recommend the best GPU instances for your needs.
            </p>

            <div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Workload Type</label>
                    <div className={`relative rounded-md border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                        <select 
                            value={workloadType}
                            onChange={(e) => setWorkloadType(e.target.value)}
                            className={`block w-full px-3 py-2 appearance-none rounded-md focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                        >
                            <option>Model Training</option>
                            <option>Inference</option>
                            <option>Computer Vision</option>
                            <option>NLP Processing</option>
                            <option>Data Analytics</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Model Type</label>
                    <div className={`relative rounded-md border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                        <select 
                            value={modelSize}
                            onChange={(e) => setModelSize(e.target.value)}
                            className={`block w-full px-3 py-2 appearance-none rounded-md focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                        >
                            <option>Small (&lt; 5B parameters)</option>
                            <option>Medium (5B-20B parameters)</option>
                            <option>Large (20B-100B parameters)</option>
                            <option>X-Large (&gt; 100B parameters)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Dataset Size</label>
                    <div className={`relative rounded-md border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                        <select 
                            value={datasetSize}
                            onChange={(e) => setDatasetSize(e.target.value)}
                            className={`block w-full px-3 py-2 appearance-none rounded-md focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                        >
                            <option>Small (&lt; 10GB)</option>
                            <option>Medium (10GB-100GB)</option>
                            <option>Large (100GB-1TB)</option>
                            <option>X-Large (&gt; 1TB)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Budget Type</label>
                    <div className={`relative rounded-md border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                        <select 
                            value={budgetType}
                            onChange={(e) => setBudgetType(e.target.value)}
                            className={`block w-full px-3 py-2 appearance-none rounded-md focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                        >
                            <option>Hourly</option>
                            <option>Monthly</option>
                            <option>Yearly</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Monthly Budget (USD)</label>
                    <div className="relative mt-1">
                        <input
                            type="range"
                            min={budgetType === "Hourly" ? 1 : budgetType === "Yearly" ? 1200 : 100}
                            max={budgetType === "Hourly" ? 100 : budgetType === "Yearly" ? 50000 : 3000}
                            step={budgetType === "Hourly" ? 1 : budgetType === "Yearly" ? 100 : 100}
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="gradient-range w-full h-2 rounded-md cursor-pointer"
                            style={{
                                '--range-progress': `${((budget - (budgetType === "Hourly" ? 1 : budgetType === "Yearly" ? 1200 : 100)) /
                                    ((budgetType === "Hourly" ? 100 : budgetType === "Yearly" ? 50000 : 3000) -
                                        (budgetType === "Hourly" ? 1 : budgetType === "Yearly" ? 1200 : 100))) * 100}%`,
                            }}
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span>${budgetType === "Hourly" ? 1 : budgetType === "Yearly" ? 1200 : 100}</span>
                            <span className="font-semibold">${budget}</span>
                            <span>${budgetType === "Hourly" ? 100 : budgetType === "Yearly" ? 50000 : 3000}</span>
                        </div>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Preferred Region</label>
                    <div className={`relative rounded-md border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                        <select 
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className={`block w-full px-3 py-2 appearance-none rounded-md focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                        >
                            <option>us-east-at-1</option>
                            <option>ap-south-mum-1</option>
                            <option>ap-south-del-1</option>
                            <option>ap-south-noi-1</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 pl-0 p-2">
                    <label className="block mb-2 font-medium">Spot GPU Filter:</label>

                    <label className="mr-4">
                        <input
                            className='mr-2'
                            type="radio"
                            name="spot"
                            checked={spotOnly === true}
                            onChange={() => onFilterChange({ spot: true })}
                        />
                        Spot Only
                    </label>

                    <label className="mr-4">
                        <input
                            className='mr-2'
                            type="radio"
                            name="spot"
                            checked={spotOnly === false}
                            onChange={() => onFilterChange({ spot: false })}
                        />
                        Non-Spot Only
                    </label>

                    <button
                        type="button"
                        onClick={() => onFilterChange({ spot: null })}
                        className={`mb-1.5 ml-4 px-4 py-1.5 rounded-md text-sm font-medium 
                            ${darkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 shadow-sm transition'}`}
                    >
                        Reset
                    </button>
                </div>
                
                <button 
                    onClick={handleGenerateRecommendations}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-teal-500 text-white font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                >
                    Generate Recommendations
                </button>
            </div>
        </div>
    );
};

export default FilterForm;