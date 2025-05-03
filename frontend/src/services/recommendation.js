// services/recommendation.js - GPU recommendation engine

// Knowledge base for GPU recommendations
const KNOWLEDGE_BASE = {
    // GPU Types
    "H100": {
      description: "NVIDIA's flagship GPU with exceptional AI training performance.",
      strengths: "Best for large model training, highest memory bandwidth, and fastest matrix operations.",
      typical_workloads: "Large Language Models, scientific simulations, AI research"
    },
    "A100": {
      description: "High-performance GPU for AI training and inference.",
      strengths: "Excellent tensor performance, large memory options (40GB/80GB), and multi-instance capability.",
      typical_workloads: "LLM training, computer vision, NLP, high-performance computing"
    },
    "L40S": {
      description: "Optimized for AI inference and professional graphics.",
      strengths: "Good balance of ML performance and power efficiency, ray tracing capabilities.",
      typical_workloads: "AI inference, rendering, computer vision"
    },
    "A30": {
      description: "Mid-tier AI training and inference optimized GPU.",
      strengths: "Cost-effective for medium workloads with good tensor performance.",
      typical_workloads: "Mid-size model training, inference, data analytics"
    },
    "A10G": {
      description: "Cost-effective GPU for inference and small-scale training.",
      strengths: "Good price-to-performance ratio for inference workloads.",
      typical_workloads: "AI inference, small model training, video processing"
    },
  
    // Workload Types
    "Model Training": {
      requirements: "High memory capacity, tensor core performance, memory bandwidth",
      best_gpus: ["H100", "A100", "A30"],
      explanation: "Training models requires substantial GPU memory and high memory bandwidth to handle large parameter counts and batch sizes efficiently."
    },
    "Inference": {
      requirements: "Balanced compute and memory, good tensor core performance",
      best_gpus: ["A100", "L40S", "A10G"],
      explanation: "Inference typically requires less GPU memory than training but still benefits from good tensor core performance for matrix operations."
    },
    "Computer Vision": {
      requirements: "Balanced compute and memory, moderate tensor core usage",
      best_gpus: ["A100", "A30", "L40S"],
      explanation: "Computer vision tasks benefit from balanced GPU resources with good tensor core performance for convolutional operations."
    },
    "NLP Processing": {
      requirements: "High memory capacity, good memory bandwidth",
      best_gpus: ["A100", "H100", "A30"],
      explanation: "NLP processing often involves transformer models requiring high memory capacity and bandwidth."
    },
    "Data Analytics": {
      requirements: "High memory bandwidth, moderate memory capacity",
      best_gpus: ["A30", "A10G", "L40S"],
      explanation: "Data analytics benefits from fast memory access and good computational throughput."
    }
  };
  
  /**
   * Generate recommendations based on user input and available GPUs
   * @param {Object} userInput - User's workload specifications from the form
   * @param {Array} availableGpus - Available GPU instances from the API
   * @returns {Array} - Sorted and scored GPU recommendations
   */
  function recommendGpus(userInput, availableGpus) {
    console.log("Generating recommendations with:", { userInput, availableGpusCount: availableGpus.length });
    
    const { workloadType, modelSize, datasetSize, budget, budgetType, region, spot } = userInput;
    
    // Convert budget to hourly rate for comparison
    const hourlyBudget = convertToHourlyBudget(budget, budgetType);
    
    // Get workload info from knowledge base
    const workloadInfo = KNOWLEDGE_BASE[workloadType] || {
      requirements: "Balanced resources",
      best_gpus: ["A100", "A30"],
      explanation: "General workload requiring balanced GPU resources"
    };
    
    // Calculate estimated memory requirement
    const memoryRequired = calculateMemoryRequirement(workloadType, modelSize, datasetSize);
    console.log(`Estimated memory requirement: ${memoryRequired}GB`);
    
    const recommendations = [];
    
    // Process each GPU instance
    for (const gpu of availableGpus) {
      // Skip if spot filter is applied and doesn't match
      if (spot === true && gpu.is_spot !== 1) continue;
      if (spot === false && gpu.is_spot !== 0) continue;
      
      // Extract GPU details
      const gpuType = extractGpuType(gpu.gpu_description || '');
      const gpuMemory = extractGpuMemory(gpu.gpu_description || '');
      
      // Check if within budget
      const hourlyPrice = gpu.is_spot ? (gpu.price_per_spot || 0) : (gpu.price_per_hour || 0);
      if (hourlyPrice > hourlyBudget) {
        continue; // Skip if exceeds budget
      }
      
      // Score the GPU based on workload match
      const scoreDetails = scoreGpuForWorkload(gpu, {
        workloadType,
        modelSize,
        datasetSize,
        memoryRequired,
        workloadInfo,
        gpuType,
        gpuMemory
      });
      
      // Generate explanation
      const explanation = generateExplanation(gpu, userInput, scoreDetails, gpuType, gpuMemory);
      
      // Add to recommendations if score is positive
      if (scoreDetails.totalScore > 0) {
        recommendations.push({
          gpu,
          score: Math.min(Math.floor(scoreDetails.totalScore / 2), 3), // Normalize to 0-3 range
          explanation,
          details: scoreDetails
        });
      }
    }
    
    // Sort recommendations by score (descending), then by price (ascending)
    const sortedRecommendations = recommendations.sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort by price
      const aPrice = a.gpu.is_spot ? (a.gpu.price_per_spot || 0) : (a.gpu.price_per_hour || 0);
      const bPrice = b.gpu.is_spot ? (b.gpu.price_per_spot || 0) : (b.gpu.price_per_hour || 0);
      return aPrice - bPrice;
    });
    
    return sortedRecommendations;
  }
  
  /**
   * Convert budget to hourly rate
   */
  function convertToHourlyBudget(budget, budgetType) {
    switch (budgetType) {
      case "Hourly":
        return budget;
      case "Monthly":
        return budget / (30 * 24); // 30 days * 24 hours
      case "Yearly":
        return budget / (365 * 24); // 365 days * 24 hours
      default:
        return budget / (30 * 24); // Default to monthly
    }
  }
  
  /**
   * Calculate memory requirements based on workload characteristics
   */
  function calculateMemoryRequirement(workloadType, modelSize, datasetSize) {
    // Base memory requirement (in GB)
    let memoryGB = 8;
    
    // Model size adjustments
    switch (modelSize) {
      case "Small (< 5B parameters)":
        memoryGB = 8;
        break;
      case "Medium (5B-20B parameters)":
        memoryGB = 16;
        break;
      case "Large (20B-100B parameters)":
        memoryGB = 32;
        break;
      case "X-Large (> 100B parameters)":
        memoryGB = 64;
        break;
    }
    
    // Workload type adjustments
    switch (workloadType) {
      case "Model Training":
        memoryGB *= 1.5; // Training needs more memory
        break;
      case "NLP Processing":
        memoryGB *= 1.3; // NLP typically needs more memory
        break;
      case "Computer Vision":
        memoryGB *= 1.2; // CV can be memory intensive
        break;
      case "Inference":
        memoryGB *= 0.8; // Inference typically needs less memory
        break;
    }
    
    // Dataset size adjustments
    switch (datasetSize) {
      case "Small (< 10GB)":
        break; // No adjustment
      case "Medium (10GB-100GB)":
        memoryGB *= 1.2;
        break;
      case "Large (100GB-1TB)":
        memoryGB *= 1.5;
        break;
      case "X-Large (> 1TB)":
        memoryGB *= 2;
        break;
    }
    
    return Math.ceil(memoryGB);
  }
  
  /**
   * Score a GPU based on its match to workload requirements
   */
  function scoreGpuForWorkload(gpu, params) {
    const { workloadType, memoryRequired, workloadInfo, gpuType, gpuMemory } = params;
    
    // Initialize score components
    const scores = {
      memoryMatch: 0,
      gpuTypeMatch: 0,
      performanceMatch: 0,
      costEfficiency: 0
    };
    
    // Memory Score
    if (gpuMemory >= memoryRequired * 1.5) {
      scores.memoryMatch = 3;  // Excellent
    } else if (gpuMemory >= memoryRequired) {
      scores.memoryMatch = 2;  // Good
    } else if (gpuMemory >= memoryRequired * 0.7) {
      scores.memoryMatch = 1;  // Acceptable but tight
    }
    
    // GPU Type Match
    if (workloadInfo.best_gpus && workloadInfo.best_gpus.includes(gpuType)) {
      scores.gpuTypeMatch = 3;
    } else if (gpuType === "A100" || gpuType === "H100") {
      scores.gpuTypeMatch = 2; // These are generally good for most ML workloads
    } else if (gpuType === "A30" || gpuType === "L40S") {
      scores.gpuTypeMatch = 1; // Generally decent for most workloads
    }
    
    // Performance match (based on vCPUs as a proxy if tensor cores not available)
    if (gpu.vcpus >= 16) {
      scores.performanceMatch = 3;
    } else if (gpu.vcpus >= 8) {
      scores.performanceMatch = 2;
    } else if (gpu.vcpus >= 4) {
      scores.performanceMatch = 1;
    }
    
    // Cost efficiency score
    const hourlyPrice = gpu.is_spot ? (gpu.price_per_spot || 0) : (gpu.price_per_hour || 0);
    if (hourlyPrice > 0) {
      // Performance per dollar - approximation using vCPUs
      const performancePerDollar = gpu.vcpus / hourlyPrice;
      if (performancePerDollar > 4) {
        scores.costEfficiency = 3;
      } else if (performancePerDollar > 2) {
        scores.costEfficiency = 2;
      } else {
        scores.costEfficiency = 1;
      }
    }
    
    // Weights for different factors based on workload type
    const weights = getWorkloadWeights(workloadType);
    
    // Calculate weighted total
    const totalScore =
      scores.memoryMatch * weights.memory +
      scores.gpuTypeMatch * weights.gpuType +
      scores.performanceMatch * weights.performance +
      scores.costEfficiency * weights.cost;
    
    return {
      ...scores,
      totalScore,
      weights
    };
  }
  
  /**
   * Get weights for different scoring factors based on workload
   */
  function getWorkloadWeights(workloadType) {
    // Default weights
    const weights = {
      memory: 1,
      gpuType: 1,
      performance: 1,
      cost: 1
    };
    
    // Adjust weights based on workload type
    switch (workloadType) {
      case "Model Training":
        weights.memory = 2;
        weights.performance = 1.5;
        weights.cost = 0.5;
        break;
      case "Inference":
        weights.memory = 1;
        weights.performance = 1.5;
        weights.cost = 1.5;
        break;
      case "Computer Vision":
        weights.memory = 1;
        weights.performance = 2;
        weights.cost = 1;
        break;
      case "NLP Processing":
        weights.memory = 2;
        weights.performance = 1.5;
        weights.cost = 0.5;
        break;
      case "Data Analytics":
        weights.memory = 1;
        weights.performance = 1;
        weights.cost = 2;
        break;
    }
    
    return weights;
  }
  
  /**
   * Generate a detailed explanation for the recommendation
   */
  function generateExplanation(gpu, userInput, scoreDetails, gpuType, gpuMemory) {
    const { workloadType, modelSize, datasetSize } = userInput;
    const gpuInfo = KNOWLEDGE_BASE[gpuType] || { 
      description: "GPU suitable for various workloads",
      strengths: "balanced performance"
    };
    const workloadInfo = KNOWLEDGE_BASE[workloadType] || {};
    
    // Build comprehensive explanation
    let explanation = `The ${gpu.resource_name} with ${gpu.gpu_description || ''} is `;
    
    // Rate the match quality
    if (scoreDetails.totalScore > 8) {
      explanation += "an excellent match";
    } else if (scoreDetails.totalScore > 6) {
      explanation += "a strong match";
    } else if (scoreDetails.totalScore > 4) {
      explanation += "a good match";
    } else {
      explanation += "a suitable match";
    }
    
    explanation += ` for your ${workloadType.toLowerCase()} workload using ${modelSize} models.`;
    
    // Add workload-specific context
    if (workloadInfo.explanation) {
      explanation += " " + workloadInfo.explanation;
    }
    
    // Highlight GPU strengths
    if (gpuInfo.strengths) {
      explanation += ` This GPU ${gpuInfo.strengths.charAt(0).toLowerCase() + gpuInfo.strengths.slice(1)}.`;
    }
    
    // Add memory context if it's a key factor
    const memoryRequired = calculateMemoryRequirement(workloadType, modelSize, datasetSize);
    explanation += ` With ${gpuMemory}GB of memory, it ${
      gpuMemory >= memoryRequired * 1.2 
        ? "provides ample headroom" 
        : gpuMemory >= memoryRequired
          ? "meets the requirements"
          : "may be constrained"
    } for your dataset size.`;
    
    // Add pricing context
    const hourlyPrice = gpu.price_per_hour || 0;
    const spotPrice = gpu.price_per_spot || 0;
    
    if (gpu.is_spot && spotPrice > 0 && hourlyPrice > 0) {
      const savings = ((hourlyPrice - spotPrice) / hourlyPrice * 100).toFixed(0);
      explanation += ` Using this spot instance can save you approximately ${savings}% compared to on-demand pricing.`;
    }
    
    return explanation;
  }
  
  /**
   * Helper function to extract GPU type from description
   */
  function extractGpuType(description) {
    if (!description) return "Unknown";
    
    const gpuMatches = {
      "A100": "A100",
      "H100": "H100",
      "A30": "A30",
      "A10G": "A10G",
      "A10": "A10G", // Mapping A10 to A10G for simplicity
      "L40S": "L40S",
      "L4": "L4",
      "V100": "V100",
      "T4": "T4",
      "RTX": "RTX"
    };
    
    for (const [key, value] of Object.entries(gpuMatches)) {
      if (description.includes(key)) {
        return value;
      }
    }
    
    return "Unknown";
  }
  
  /**
   * Helper function to extract GPU memory from description
   */
  function extractGpuMemory(description) {
    if (!description) return 16; // Default assumption
    
    // Look for patterns like "40GB" or "24 GB"
    const memoryMatch = description.match(/(\d+)\s*GB/i);
    if (memoryMatch && memoryMatch[1]) {
      return parseInt(memoryMatch[1], 10);
    }
    
    // If no match found, make estimates based on GPU type
    if (description.includes("A100")) return 40;
    if (description.includes("H100")) return 80;
    if (description.includes("A30")) return 24;
    if (description.includes("A10G")) return 24;
    if (description.includes("L40S")) return 48;
    
    return 16; // Default assumption
  }
  
  export { recommendGpus };