import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

// Type definitions
interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
  currentProperties: number;
  experience: string;
  specializations: string[];
  availability: 'high' | 'medium' | 'low';
}

interface Property {
  id: string;
  name: string;
  address: string;
  currentManager: Manager | null;
  riskScore: number;
  status: 'active' | 'needs_manager' | 'critical';
  lastInspection: string;
  nextInspection: string;
}

// Mock data - replace with real Supabase queries
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Store #1 - Downtown',
    address: '123 High Street, Manchester M1 1AA',
    currentManager: { 
      id: '101', 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@hoops.co.uk',
      role: 'Senior Property Manager',
      currentProperties: 2,
      experience: '8 years',
      specializations: ['Electrical', 'Drainage'],
      availability: 'high'
    },
    riskScore: 45,
    status: 'active',
    lastInspection: '2024-01-15',
    nextInspection: '2024-04-15'
  },
  {
    id: '2',
    name: 'Store #2 - Trafford Centre',
    address: '456 Shopping Centre, Trafford M17 8AA',
    currentManager: null,
    riskScore: 72,
    status: 'needs_manager',
    lastInspection: '2024-01-10',
    nextInspection: '2024-04-10'
  },
  {
    id: '3',
    name: 'Store #3 - City Centre',
    address: '789 Market Street, Liverpool L1 2BB',
    currentManager: { 
      id: '102', 
      name: 'James Wilson', 
      email: 'james.wilson@hoops.co.uk',
      role: 'Property Manager',
      currentProperties: 1,
      experience: '5 years',
      specializations: ['Security', 'Compliance'],
      availability: 'medium'
    },
    riskScore: 31,
    status: 'active',
    lastInspection: '2024-01-20',
    nextInspection: '2024-04-20'
  },
  {
    id: '4',
    name: 'Store #4 - Shopping District',
    address: '321 Retail Park, Birmingham B1 1AA',
    currentManager: null,
    riskScore: 85,
    status: 'critical',
    lastInspection: '2023-12-01',
    nextInspection: '2024-03-01'
  }
];

const mockAvailableManagers: Manager[] = [
  { 
    id: '101', 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@hoops.co.uk', 
    role: 'Senior Property Manager', 
    currentProperties: 2,
    experience: '8 years',
    specializations: ['Electrical', 'Drainage'],
    availability: 'high'
  },
  { 
    id: '102', 
    name: 'James Wilson', 
    email: 'james.wilson@hoops.co.uk', 
    role: 'Property Manager', 
    currentProperties: 1,
    experience: '5 years',
    specializations: ['Security', 'Compliance'],
    availability: 'medium'
  },
  { 
    id: '103', 
    name: 'Emma Thompson', 
    email: 'emma.thompson@hoops.co.uk', 
    role: 'Property Manager', 
    currentProperties: 0,
    experience: '3 years',
    specializations: ['Risk Assessment', 'Insurance'],
    availability: 'high'
  },
  { 
    id: '104', 
    name: 'David Brown', 
    email: 'david.brown@hoops.co.uk', 
    role: 'Assistant Manager', 
    currentProperties: 1,
    experience: '2 years',
    specializations: ['Maintenance', 'Documentation'],
    availability: 'medium'
  }
];

