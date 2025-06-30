# Risk Calculation API Documentation

## Overview

The Risk Calculation API provides comprehensive risk assessment capabilities for properties and organisations. It integrates with the sophisticated risk calculation system to provide real-time risk analysis, historical trends, and actionable insights.

## API Endpoints

### 1. Main Risk Calculation API
**Endpoint:** `POST /api/risk-calculation`

**Authentication:** Required

**Description:** Main endpoint for all risk calculation operations

**Request Body:**
```json
{
  "action": "calculate_property|calculate_organisation|compare_properties|get_history|get_summary|get_trends",
  "propertyId": "uuid",
  "organisationId": "uuid",
  "propertyIds": ["uuid1", "uuid2"],
  "overrides": {}
}
```

**Actions:**

#### `calculate_property`
Calculates risk assessment for a single property.

**Required:** `propertyId`
**Optional:** `overrides` - Risk factor overrides

**Response:**
```json
{
  "assessment": {
    "propertyId": "uuid",
    "assessmentDate": "2024-01-01T00:00:00Z",
    "overallScore": 75.5,
    "riskLevel": "HIGH",
    "breakdown": [...]
  }
}
```

#### `calculate_organisation`
Calculates risk assessments for all properties in an organisation.

**Required:** `organisationId`

**Response:**
```json
{
  "assessments": [
    {
      "propertyId": "uuid",
      "overallScore": 75.5,
      "riskLevel": "HIGH",
      "breakdown": [...]
    }
  ]
}
```

#### `compare_properties`
Compares risk assessments across multiple properties.

**Required:** `propertyIds` (array)

**Response:**
```json
{
  "comparison": {
    "averageScore": 72.3,
    "highestRisk": "uuid1",
    "lowestRisk": "uuid2",
    "riskDistribution": {...}
  },
  "properties": [...]
}
```

#### `get_history`
Retrieves historical risk assessments for a property.

**Required:** `propertyId`

**Response:**
```json
{
  "history": [
    {
      "assessmentDate": "2024-01-01T00:00:00Z",
      "overallScore": 75.5,
      "riskLevel": "HIGH"
    }
  ]
}
```

#### `get_summary`
Gets risk summary for an organisation.

**Required:** `organisationId`

**Response:**
```json
{
  "summary": {
    "totalProperties": 10,
    "averageRiskScore": 72.3,
    "riskDistribution": {...},
    "criticalProperties": 2,
    "highRiskProperties": 3
  }
}
```

#### `get_trends`
Gets risk trends for a property.

**Required:** `propertyId`

**Response:**
```json
{
  "trends": {
    "direction": "improving|stable|deteriorating",
    "change": -5.2,
    "period": "30_days",
    "dataPoints": [...]
  }
}
```

### 2. Property Risk Dashboard API
**Endpoint:** `GET /api/properties/[id]/risk`

**Authentication:** Required

**Description:** Comprehensive risk dashboard data for a single property

**Response:**
```json
{
  "property": {
    "id": "uuid",
    "name": "Property Name",
    "address": "123 Main St",
    "property_type": "retail",
    "floor_area_sqm": 1000,
    "building_age_years": 15,
    "risk_score": 75.5,
    "safety_score": 82.3,
    "organisations": {
      "name": "Organisation Name"
    }
  },
  "currentAssessment": {
    "overallScore": 75.5,
    "riskLevel": "HIGH",
    "breakdown": [...]
  },
  "history": [...],
  "riskTrend": {
    "direction": "improving",
    "change": -5.2,
    "period": "30_days"
  },
  "recommendations": [
    {
      "category": "Electrical Safety",
      "priority": "HIGH",
      "title": "Address Electrical Compliance",
      "description": "This factor is contributing 25% to the Electrical Safety risk...",
      "estimatedImpact": 12.5
    }
  ]
}
```

### 3. Organisation Risk Dashboard API
**Endpoint:** `GET /api/organisations/[id]/risk`

**Authentication:** Required

**Description:** Comprehensive risk dashboard data for an entire organisation

