# Document Upload Structure Analysis

**Date**: June 25, 2025  
**Status**: ⚠️ **PARTIAL MATCH** - Structure needs alignment  
**Scope**: Document upload directory structure verification

---

## 📋 **Executive Summary**

Your current document upload structure **partially matches** the expected structure. The implementation has the correct base organization but needs adjustments to fully align with your specified directory hierarchy.

---

## 🔍 **Current Implementation vs Expected Structure**

### **✅ Current Implementation (Working)**
```
documents/
├── organisations/
│   └── {organisation-id}/
│       ├── general/
│       │   ├── certificates/
│       │   ├── reports/
│       │   ├── compliance/
│       │   ├── insurance/
│       │   ├── contracts/
│       │   └── general/
│       └── properties/
│           └── {property-id}/
│               ├── certificates/
│               ├── reports/
│               ├── compliance/
│               ├── insurance/
│               ├── contracts/
│               └── general/
```

### **🎯 Expected Structure (Your Specification)**
```
documents/
├── {organisation-id}/
│   ├── organisation/
│   │   ├── electrical_certificates/
│   │   ├── insurance_policies/
│   │   └── compliance_documents/
│   └── properties/
│       └── {property-id}/
│           ├── electrical_certificates/
│           ├── drainage_reports/
│           └── safety_assessments/
```

---

## ⚠️ **Key Differences Identified**

### **1. Directory Level Structure**
- **Current**: `documents/organisations/{org-id}/...`
- **Expected**: `documents/{org-id}/...`
- **Issue**: Extra "organisations" level in current implementation

### **2. Organisation-Level Categories**
- **Current**: Generic categories (certificates, reports, compliance, etc.)
- **Expected**: Specific categories (electrical_certificates, insurance_policies, compliance_documents)
- **Issue**: Categories are too generic and don't match specific business needs

### **3. Property-Level Categories**
- **Current**: Generic categories (certificates, reports, compliance, etc.)
- **Expected**: Specific categories (electrical_certificates, drainage_reports, safety_assessments)
- **Issue**: Categories don't align with property-specific document types

### **4. Naming Convention**
- **Current**: Uses generic category names
- **Expected**: Uses specific, business-focused category names
- **Issue**: Current naming doesn't reflect UK property management standards

---

## 🔧 **Required Changes**

### **1. Update Storage Path Generation**
**File**: `app/api/documents/upload/route.ts`

**Current Code** (Line 53-54):
```typescript
const storagePath = propertyId 
  ? `organisations/${organisationId}/properties/${propertyId}/${category}/${uniqueFileName}`
  : `organisations/${organisationId}/general/${category}/${uniqueFileName}`
```

**Required Change**:
```typescript
const storagePath = propertyId 
  ? `${organisationId}/properties/${propertyId}/${category}/${uniqueFileName}`
  : `${organisationId}/organisation/${category}/${uniqueFileName}`
```

### **2. Update Document Categories**
**File**: `app/lib/constants.ts`

**Current Categories**:
```typescript
CATEGORIES: [
  { value: 'certificates', label: 'Certificates' },
  { value: 'reports', label: 'Reports' },
  { value: 'compliance', label: 'Compliance Documents' },
  { value: 'insurance', label: 'Insurance Documents' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'general', label: 'General Documents' }
]
```

**Required Categories**:
```typescript
// Organisation-level categories
ORGANISATION_CATEGORIES: [
  { value: 'electrical_certificates', label: 'Electrical Certificates' },
  { value: 'insurance_policies', label: 'Insurance Policies' },
  { value: 'compliance_documents', label: 'Compliance Documents' }
],

// Property-level categories
PROPERTY_CATEGORIES: [
  { value: 'electrical_certificates', label: 'Electrical Certificates' },
  { value: 'drainage_reports', label: 'Drainage Reports' },
  { value: 'safety_assessments', label: 'Safety Assessments' }
]
```

### **3. Update RLS Policies**
**File**: `supabase-storage-setup.sql`

**Current Policy** (Line 35):
```sql
(string_to_array(name, '/'))[2]
```

**Required Change**:
```sql
(string_to_array(name, '/'))[1]
```

---

## 📊 **Implementation Status**

| Component | Status | Action Required |
|-----------|--------|-----------------|
| **Storage Path** | ⚠️ Partial | Update path generation |
| **Categories** | ❌ Mismatch | Redefine categories |
| **RLS Policies** | ⚠️ Partial | Update policy logic |
| **API Logic** | ⚠️ Partial | Update category handling |
| **Frontend Forms** | ❌ Missing | Create upload forms |

---

## 🚀 **Recommended Implementation Plan**

### **Phase 1: Update Core Structure**
1. **Update storage path generation** in upload API
2. **Redefine document categories** in constants
3. **Update RLS policies** for new structure
4. **Test basic upload functionality**

### **Phase 2: Create Upload Forms**
1. **Create organisation document upload form**
2. **Create property document upload form**
3. **Add category-specific validation**
4. **Implement file type restrictions**

### **Phase 3: Migration Strategy**
1. **Create migration script** for existing files
2. **Update existing file references**
3. **Test migration process**
4. **Deploy updated structure**

---

## 💡 **Benefits of Aligned Structure**

### **1. Business Alignment**
- ✅ Specific categories match UK property management needs
- ✅ Clear separation between organisation and property documents
- ✅ Industry-standard naming conventions

### **2. User Experience**
- ✅ Intuitive category selection
- ✅ Clear document organization
- ✅ Easy navigation and search

### **3. Compliance**
- ✅ UK-specific document categories
- ✅ Regulatory compliance alignment
- ✅ Audit trail clarity

---

## 🔍 **Next Steps**

1. **Review and approve** the proposed structure changes
2. **Update the upload API** with new path generation
3. **Redefine document categories** in constants
4. **Update RLS policies** for new structure
5. **Create upload forms** with proper category selection
6. **Test the complete flow** with new structure

---

## 📝 **Summary**

Your document upload structure is **functionally working** but needs **structural alignment** to match your specified requirements. The changes are **straightforward** and will improve the **business alignment** and **user experience** of your document management system.

**Recommendation**: Proceed with the proposed changes to achieve full alignment with your expected structure. 