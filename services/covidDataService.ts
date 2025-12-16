import { CovidDataPoint } from '../types';

// Simulate fetching data from an external API
// includes historical data and AI-predicted future data
export const fetchCovidData = async (timeframe: 'daily' | 'weekly' | 'monthly'): Promise<CovidDataPoint[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const data: CovidDataPoint[] = [];
  const today = new Date();
  
  let points = 30;
  let baseCases = 1500;
  let volatility = 200;

  if (timeframe === 'weekly') {
    points = 12; // 12 weeks
    baseCases = 10000;
    volatility = 1500;
  } else if (timeframe === 'monthly') {
    points = 12; // 12 months
    baseCases = 40000;
    volatility = 5000;
  }

  // Generate historical data
  for (let i = points; i > 0; i--) {
    const d = new Date(today);
    if (timeframe === 'daily') d.setDate(d.getDate() - i);
    if (timeframe === 'weekly') d.setDate(d.getDate() - (i * 7));
    if (timeframe === 'monthly') d.setMonth(d.getMonth() - i);

    // Create a semi-realistic curve (sine wave + noise)
    const noise = Math.random() * volatility - (volatility / 2);
    const trend = Math.sin(i / 5) * (baseCases * 0.2); 
    
    data.push({
      date: d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: timeframe === 'monthly' ? undefined : 'numeric',
        year: timeframe === 'monthly' ? '2-digit' : undefined
      }),
      cases: Math.max(0, Math.floor(baseCases + trend + noise)),
      type: 'historical'
    });
  }

  // Generate PREDICTED Future Data (Next 7 units)
  const lastCases = data[data.length - 1].cases;
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    if (timeframe === 'daily') d.setDate(d.getDate() + i);
    if (timeframe === 'weekly') d.setDate(d.getDate() + (i * 7));
    if (timeframe === 'monthly') d.setMonth(d.getMonth() + i);

    // Prediction logic: assume a slight downward trend due to "interventions"
    const predictedCases = lastCases * Math.pow(0.95, i) + (Math.random() * volatility * 0.5);

    data.push({
      date: d.toLocaleDateString('en-US', { 
         month: 'short', 
         day: timeframe === 'monthly' ? undefined : 'numeric',
         year: timeframe === 'monthly' ? '2-digit' : undefined 
      }) + (timeframe === 'daily' ? '' : ''),
      cases: Math.floor(predictedCases),
      type: 'prediction'
    });
  }

  return data;
};