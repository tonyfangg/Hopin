# Hoops Store Operations - API Documentation

## Overview

The Hoops Store Operations API provides endpoints for managing property data, risk assessments, electrical reports, drainage inspections, and insurance information for retail property management.

## Base URL

```
Local Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API endpoints require authentication via Supabase. Include the user's JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Dashboard Stats

#### GET `/api/dashboard/stats`

Returns overview statistics for the dashboard.

**Response:**
```json
{
  "properties": 3,
  "overdue_inspections": 1,
  "total_reports": 15,
  "compliance_rate": 87
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server Error

---

### Electrical Reports

#### GET `/api/electrical-reports`

Retrieves all electrical inspection reports for the authenticated user.

**Query Parameters:**
- `property_id` (optional) - Filter by specific property
- `limit` (optional) - Number of results (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Response:**
```json
{
  "reports": [
    {
      "id": "uuid",
      "property_id": "uuid",
      "inspection_date": "2024-01-15",
      "inspector_name": "John Smith",
      "certificate_number": "CERT001",
      "overall_condition": "satisfactory",
      "risk_rating": 2,
      "remedial_work_required": false,
      "test_results": {
        "earth_fault_loop_impedance": "0.5",
        "insulation_resistance": "500",
        "polarity_test": "pass",
        "rcd_test": "pass"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1
}
```

#### POST `/api/electrical-reports`

Creates a new electrical inspection report.

**Request Body:**
```json
{
  "property_id": "uuid",
  "inspection_type": "eicr",
  "certificate_number": "CERT001",
  "inspector_name": "John Smith",
  "inspector_qualification": "NICEIC Approved",
  "inspection_date": "2024-01-15",
  "next_inspection_due": "2027-01-15",
  "overall_condition": "satisfactory",
  "remedial_work_required": false,
  "test_results": {
    "earth_fault_loop_impedance": "0.5",
    "insulation_resistance": "500",
    "polarity_test": "pass",
    "rcd_test": "pass",
    "continuity_test": "pass"
  },
  "risk_rating": "2",
  "compliance_status": "compliant"
}
```

**Response:**
```json
{
  "id": "uuid",
  "message": "Electrical report created successfully"
}
```

**Status Codes:**
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `500` - Server Error

---

### Drainage Reports

#### GET `/api/drainage-reports`

Retrieves all drainage inspection reports.

**Query Parameters:**
- `property_id` (optional) - Filter by specific property
- `limit` (optional) - Number of results (default: 50)

**Response:**
```json
{
  "reports": [
    {
      "id": "uuid",
      "property_id": "uuid",
      "inspection_date": "2024-01-20",
      "drainage_condition": "good",
      "blockages_found": false,
      "structural_issues": false,
      "risk_rating": 1,
      "recommendations": "Continue regular maintenance",
      "created_at": "2024-01-20T14:30:00Z"
    }
  ]
}
```

#### POST `/api/drainage-reports`

Creates a new drainage inspection report.

**Request Body:**
```json
{
  "property_id": "uuid",
  "inspection_date": "2024-01-20",
  "drainage_condition": "good",
  "blockages_found": false,
  "structural_issues": false,
  "flow_rate": "excellent",
  "visual_condition": "good",
  "recommendations": "Continue regular maintenance",
  "risk_rating": 1
}
```

---

### Properties

#### GET `/api/properties`

Retrieves all properties for the authenticated user.

**Response:**
```json
{
  "properties": [
    {
      "id": "uuid",
      "name": "Main Store",
      "address": "123 High Street, London",
      "property_type": "retail",
      "floor_area": 1500,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/properties`

Creates a new property.

**Request Body:**
```json
{
  "name": "New Store",
  "address": "456 Main Street, London",
  "property_type": "retail",
  "floor_area": 2000,
  "postcode": "SW1A 1AA"
}
```

---

### Risk Assessment

#### GET `/api/risk-assessment/{property_id}`

Calculates risk assessment for a specific property.

**Response:**
```json
{
  "property_id": "uuid",
  "overall_risk_score": 75,
  "risk_grade": "Good",
  "categories": {
    "electrical": {
      "score": 80,
      "status": "satisfactory",
      "last_inspection": "2024-01-15"
    },
    "drainage": {
      "score": 85,
      "status": "good",
      "last_inspection": "2024-01-20"
    },
    "fire_safety": {
      "score": 70,
      "status": "adequate",
      "last_inspection": "2024-01-10"
    }
  },
  "recommendations": [
    "Schedule fire safety equipment service",
    "Consider upgrading electrical panel"
  ]
}
```

---

## Error Handling

All API endpoints return errors in the following format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "field": "inspection_date",
      "issue": "Date must be in YYYY-MM-DD format"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required or invalid
- `FORBIDDEN` - User lacks permission
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

API requests are limited to:
- 100 requests per minute per user
- 1000 requests per hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1640995200
```

---

## Data Models

### Electrical Report Model

```typescript
interface ElectricalReport {
  id: string
  property_id: string
  inspection_type: 'eicr' | 'pat_testing' | 'fire_alarm_testing'
  certificate_number: string
  inspector_name: string
  inspector_qualification: string
  inspection_date: string
  next_inspection_due: string
  overall_condition: 'excellent' | 'good' | 'satisfactory' | 'poor' | 'dangerous'
  remedial_work_required: boolean
  remedial_work_description?: string
  remedial_work_priority?: 'immediate' | 'high' | 'medium' | 'low'
  test_results: TestResults
  risk_rating: number
  compliance_status: 'compliant' | 'non_compliant' | 'partially_compliant'
  created_at: string
  updated_at: string
}
```

### Property Model

```typescript
interface Property {
  id: string
  organisation_id: string
  name: string
  address: string
  postcode: string
  property_type: 'retail' | 'office' | 'warehouse'
  floor_area: number
  created_at: string
  updated_at: string
}
```

---

## Testing

Use the following test endpoints in development:

### Health Check
```
GET /api/health
```

### Test Authentication
```
GET /api/test-auth
```

Include test data seeds for development in `/api/test-data`.