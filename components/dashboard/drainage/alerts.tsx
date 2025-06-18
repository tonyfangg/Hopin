export function DrainageAlerts() {
  const alerts = [
    { property: 'Store #3 - Suburb', type: 'Blocked Drain', severity: 'High' },
    { property: 'Store #2 - Mall', type: 'Slow Drainage', severity: 'Medium' },
    { property: 'Store #4 - Uptown', type: 'Routine Check', severity: 'Low' },
  ];

  const severityColors: Record<'High' | 'Medium' | 'Low', string> = {
    'High': 'bg-red-100 text-red-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'Low': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Drainage Alerts</h3>
      <div className="divide-y divide-slate-100">
        {alerts.map((alert, idx) => (
          <div key={idx} className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium text-slate-900">{alert.property}</div>
              <div className="text-slate-500 text-sm">{alert.type}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityColors[alert.severity as 'High' | 'Medium' | 'Low']}`}>{alert.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 