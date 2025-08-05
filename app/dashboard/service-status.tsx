'use client'
import { Flame, Shield, Users, Wrench, Droplets } from 'lucide-react'

const services = [
  {
    id: 1,
    service: 'Fire Safety System',
    location: 'Shop #3 - City Centre',
    icon: Flame,
    status: 'Active',
    lastUpdate: '2 hours ago',
    riskImpact: '-5%',
    statusColor: 'green',
    details: 'Fire extinguisher check completed'
  },
  {
    id: 2,
    service: 'Security Cameras',
    location: 'Shop #1 - Shopping Centre',
    icon: Shield,
    status: 'Active',
    lastUpdate: '4 hours ago',
    riskImpact: '-3%',
    statusColor: 'green',
    details: 'All cameras operational'
  },
  {
    id: 3,
    service: 'Staff Training',
    location: 'All Locations',
    icon: Users,
    status: 'Completed',
    lastUpdate: '3 days ago',
    riskImpact: '-8%',
    statusColor: 'blue',
    details: 'Safety protocol training finished'
  },
  {
    id: 4,
    service: 'HVAC Maintenance',
    location: 'Shop #2 - Residential Area',
    icon: Wrench,
    status: 'Scheduled',
    lastUpdate: '1 day ago',
    riskImpact: '+2%',
    statusColor: 'yellow',
    details: 'Maintenance scheduled for next week'
  },
  {
    id: 5,
    service: 'Water System',
    location: 'Shop #4 - Airport',
    icon: Droplets,
    status: 'Warning',
    lastUpdate: '6 hours ago',
    riskImpact: '+7%',
    statusColor: 'red',
    details: 'Minor leak detected, repair needed'
  }
];

export function ServiceStatus() {
  const getStatusBadge = (status: string, color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[color as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  const getRiskBadge = (impact: string) => {
    const isPositive = impact.startsWith('-');
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {impact}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Service Status</h3>
        <p className="text-sm text-slate-600 mt-1">Monitor all safety services across your locations</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Service</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Location</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Last Update</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Risk Impact</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <tr key={service.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{service.service}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {service.location}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(service.status, service.statusColor)}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {service.lastUpdate}
                  </td>
                  <td className="py-4 px-6">
                    {getRiskBadge(service.riskImpact)}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {service.details}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  