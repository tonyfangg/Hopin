'use client'

export function PerformanceChart() {
  const chartData = [
    { month: 'Jan', risk: 72, activities: 12 },
    { month: 'Feb', risk: 75, activities: 15 },
    { month: 'Mar', risk: 68, activities: 18 },
    { month: 'Apr', risk: 73, activities: 22 },
    { month: 'May', risk: 70, activities: 19 },
    { month: 'Jun', risk: 75, activities: 24 }
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200">
      <h4 className="text-lg font-medium text-slate-900 mb-6">Performance Overview</h4>
      <div className="relative h-48">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500">
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        
        <div className="ml-8 h-full relative">
          <div className="absolute inset-0">
            {[0, 20, 40, 60, 80, 100].map((value) => (
              <div 
                key={value}
                className="absolute w-full border-t border-slate-100"
                style={{ bottom: `${value}%` }}
              />
            ))}
          </div>
          
          <svg className="absolute inset-0 w-full h-full">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={chartData.map((data, index) => 
                `${(index / (chartData.length - 1)) * 100}%,${100 - data.risk}%`
              ).join(' ')}
              vectorEffect="non-scaling-stroke"
            />
            
            {chartData.map((data, index) => (
              <circle
                key={index}
                cx={`${(index / (chartData.length - 1)) * 100}%`}
                cy={`${100 - data.risk}%`}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${data.month}: ${data.risk}% risk, ${data.activities} activities`}</title>
              </circle>
            ))}
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-slate-500 mt-2">
          {chartData.map((data, index) => (
            <span key={index}>{data.month}</span>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-4">
        <span>Credit Score Trend (Monthly)</span>
        <span>Higher is better</span>
      </div>
    </div>
  );
} 