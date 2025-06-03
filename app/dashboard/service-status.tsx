const services = [
    {
      service: 'Fire Safety System',
      location: 'Store #1 - Downtown',
      lastUpdate: '2 hours ago',
      status: 'Active',
      action: 'View Details'
    },
    {
      service: 'Security Cameras',
      location: 'Store #2 - Mall',
      lastUpdate: '4 hours ago',
      status: 'Active',
      action: 'View Details'
    },
    {
      service: 'HVAC Maintenance',
      location: 'Store #3 - Suburb',
      lastUpdate: '1 day ago',
      status: 'Scheduled',
      action: 'View Details'
    },
    {
      service: 'Staff Training',
      location: 'All Locations',
      lastUpdate: '3 days ago',
      status: 'Completed',
      action: 'View Details'
    }
  ]
  
  export function ServiceStatus() {
    return (
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Service Status</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Service</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Location</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Last Update</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {services.map((service, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm font-medium text-slate-900">
                    {service.service}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {service.location}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {service.lastUpdate}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      service.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : service.status === 'Scheduled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {service.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  