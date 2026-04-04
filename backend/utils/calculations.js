// Premium calculation based on various factors
const calculateDynamicPremium = (baseIncome, workingHours, riskFactor = 1, volumeMultiplier = 1) => {
  // Base calculation: 2% of monthly income
  let basePremium = baseIncome * 0.02;
  
  // Adjust by working hours (more hours = higher risk)
  const hourlyAdjustment = workingHours > 40 ? 1.15 : 1.0;
  
  // Apply risk factors
  const riskAdjustment = riskFactor || 1.0;
  
  // Apply volume multiplier
  const volumeAdjustment = volumeMultiplier || 1.0;
  
  // Final premium calculation
  const finalPremium = basePremium * hourlyAdjustment * riskAdjustment * volumeAdjustment;
  
  return Math.round(finalPremium * 100) / 100;
};

// Detect income disruption
// const detectDisruption = (currentWeeklyIncome, averageIncome, threshold = 0.5) => {
//   if (!averageIncome) return false;
  
//   const disruptionPercentage = (averageIncome - currentWeeklyIncome) / averageIncome;
//   return disruptionPercentage > threshold;
// }; 
//update
// Detect income disruption using income + environmental triggers
const detectDisruption = (
  currentWeeklyIncome,
  averageIncome,
  rainfall = 0,
  temperature = 0,
  aqi = 0,
  threshold = 0.5
) => {

  if (!averageIncome) {
    return {
      disrupted: false,
      expectedWeeklyIncome: 0,
      disruptionPercentage: 0
    };
  }

  const disruptionPercentage =
    ((averageIncome - currentWeeklyIncome) / averageIncome) * 100;

  const weatherTrigger = rainfall > 70;
  const heatTrigger = temperature > 40;
  const pollutionTrigger = aqi > 300;

  const disrupted =
    disruptionPercentage > threshold * 100 ||
    weatherTrigger ||
    heatTrigger ||
    pollutionTrigger;

  return {
    disrupted,
    expectedWeeklyIncome: averageIncome,
    disruptionPercentage: disruptionPercentage.toFixed(2)
  };
};//

// Calculate claim payout based on income loss
// const calculateClaimPayout = (incomeBeforeDisruption, incomeAfterDisruption, daysDisrupted, coverageLimit) => {
//   const dailyLoss = (incomeBeforeDisruption - incomeAfterDisruption) / 7; // Assuming weekly data
//   let payout = dailyLoss * daysDisrupted;
  
//   // Ensure payout doesn't exceed coverage limit
//   return Math.min(payout, coverageLimit);
// };
//updates 
// Calculate claim payout based on income loss
const calculateClaimPayout = (
  incomeBeforeDisruption,
  incomeAfterDisruption,
  daysDisrupted,
  coverageLimit
) => {

  const weeklyLoss = incomeBeforeDisruption - incomeAfterDisruption;
const dailyLoss = weeklyLoss / 7;

  let payout = dailyLoss * daysDisrupted;

  if (payout < 0) payout = 0;

  return Math.min(payout, coverageLimit);
};//

//updated one
// Calculate AI risk score based on environment
const calculateRiskScore = (weatherRisk, pollutionRisk, locationRisk) => {
  const w1 = 0.5; // weather weight
  const w2 = 0.3; // pollution weight
  const w3 = 0.2; // location weight

  return (w1 * weatherRisk) + (w2 * pollutionRisk) + (w3 * locationRisk);
};//

// module.exports = {
//   calculateDynamicPremium,
//   detectDisruption,
//   calculateClaimPayout,
// };
//update
module.exports = {
  calculateDynamicPremium,
  calculateRiskScore,
  detectDisruption,
  calculateClaimPayout,
};//
