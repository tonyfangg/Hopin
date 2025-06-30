import React, { useState } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

// Type definitions
interface UserPermissions {
  can_manage_properties: boolean;
  can_manage_staff: boolean;
  can_view_reports: boolean;
  can_manage_risk_assessments: boolean;
  can_upload_documents: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'organisation_admin' | 'property_manager' | 'staff_member' | 'read_only';
  organisation_id: string;
  status: 'active' | 'pending' | 'inactive';
  last_login: string | null;
  permissions: UserPermissions;
  assigned_properties: string[];
  access_level: 'organisation_wide' | 'property_specific';
}

interface Property {
  id: string;
  name: string;
}

interface RoleTemplate {
  label: string;
  description: string;
  permissions: UserPermissions;
  access_level: 'organisation_wide' | 'property_specific';
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hoops.co.uk',
    role: 'property_manager',
    organisation_id: 'org1',
    status: 'active',
    last_login: '2025-06-29T14:30:00Z',
    permissions: {
      can_manage_properties: true,
      can_manage_staff: true,
      can_view_reports: true,
      can_manage_risk_assessments: true,
      can_upload_documents: true
    },
    assigned_properties: ['prop1', 'prop2'],
    access_level: 'property_specific'
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james.wilson@hoops.co.uk',
    role: 'organisation_admin',
    organisation_id: 'org1',
    status: 'active',
    last_login: '2025-06-30T09:15:00Z',
    permissions: {
      can_manage_properties: true,
      can_manage_staff: true,
      can_view_reports: true,
      can_manage_risk_assessments: true,
      can_upload_documents: true
    },
    assigned_properties: [],
    access_level: 'organisation_wide'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    email: 'emma.thompson@hoops.co.uk',
    role: 'staff_member',
    organisation_id: 'org1',
    status: 'pending',
    last_login: null,
    permissions: {
      can_manage_properties: false,
      can_manage_staff: false,
      can_view_reports: true,
      can_manage_risk_assessments: false,
      can_upload_documents: true
    },
    assigned_properties: ['prop3'],
    access_level: 'property_specific'
  }
];

const mockProperties: Property[] = [
  { id: 'prop1', name: 'Store #1 - Downtown' },
  { id: 'prop2', name: 'Store #2 - Trafford Centre' },
  { id: 'prop3', name: 'Store #3 - City Centre' }
];

const roleTemplates: Record<string, RoleTemplate> = {
  organisation_admin: {
    label: 'Organisation Administrator',
    description: 'Full access to all organisation data and settings',
    permissions: {
      can_manage_properties: true,
      can_manage_staff: true,
      can_view_reports: true,
      can_manage_risk_assessments: true,
      can_upload_documents: true
    },
    access_level: 'organisation_wide'
  },
  property_manager: {
    label: 'Property Manager',
    description: 'Manage assigned properties and their operations',
    permissions: {
      can_manage_properties: true,
      can_manage_staff: true,
      can_view_reports: true,
      can_manage_risk_assessments: true,
      can_upload_documents: true
    },
    access_level: 'property_specific'
  },
  staff_member: {
    label: 'Staff Member',
    description: 'Limited access to view reports and upload documents',
    permissions: {
      can_manage_properties: false,
      can_manage_staff: false,
      can_view_reports: true,
      can_manage_risk_assessments: false,
      can_upload_documents: true
    },
    access_level: 'property_specific'
  },
  read_only: {
    label: 'Read Only User',
    description: 'View-only access to reports and data',
    permissions: {
      can_manage_properties: false,
      can_manage_staff: false,
      can_view_reports: true,
      can_manage_risk_assessments: false,
      can_upload_documents: false
    },
    access_level: 'property_specific'
  }
};