**Response:**
```json
{
  "organisation": {
    "id": "uuid",
    "name": "Organisation Name",
    "type": "retail",
    "address": "456 Business Ave"
  },
  "riskOverview": {
    "averageScore": 72.3,
    "highestRisk": "uuid1",
    "lowestRisk": "uuid2",
    "riskDistribution": {...}
  },
  "properties": [...],
  "riskMatrix": {
    "categories": ["Electrical", "Drainage", "Security"],
    "properties": [
      {
        "propertyId": "uuid",
        "propertyName": "Property Name",
        "categoryScores": [75, 60, 45]
      }
    ]
  },
  "actionItems": [
    {
      "priority": "CRITICAL",
      "propertyCount": 2,
      "title": "Critical Risk Properties Require Immediate Attention",
      "description": "2 properties have critical risk levels...",
      "affectedProperties": ["uuid1", "uuid2"]
    }
  ]
}
```

### 4. Test Risk Calculation API
**Endpoint:** `GET /api/test-risk-calculation`

**Authentication:** Not required (for testing)

**Description:** Test endpoint to verify risk calculation system integration

**Response:**
```json
{
  "success": true,
  "message": "Risk calculation system is properly integrated",
  "testPropertyId": "test-property-123",
  "assessment": {
    "propertyId": "uuid",
    "overallScore": 75.5,
    "riskLevel": "HIGH",
    "categoryCount": 8,
    "assessmentDate": "2024-01-01T00:00:00Z"
  }
}
```

**POST Method:**
```json
{
  "action": "calculate_property",
  "propertyId": "uuid"
}
```

## Risk Levels

- **LOW (0-30):** Minimal risk, standard monitoring
- **MEDIUM (31-60):** Moderate risk, enhanced monitoring
- **HIGH (61-80):** Elevated risk, immediate attention required
- **CRITICAL (81-100):** Critical risk, urgent intervention needed

## Risk Categories

The system evaluates risk across multiple categories:

1. **Electrical Safety** - Electrical compliance, inspection history
2. **Drainage & Plumbing** - Drainage maintenance, issue history
3. **Building Structure** - Age, condition, structural integrity
4. **Security & Access** - Security systems, access control
5. **Fire Safety** - Fire alarms, extinguishers, emergency lighting
6. **Compliance & Documentation** - Regulatory compliance, documentation
7. **Operational Risk** - Staff training, procedures, turnover
8. **Financial Risk** - Credit history, financial stability
9. **Market Risk** - Industry trends, regulatory changes
10. **Cybersecurity** - Digital security, data protection

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200:** Success
- **400:** Bad Request (missing parameters, invalid action)
- **401:** Unauthorised (authentication required)
- **404:** Not Found (property/organisation not found)
- **500:** Internal Server Error

Error responses include:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Usage Examples

### Calculate Property Risk
```bash
curl -X POST /api/risk-calculation \
  -H "Content-Type: application/json" \
  -d '{
    "action": "calculate_property",
    "propertyId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### Get Property Risk Dashboard
```bash
curl -X GET /api/properties/123e4567-e89b-12d3-a456-426614174000/risk
```

### Compare Multiple Properties
```bash
curl -X POST /api/risk-calculation \
  -H "Content-Type: application/json" \
  -d '{
    "action": "compare_properties",
    "propertyIds": [
      "123e4567-e89b-12d3-a456-426614174000",
      "987fcdeb-51a2-43d1-b789-123456789abc"
    ]
  }'
```

### Get Organisation Risk Summary
```bash
curl -X GET /api/organisations/456e7890-e89b-12d3-a456-426614174000/risk
```

## Integration Notes

1. **Authentication:** All production endpoints require valid Supabase authentication
2. **Data Sources:** Risk calculations use real data from electrical reports, drainage reports, property details, and compliance records
3. **Real-time:** Assessments are calculated in real-time based on current data
4. **Historical:** Historical assessments are stored and can be retrieved for trend analysis
5. **Customisation:** Risk factors can be overridden for specific calculations
6. **Performance:** Calculations are optimised for large property portfolios

## Testing

Use the test endpoint to verify system integration:
```bash
curl -X GET /api/test-risk-calculation
```

This endpoint doesn't require authentication and provides detailed feedback about the risk calculation system status. 