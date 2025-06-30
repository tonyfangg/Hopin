import React, { useState, useRef, useCallback } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

// Type definitions
interface Document {
  id: string;
  title: string;
  file_name: string;
  file_size_bytes: number;
  category: string;
  document_type: string;
  mime_type: string;
  uploaded_by: { name: string; email: string };
  created_at: string;
  expiry_date: string | null;
  is_confidential: boolean;
  property_name: string;
  tags: string[];
}

interface UploadQueueItem {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  category: string;
  document_type: string;
  title: string;
  is_confidential: boolean;
  tags: string[];
}

interface DocumentCategory {
  value: string;
  label: string;
  icon: string;
  color: string;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Electrical Safety Certificate',
    file_name: 'electrical_cert_2025.pdf',
    file_size_bytes: 1024576,
    category: 'electrical',
    document_type: 'certificate',
    mime_type: 'application/pdf',
    uploaded_by: { name: 'Sarah Johnson', email: 'sarah.johnson@hoops.co.uk' },
    created_at: '2025-06-28T10:30:00Z',
    expiry_date: '2026-06-28',
    is_confidential: false,
    property_name: 'Store #1 - Downtown',
    tags: ['safety', 'compliance', 'electrical']
  },
  {
    id: '2',
    title: 'Drainage Inspection Report',
    file_name: 'drainage_inspection_june_2025.pdf',
    file_size_bytes: 2048576,
    category: 'drainage',
    document_type: 'report',
    mime_type: 'application/pdf',
    uploaded_by: { name: 'James Wilson', email: 'james.wilson@hoops.co.uk' },
    created_at: '2025-06-25T14:15:00Z',
    expiry_date: null,
    is_confidential: false,
    property_name: 'Store #2 - Trafford Centre',
    tags: ['maintenance', 'drainage']
  },
  {
    id: '3',
    title: 'Insurance Policy Document',
    file_name: 'insurance_policy_2025.pdf',
    file_size_bytes: 512000,
    category: 'insurance',
    document_type: 'policy',
    mime_type: 'application/pdf',
    uploaded_by: { name: 'Emma Thompson', email: 'emma.thompson@hoops.co.uk' },
    created_at: '2025-06-20T09:00:00Z',
    expiry_date: '2026-01-20',
    is_confidential: true,
    property_name: 'Organisation Wide',
    tags: ['insurance', 'policy', 'confidential']
  }
];

