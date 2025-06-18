const inspections = [
  {
    property: 'Store #1 - Downtown',
    type: 'Annual Safety Inspection',
    status: 'completed',
    date: '2 days ago',
    inspector: 'John Smith',
    riskReduction: '-8%'
  },
  {
    property: 'Store #3 - Mall',
    type: 'Circuit Testing',
    status: 'completed',
    date: '1 week ago',
    inspector: 'Mike Johnson',
    riskReduction: '-5%'
  },
  {
    property: 'Store #5 - Suburb',
    type: 'Emergency System Check',
    status: 'scheduled',
    date: 'Tomorrow',
    inspector: 'Sarah Davis',
    riskReduction: 'TBD'
  },
  {
    property: 'Store #7 - Plaza',
    type: 'Panel Upgrade Verification',
    status: 'in_progress',
    date: 'Today',
    inspector: 'Tom Wilson',
    riskReduction: 'TBD'
  }
]

export function ElectricalInspections() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-900">Recent Electrical Inspections</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Property</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Inspection Type</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Inspector</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Date</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Risk Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {inspections.map((inspection, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="py-4 px-6 text-sm font-medium text-slate-900">
                  {inspection.property}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {inspection.type}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {inspection.inspector}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {inspection.date}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    inspection.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : inspection.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {inspection.status === 'completed' ? 'Completed' : 
                     inspection.status === 'scheduled' ? 'Scheduled' : 'In Progress'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-sm font-medium ${
                    inspection.riskReduction.startsWith('-') ? 'text-green-600' : 'text-slate-500'
                  }`}>
                    {inspection.riskReduction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 