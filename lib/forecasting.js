// lib/forecasting.js

/**
 * Calculates the projected labor hours needed based on forecasted volume and target efficiency.
 */
export function calculateProjectedLabor(forecastedUnits, targetUplh, seasonalityMultiplier = 1.0) {
  if (targetUplh <= 0) return 0; // Prevent division by zero
  
  const baseLabor = forecastedUnits / targetUplh;
  return Number((baseLabor * seasonalityMultiplier).toFixed(2));
}

/**
 * Calculates a simple 7-day moving average for a given metric (e.g., UPLH).
 */
export function calculate7DayMovingAverage(historicalData) {
  if (!historicalData || historicalData.length === 0) return 0;
  
  // Ensure we only take the last 7 days if a larger array is passed
  const recentData = historicalData.slice(-7);
  const sum = recentData.reduce((acc, val) => acc + val, 0);
  
  return Number((sum / recentData.length).toFixed(2));
}