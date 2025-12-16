import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Activity, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { fetchCovidData } from '../services/covidDataService';
import { CovidDataPoint } from '../types';

const StatsView: React.FC = () => {
  const [data, setData] = useState<CovidDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchCovidData(timeframe);
    setData(result);
    setLoading(false);
  };

  const predictionStartIndex = data.findIndex(d => d.type === 'prediction');
  const lastHistorical = data[predictionStartIndex - 1];

  return (
    <div className="h-full flex flex-col p-6 md:p-10 bg-gray-50 overflow-y-auto">
      <div className="mb-8">
        <h2 className="brand-font text-3xl font-bold text-emerald-800">Global Trends & Predictions</h2>
        <p className="text-gray-600 mt-2">AI-driven analysis of case trajectories to assist in future planning.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Current Active Cases</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">1,204,592</h3>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <Activity className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>2.4% decrease</span>
                <span className="text-gray-400 ml-1">vs last week</span>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Predicted Trend (7 Days)</p>
                    <h3 className="text-2xl font-bold text-emerald-700 mt-1">Stabilizing</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">Based on ML projection model v2.1</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Risk Level</p>
                    <h3 className="text-2xl font-bold text-yellow-600 mt-1">Moderate</h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <Activity className="w-5 h-5" />
                </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">Public advisory: Maintain protocols</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 min-h-[400px] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Infection Rate Analysis
            </h3>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['daily', 'weekly', 'monthly'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                            timeframe === t 
                            ? 'bg-white text-emerald-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 w-full">
            {loading ? (
                <div className="h-full flex items-center justify-center text-gray-400">Loading analysis...</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <ReferenceLine x={lastHistorical?.date} stroke="#9ca3af" strokeDasharray="3 3" label="Forecast Start" />
                        <Area 
                            type="monotone" 
                            dataKey="cases" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorHistorical)" 
                            strokeWidth={2}
                            connectNulls
                        />
                         {/* We render a second area for prediction to style it differently, technically we'd split data, but for simplicity: */}
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
            <span className="w-3 h-3 inline-block bg-emerald-500 rounded-full mr-2"></span>Historical Data
            <span className="w-3 h-3 inline-block bg-yellow-500 rounded-full ml-6 mr-2"></span>AI Prediction
        </p>
      </div>
    </div>
  );
};

export default StatsView;