export default function UserPermissionsManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'inactive': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'active': return '✅';
      case 'pending': return '⏳';
      case 'inactive': return '❌';
      default: return '⚠️';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatLastLogin = (dateString: string | null): string => {
    if (!dateString) return 'Never logged in';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPermissionCount = (permissions: UserPermissions): number => {
    return Object.values(permissions).filter(Boolean).length;
  };

  const getPermissionDescription = (permission: string): string => {
    const descriptions: Record<string, string> = {
      can_manage_properties: 'Create, edit, and delete property information',
      can_manage_staff: 'Manage staff records and training',
      can_view_reports: 'Access all reports and analytics',
      can_manage_risk_assessments: 'Create and modify risk assessments',
      can_upload_documents: 'Upload and manage documents'
    };
    return descriptions[permission] || '';
  };

  // Edit Modal Component
  const PermissionEditModal = () => {
    const [editedUser, setEditedUser] = useState<User | null>(selectedUser ? { ...selectedUser } : null);
    
    if (!editedUser) return null;

    const handlePermissionChange = (permission: keyof UserPermissions, value: boolean) => {
      setEditedUser(prev => prev ? {
        ...prev,
        permissions: {
          ...prev.permissions,
          [permission]: value
        }
      } : null);
    };

    const handleRoleChange = (role: string) => {
      const template = roleTemplates[role];
      if (template && editedUser) {
        setEditedUser({
          ...editedUser,
          role: role as User['role'],
          permissions: { ...template.permissions },
          access_level: template.access_level
        });
      }
    };

    const handleSave = () => {
      if (editedUser) {
        setUsers(prev => prev.map(user => 
          user.id === editedUser.id ? editedUser : user
        ));
      }
      setShowEditModal(false);
      setSelectedUser(null);
    };

    return (
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        title={`Edit User Permissions - ${editedUser.name}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role Template</label>
            <select
              value={editedUser.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(roleTemplates).map(([key, template]) => (
                <option key={key} value={key}>{template.label}</option>
              ))}
            </select>
            <p className="text-sm text-slate-600 mt-1">
              {roleTemplates[editedUser.role]?.description}
            </p>
          </div>

          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Access Level</label>
            <select
              value={editedUser.access_level}
              onChange={(e) => setEditedUser(prev => prev ? { 
                ...prev, 
                access_level: e.target.value as 'organisation_wide' | 'property_specific' 
              } : null)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="organisation_wide">Organisation Wide</option>
              <option value="property_specific">Property Specific</option>
            </select>
          </div>

          {/* Property Assignment (if property specific) */}
          {editedUser.access_level === 'property_specific' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Properties</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-3">
                {mockProperties.map(property => (
                  <label key={property.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedUser.assigned_properties.includes(property.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditedUser(prev => prev ? {
                          ...prev,
                          assigned_properties: checked
                            ? [...prev.assigned_properties, property.id]
                            : prev.assigned_properties.filter(id => id !== property.id)
                        } : null);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{property.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Individual Permissions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Individual Permissions</label>
            <div className="space-y-3">
              {Object.entries(editedUser.permissions).map(([permission, value]) => (
                <label key={permission} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div>
                    <span className="font-medium text-slate-900">
                      {permission.replace(/can_|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <p className="text-sm text-slate-600">
                      {getPermissionDescription(permission)}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handlePermissionChange(permission as keyof UserPermissions, e.target.checked)}
                    className="ml-4"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card variant="elevated" className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">User Permissions Management</h1>
            <p className="text-slate-600">Manage user roles and permissions across your organisation</p>
          </div>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <span className="mr-2">➕</span>
            Invite User
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<span className="text-slate-400">🔍</span>}
              variant="search"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">👥</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Roles</option>
              {Object.entries(roleTemplates).map(([key, template]) => (
                <option key={key} value={key}>{template.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600">👥</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-emerald-600">✅</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Users</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-amber-600">⏳</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending Invites</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <span className="text-slate-600">🛡️</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Admin Users</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.role === 'organisation_admin').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card variant="elevated" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{roleTemplates[user.role]?.label}</div>
                    <div className="text-sm text-slate-500">{user.access_level.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      <span className="mr-1">{getStatusIcon(user.status)}</span>
                      <span className="capitalize">{user.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">🛡️</span>
                      <span className="text-sm text-slate-900">
                        {getPermissionCount(user.permissions)}/5 permissions
                      </span>
                    </div>
                    {user.access_level === 'property_specific' && (
                      <div className="text-xs text-slate-500 mt-1">
                        {user.assigned_properties.length} properties assigned
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatLastLogin(user.last_login)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <span className="mr-1">✏️</span>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <span className="mr-1">🗑️</span>
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      {showEditModal && <PermissionEditModal />}

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <Input
              type="email"
              placeholder="user@company.co.uk"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {Object.entries(roleTemplates).map(([key, template]) => (
                <option key={key} value={key}>{template.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 