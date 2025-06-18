export function DrainageInspections() {
  const inspections = [
    { property: 'Store #1 - Downtown', date: '2024-06-01', status: 'Passed' },
    { property: 'Store #2 - Mall', date: '2024-05-28', status: 'Passed' },
    { property: 'Store #3 - Suburb', date: '2024-05-25', status: 'Attention' },
    { property: 'Store #4 - Uptown', date: '2024-05-20', status: 'Scheduled' },
  ];

  const statusColors: Record<'Passed' | 'Attention' | 'Scheduled', string> = {
    'Passed': 'bg-green-100 text-green-700',
    'Attention': 'bg-yellow-100 text-yellow-700',
    'Scheduled': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Drainage Inspections</h3>
      <div className="divide-y divide-slate-100">
        {inspections.map((insp, idx) => (
          <div key={idx} className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium text-slate-900">{insp.property}</div>
              <div className="text-slate-500 text-sm">{insp.date}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[insp.status as 'Passed' | 'Attention' | 'Scheduled']}`}>{insp.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 