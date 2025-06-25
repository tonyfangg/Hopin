# API Endpoint Testing Commands

## Prerequisites
1. Make sure your Next.js development server is running: `npm run dev`
2. Replace `YOUR_SUPABASE_ANON_KEY` with your actual Supabase anon key
3. Replace `YOUR_ORGANISATION_ID` with an actual organisation ID from your database

## Basic GET Endpoints

### 1. Dashboard Statistics
```bash
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 2. Get All Organisations
```bash
curl -X GET http://localhost:3000/api/organisations \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 3. Get All Properties
```bash
curl -X GET http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 4. Get Properties by Organisation
```bash
curl -X GET "http://localhost:3000/api/properties?organisation_id=YOUR_ORGANISATION_ID" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 5. Get All Electrical Reports
```bash
curl -X GET http://localhost:3000/api/electrical-reports \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 6. Get Electrical Reports by Property
```bash
curl -X GET "http://localhost:3000/api/electrical-reports?property_id=YOUR_PROPERTY_ID" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 7. Get All Drainage Reports
```bash
curl -X GET http://localhost:3000/api/drainage-reports \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 8. Get All Documents
```bash
curl -X GET http://localhost:3000/api/documents \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 9. Get Documents by Category
```bash
curl -X GET "http://localhost:3000/api/documents?category=certificates" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 10. Get Expiring Documents
```bash
curl -X GET "http://localhost:3000/api/documents?expiring_in_days=30" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 11. Get All Risk Assessments
```bash
curl -X GET http://localhost:3000/api/risk-assessments \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

## POST Endpoints (Create Operations)

### 12. Create Organisation
```bash
curl -X POST http://localhost:3000/api/organisations \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Organisation Ltd",
    "address": "123 Business Street",
    "postcode": "SW1A 1AA",
    "contact_person": "John Smith",
    "contact_email": "john@testorg.com",
    "contact_phone": "020 1234 5678",
    "registration_number": "12345678",
    "vat_number": "GB123456789",
    "industry_sector": "Retail"
  }'
```

### 13. Create Property
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "organisation_id": "YOUR_ORGANISATION_ID",
    "name": "Test Store",
    "address": "456 High Street",
    "postcode": "W1A 1AA",
    "property_type": "commercial",
    "number_of_floors": 2,
    "year_built": 1990,
    "square_footage": 5000,
    "construction_type": "brick",
    "occupancy_type": "retail"
  }'
```

### 14. Create Electrical Report
```bash
curl -X POST http://localhost:3000/api/electrical-reports \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": "YOUR_PROPERTY_ID",
    "inspection_type": "periodic",
    "report_date": "2024-01-15",
    "inspector_name": "Michael Brown",
    "inspector_qualification": "NICEIC Approved",
    "certificate_number": "ELEC-2024-001",
    "next_inspection_due": "2025-01-15",
    "status": "pass",
    "overall_condition": "good",
    "findings": "All electrical systems are in good working order",
    "recommendations": "Continue with regular maintenance schedule",
    "action_required": false
  }'
```

### 15. Create Drainage Report
```bash
curl -X POST http://localhost:3000/api/drainage-reports \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": "YOUR_PROPERTY_ID",
    "inspection_type": "cctv",
    "report_date": "2024-01-10",
    "inspector_name": "Robert Green",
    "inspector_qualification": "CCTV Surveyor",
    "certificate_number": "DRAIN-2024-001",
    "next_inspection_due": "2025-01-10",
    "status": "pass",
    "overall_condition": "excellent",
    "findings": "Drainage system is functioning correctly",
    "recommendations": "Continue with regular maintenance",
    "action_required": false
  }'
```

### 16. Create Document
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "organisation_id": "YOUR_ORGANISATION_ID",
    "property_id": "YOUR_PROPERTY_ID",
    "category": "certificates",
    "document_type": "electrical_certificate",
    "title": "Electrical Certificate 2024",
    "description": "Annual electrical safety certificate",
    "file_name": "electrical-cert-2024.pdf",
    "file_path": "organisations/YOUR_ORGANISATION_ID/properties/YOUR_PROPERTY_ID/certificates/electrical-cert-2024.pdf",
    "file_size_bytes": 2048576,
    "mime_type": "application/pdf",
    "is_confidential": false,
    "expiry_date": "2025-01-15"
  }'
```

### 17. Create Risk Assessment
```bash
curl -X POST http://localhost:3000/api/risk-assessments \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": "YOUR_PROPERTY_ID",
    "assessment_type": "fire_safety",
    "assessor_name": "Dr. Elizabeth Black",
    "assessor_qualification": "Fire Safety Assessor",
    "assessment_date": "2024-01-20",
    "overall_risk_level": "low",
    "risk_factors": ["Minor trip hazards in storage areas"],
    "control_measures": ["Clear walkways", "Install warning signs"],
    "recommendations": "Continue with current safety protocols",
    "compliance_status": "compliant"
  }'
```

## File Upload Test

### 18. Upload Document File
```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -F "file=@/path/to/your/document.pdf" \
  -F "organisation_id=YOUR_ORGANISATION_ID" \
  -F "category=certificates" \
  -F "property_id=YOUR_PROPERTY_ID"
```

## PUT Endpoints (Update Operations)

### 19. Update Property
```bash
curl -X PUT http://localhost:3000/api/properties/YOUR_PROPERTY_ID \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Store Name",
    "address": "789 New Street",
    "postcode": "E1A 1AA"
  }'
```

## DELETE Endpoints

### 20. Delete Property
```bash
curl -X DELETE http://localhost:3000/api/properties/YOUR_PROPERTY_ID \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Expected Responses

### Successful Response (200/201)
```json
{
  "organisations": [...],
  "properties": [...],
  "reports": [...],
  "documents": [...],
  "assessments": [...]
}
```

### Error Response (401/403/404/500)
```json
{
  "error": "Error message description"
}
```

## Troubleshooting

1. **401 Unauthorized**: Check your Supabase anon key
2. **403 Forbidden**: User doesn't have permission for the organisation
3. **404 Not Found**: Resource doesn't exist or user doesn't have access
4. **500 Internal Server Error**: Check server logs for details

## Running the Full Test Suite

```bash
./test-api-endpoints.sh
```

This will run all GET endpoint tests automatically. 