const documentCategories: DocumentCategory[] = [
  { value: 'electrical', label: 'Electrical', icon: '⚡', color: 'bg-yellow-50 text-yellow-700' },
  { value: 'drainage', label: 'Drainage', icon: '🚰', color: 'bg-blue-50 text-blue-700' },
  { value: 'building', label: 'Building', icon: '🏢', color: 'bg-slate-50 text-slate-700' },
  { value: 'staff', label: 'Staff', icon: '👥', color: 'bg-green-50 text-green-700' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️', color: 'bg-purple-50 text-purple-700' },
  { value: 'safety', label: 'Safety', icon: '🦺', color: 'bg-red-50 text-red-700' },
  { value: 'compliance', label: 'Compliance', icon: '📋', color: 'bg-indigo-50 text-indigo-700' },
  { value: 'other', label: 'Other', icon: '📄', color: 'bg-grey-50 text-grey-700' }
];

const documentTypes = [
  'certificate', 'report', 'policy', 'invoice', 'contract', 'inspection', 'training', 'other'
];

export default function DocumentUploadManagement() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
    return '📁';
  };

  const getCategoryInfo = (category: string): DocumentCategory => {
    return documentCategories.find(cat => cat.value === category) || documentCategories[7];
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  const handleFileSelection = (files: File[]) => {
    const newFiles: UploadQueueItem[] = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      category: 'other',
      document_type: 'other',
      title: file.name.replace(/\.[^/.]+$/, ''),
      is_confidential: false,
      tags: []
    }));
    setUploadQueue(prev => [...prev, ...newFiles]);
    setShowUploadModal(true);
  };

  const simulateUpload = (fileItem: UploadQueueItem) => {
    const interval = setInterval(() => {
      setUploadQueue(prev => prev.map(item => {
        if (item.id === fileItem.id) {
          const newProgress = Math.min(item.progress + 10, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            // Add to documents list
            const newDoc: Document = {
              id: Date.now().toString(),
              title: item.title,
              file_name: item.name,
              file_size_bytes: item.size,
              category: item.category,
              document_type: item.document_type,
              mime_type: item.type,
              uploaded_by: { name: 'Current User', email: 'user@hoops.co.uk' },
              created_at: new Date().toISOString(),
              expiry_date: null,
              is_confidential: item.is_confidential,
              property_name: 'Store #1 - Downtown',
              tags: item.tags
            };
            setDocuments(prev => [newDoc, ...prev]);
            return { ...item, status: 'completed', progress: 100 };
          }
          return { ...item, progress: newProgress };
        }
        return item;
      }));
    }, 200);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Upload Modal Component
  const UploadModal = () => (
    <Modal
      isOpen={showUploadModal}
      onClose={() => setShowUploadModal(false)}
      title="Upload Documents"
      size="xl"
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {uploadQueue.map((fileItem) => (
          <Card key={fileItem.id} variant="outlined" padding="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-2xl">
                {getFileIcon(fileItem.type)}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <Input
                    type="text"
                    value={fileItem.title}
                    onChange={(e) => {
                      setUploadQueue(prev => prev.map(item =>
                        item.id === fileItem.id ? { ...item, title: e.target.value } : item
                      ));
                    }}
                    placeholder="Document title"
                    className="w-full text-sm font-medium"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {fileItem.name} • {formatFileSize(fileItem.size)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={fileItem.category}
                    onChange={(e) => {
                      setUploadQueue(prev => prev.map(item =>
                        item.id === fileItem.id ? { ...item, category: e.target.value } : item
                      ));
                    }}
                    className="text-sm border border-slate-300 rounded px-2 py-1"
                  >
                    {documentCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <select
                    value={fileItem.document_type}
                    onChange={(e) => {
                      setUploadQueue(prev => prev.map(item =>
                        item.id === fileItem.id ? { ...item, document_type: e.target.value } : item
                      ));
                    }}
                    className="text-sm border border-slate-300 rounded px-2 py-1"
                  >
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={fileItem.is_confidential}
                    onChange={(e) => {
                      setUploadQueue(prev => prev.map(item =>
                        item.id === fileItem.id ? { ...item, is_confidential: e.target.checked } : item
                      ));
                    }}
                  />
                  <span>Confidential document</span>
                </label>

                {fileItem.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setUploadQueue(prev => prev.map(item =>
                        item.id === fileItem.id ? { ...item, status: 'uploading' } : item
                      ));
                      simulateUpload(fileItem);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Upload
                  </Button>
                )}

                {fileItem.status === 'uploading' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{fileItem.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {fileItem.status === 'completed' && (
                  <div className="flex items-center gap-1 text-emerald-600 text-sm">
                    <span>✅</span>
                    Upload completed
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setUploadQueue(prev => prev.filter(item => item.id !== fileItem.id));
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {uploadQueue.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No files selected for upload
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => setShowUploadModal(false)}
          className="flex-1"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            uploadQueue.filter(item => item.status === 'pending').forEach(fileItem => {
              setUploadQueue(prev => prev.map(item =>
                item.id === fileItem.id ? { ...item, status: 'uploading' } : item
              ));
              simulateUpload(fileItem);
            });
          }}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={uploadQueue.filter(item => item.status === 'pending').length === 0}
        >
          Upload All
        </Button>
      </div>
    </Modal>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card variant="elevated" className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Document Management</h1>
            <p className="text-slate-600">Upload, organise, and manage your property documents</p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <span className="mr-2">📤</span>
            Upload Documents
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<span className="text-slate-400">🔍</span>}
              variant="search"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Categories</option>
            {documentCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Upload Drop Zone */}
      <Card
        variant="outlined"
        className={`border-2 border-dashed p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 bg-slate-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`text-4xl mb-4 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`}>
          📤
        </div>
        <p className={`text-lg font-medium mb-2 ${isDragging ? 'text-blue-900' : 'text-slate-900'}`}>
          {isDragging ? 'Drop files here to upload' : 'Drag and drop files here'}
        </p>
        <p className="text-slate-600 mb-4">or</p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Browse Files
        </Button>
        <p className="text-sm text-slate-500 mt-4">
          Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
        </p>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600">📁</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Documents</p>
              <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-amber-600">⏰</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-slate-900">
                {documents.filter(doc => 
                  doc.expiry_date && new Date(doc.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-red-600">🔒</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Confidential</p>
              <p className="text-2xl font-bold text-slate-900">
                {documents.filter(doc => doc.is_confidential).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="gradient" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-emerald-600">✅</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-slate-900">
                {documents.filter(doc => {
                  const docDate = new Date(doc.created_at);
                  const now = new Date();
                  return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => {
          const categoryInfo = getCategoryInfo(doc.category);
          const isExpiringSoon = doc.expiry_date && 
            new Date(doc.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          return (
            <Card key={doc.id} variant="elevated" className="hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getFileIcon(doc.mime_type)}</span>
                    <h3 className="text-xl font-semibold text-slate-900">{doc.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryInfo.color}`}>
                      {categoryInfo.icon} {categoryInfo.label}
                    </span>
                    {doc.is_confidential && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        🔒 Confidential
                      </span>
                    )}
                    {isExpiringSoon && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        ⚠️ Expiring Soon
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <span>📄</span>
                      <span>{doc.file_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>{doc.uploaded_by.name}</span>
                    </div>
                    <div>
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                    </div>
                  </div>

                  {doc.expiry_date && (
                    <div className="text-sm text-slate-600 mb-3">
                      <span className="font-medium">Expires:</span> {formatDate(doc.expiry_date)}
                    </div>
                  )}

                  {doc.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-slate-400">🏷️</span>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-500">Property: {doc.property_name}</p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <span className="mr-1">👁️</span>
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                  >
                    <span className="mr-1">⬇️</span>
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <span className="mr-1">🗑️</span>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card variant="elevated" className="p-12 text-center">
          <div className="text-6xl mb-4 text-slate-300">📁</div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No documents found</h3>
          <p className="text-slate-600">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Upload your first document to get started'
            }
          </p>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelection(Array.from(e.target.files));
          }
        }}
      />

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
} 