export default function PropertyManagerAssignment() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [availableManagers, setAvailableManagers] = useState<Manager[]>(mockAvailableManagers);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showManagerDetails, setShowManagerDetails] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const getRiskLevelColor = (score: number): string => {
    if (score <= 30) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score <= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskLevel = (score: number): string => {
    if (score <= 30) return 'LOW RISK';
    if (score <= 60) return 'MEDIUM RISK';
    return 'HIGH RISK';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-50';
      case 'needs_manager': return 'text-amber-600 bg-amber-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getAvailabilityColor = (availability: string): string => {
    switch (availability) {
      case 'high': return 'text-emerald-600 bg-emerald-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'assigned' && property.currentManager) ||
                         (filterStatus === 'unassigned' && !property.currentManager) ||
                         (filterStatus === 'critical' && property.status === 'critical');
    return matchesSearch && matchesFilter;
  });

  const handleAssignManager = (propertyId: string, managerId: string) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId 
        ? { 
            ...prop, 
            currentManager: availableManagers.find(m => m.id === managerId) || null,
            status: 'active' as const
          }
        : prop
    ));
    setShowAssignModal(false);
    setSelectedProperty(null);
  };

  const handleRemoveManager = (propertyId: string) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId 
        ? { ...prop, currentManager: null, status: 'needs_manager' as const }
        : prop
    ));
  };

  const handleManagerClick = (manager: Manager) => {
    setSelectedManager(manager);
    setShowManagerDetails(true);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card variant="elevated" className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Property Manager Assignment</h1>
            <p className="text-slate-600">Manage property manager assignments across your portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-slate-600">Assignment Rate</div>
              <div className="text-2xl font-bold text-slate-900">
                {Math.round((properties.filter(p => p.currentManager).length / properties.length) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="search"
            />
          </div>
          <div className="flex items-center gap-3">
            <span>Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Properties</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span>✔</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Assigned</p>
              <p className="text-2xl font-bold text-slate-900">
                {properties.filter(p => p.currentManager).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <span>⚠</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Needs Assignment</p>
              <p className="text-2xl font-bold text-slate-900">
                {properties.filter(p => !p.currentManager).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <span>🛡</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Critical Risk</p>
              <p className="text-2xl font-bold text-slate-900">
                {properties.filter(p => p.status === 'critical').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span>👥</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Available Managers</p>
              <p className="text-2xl font-bold text-slate-900">
                {availableManagers.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-4">
        {filteredProperties.map((property) => (
          <Card key={property.id} variant="elevated" className="hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span>🏢</span>
                  <h3 className="text-xl font-semibold text-slate-900">{property.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(property.riskScore)}`}>
                    {getRiskLevel(property.riskScore)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600 mb-4">{property.address}</p>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>⏳</span>
                    <span>Last Inspection: {formatDate(property.lastInspection)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>🔄</span>
                    <span>Next Inspection: {formatDate(property.nextInspection)}</span>
                  </div>
                </div>

                {/* Manager Assignment Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {property.currentManager ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span>✔</span>
                          <span className="text-sm font-medium text-slate-900">
                            {property.currentManager.name}
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">
                          {property.currentManager.email}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600">
                        <span>⚠</span>
                        <span className="text-sm font-medium">No Manager Assigned</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {property.currentManager ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowAssignModal(true);
                          }}
                        >
                          <span>✏</span>
                          Change
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveManager(property.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <span>✗</span>
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowAssignModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <span>➕</span>
                        Assign Manager
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Assignment Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedProperty(null);
        }}
        title={selectedProperty ? `Assign Manager to ${selectedProperty.name}` : 'Assign Manager'}
        size="lg"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {availableManagers.map((manager) => (
            <Card
              key={manager.id}
              variant="outlined"
              padding="md"
              className="hover:border-blue-300 cursor-pointer transition-colors"
              onClick={() => selectedProperty && handleAssignManager(selectedProperty.id, manager.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-slate-900">{manager.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAvailabilityColor(manager.availability)}`}>
                      {manager.availability.toUpperCase()} AVAILABILITY
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{manager.email}</p>
                  <p className="text-xs text-slate-500 mb-2">{manager.role} • {manager.experience}</p>
                  <div className="flex flex-wrap gap-1">
                    {manager.specializations.map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 mb-1">
                    {manager.currentProperties} properties
                  </div>
                  {selectedProperty?.currentManager?.id === manager.id && (
                    <div className="flex items-center gap-1 text-emerald-600 text-sm">
                      <span>✔</span>
                      Current
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Manager Details Modal */}
      <Modal
        isOpen={showManagerDetails}
        onClose={() => {
          setShowManagerDetails(false);
          setSelectedManager(null);
        }}
        title={selectedManager ? `${selectedManager.name} - Details` : 'Manager Details'}
        size="md"
      >
        {selectedManager && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Role</label>
                <p className="text-slate-900">{selectedManager.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Experience</label>
                <p className="text-slate-900">{selectedManager.experience}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Current Properties</label>
                <p className="text-slate-900">{selectedManager.currentProperties}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Availability</label>
                <p className="text-slate-900 capitalize">{selectedManager.availability}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Specializations</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedManager.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Contact</label>
              <p className="text-slate-900">{selectedManager.email}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 