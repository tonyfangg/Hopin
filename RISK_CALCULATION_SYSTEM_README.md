# Risk Calculation System - Comprehensive Documentation

## 🎯 Overview

The Risk Calculation System is a sophisticated, production-ready risk assessment platform integrated into the Hoops Store Operations Next.js application. It provides real-time risk analysis, historical tracking, and actionable insights for property and organisation risk management.

## 🏗️ System Architecture

### Core Components

```
app/
├── lib/
│   ├── types/
│   │   └── risk-types.ts                 # TypeScript interfaces
│   ├── services/
│   │   ├── property-risk-service.ts      # Risk calculation engine
│   │   ├── risk-data-transformer.ts      # Data transformation utilities
│   │   └── risk-assessment-repository.ts # Database operations
│   └── api/
│       └── risk-calculation-api.ts       # High-level API interface
├── api/
│   ├── risk-calculation/route.ts         # Main API endpoint
│   ├── properties/[id]/risk/route.ts     # Property risk dashboard
│   ├── organisations/[id]/risk/route.ts  # Organisation risk dashboard
│   └── test-risk-calculation/route.ts    # Testing endpoint
└── components/
    └── dashboard/
        ├── risk-calculation.tsx          # Property risk dashboard
        └── organisation-risk-dashboard.tsx # Organisation risk dashboard
```

## 🔧 Core Features

### 1. Real-time Risk Calculation
- **Multi-factor Analysis**: 10 comprehensive risk categories
- **Dynamic Scoring**: Real-time calculations based on live data
- **Weighted Algorithms**: Sophisticated scoring with category weights
- **British Standards**: UK-specific compliance and terminology

### 2. Risk Categories
1. **Electrical Safety** - Compliance, inspection history, system age
2. **Drainage & Plumbing** - Maintenance frequency, issue history
3. **Building Structure** - Age, condition, structural integrity
4. **Security & Access** - Security systems, access control
5. **Fire Safety** - Fire alarms, extinguishers, emergency lighting
6. **Compliance & Documentation** - Regulatory compliance, documentation
7. **Operational Risk** - Staff training, procedures, turnover
8. **Financial Risk** - Credit history, financial stability
9. **Market Risk** - Industry trends, regulatory changes
10. **Cybersecurity** - Digital security, data protection

### 3. Risk Levels
- **LOW (0-30)**: Minimal risk, standard monitoring
- **MEDIUM (31-60)**: Moderate risk, enhanced monitoring
- **HIGH (61-80)**: Elevated risk, immediate attention required
- **CRITICAL (81-100)**: Critical risk, urgent intervention needed

## 🚀 API Endpoints

### 1. Main Risk Calculation API
**Endpoint:** `POST /api/risk-calculation`

**Authentication:** Required

**Actions:**
- `calculate_property` - Calculate risk for single property
- `calculate_organisation` - Calculate risk for all organisation properties
- `compare_properties` - Compare multiple properties
- `get_history` - Retrieve historical assessments
- `get_summary` - Get organisation risk summary
- `get_trends` - Get property risk trends

**Example:**
```bash
curl -X POST /api/risk-calculation \
  -H "Content-Type: application/json" \
  -d '{
    "action": "calculate_property",
    "propertyId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### 2. Property Risk Dashboard API
**Endpoint:** `GET /api/properties/[id]/risk`

**Response includes:**
- Current risk assessment
- Historical data (last 10 assessments)
- Risk trends
- Prioritized recommendations
- Property details

### 3. Organisation Risk Dashboard API
**Endpoint:** `GET /api/organisations/[id]/risk`

**Response includes:**
- Portfolio risk overview
- Risk matrix by category
- Action items
- Property comparisons
- Organisation insights

### 4. Test API
**Endpoint:** `GET /api/test-risk-calculation`

**Purpose:** Verify system integration without authentication

## 🎨 React Components

### 1. RiskCalculationDashboard
**File:** `components/dashboard/risk-calculation.tsx`

**Features:**
- Real-time risk score display
- Interactive category breakdown
- Historical trend charts
- Actionable recommendations
- Advanced controls with overrides
- Risk simulation scenarios

**Usage:**
```tsx
import { RiskCalculationDashboard } from '@/components/dashboard/risk-calculation'

<RiskCalculationDashboard propertyId="property-uuid" />
```

### 2. OrganisationRiskDashboard
**File:** `components/dashboard/organisation-risk-dashboard.tsx`

**Features:**
- Portfolio risk overview
- Risk distribution charts
- Property comparison table
- Risk matrix visualization
- Priority action items
- Portfolio insights

**Usage:**
```tsx
import { OrganisationRiskDashboard } from '@/components/dashboard/organisation-risk-dashboard'

<OrganisationRiskDashboard organisationId="organisation-uuid" />
```

## 📊 Data Flow

### 1. Risk Calculation Process
```
Property Data → Risk Factors → Category Scores → Overall Score → Risk Level
     ↓              ↓              ↓              ↓              ↓
Electrical    →  Compliance   →  Category    →  Weighted    →  LOW/MEDIUM/
Reports          Factors        Scoring        Average        HIGH/CRITICAL
```

### 2. Data Sources
- **Properties Table**: Basic property information
- **Electrical Reports**: Compliance and inspection data
- **Drainage Reports**: Maintenance and issue history
- **Risk Assessments**: Historical risk calculations
- **Organisations**: Organisation details and relationships

### 3. Data Transformation
- **Normalization**: Convert raw values to 0-100 scale
- **Weighting**: Apply category and factor weights
- **Aggregation**: Combine factors into category scores
- **Calculation**: Generate overall risk score and level

## 🔒 Security & Authentication

### Authentication
- All production endpoints require Supabase authentication
- User session validation on every request
- Proper error handling for unauthorized access

### Data Protection
- Secure database queries with proper permissions
- Input validation and sanitization
- Error handling without exposing sensitive information

## 🧪 Testing

### Test Endpoint
```bash
curl -X GET http://localhost:3000/api/test-risk-calculation
```

### Demo Page
Visit: `http://localhost:3000/demo/risk-calculation`

**Features:**
- Interactive demo with sample properties
- System feature overview
- API integration examples
- Real-time component demonstration

## 📈 Advanced Features

### 1. Risk Simulation
- Manual factor overrides
- What-if scenario analysis
- Best/worst case projections
- Impact assessment

### 2. Historical Analysis
- Risk trend tracking
- Performance comparison
- Improvement monitoring
- Benchmark analysis

### 3. Recommendations Engine
- Prioritized action items
- Impact estimation
- Category-specific suggestions
- Implementation guidance

### 4. Portfolio Management
- Organisation-wide risk overview
- Property comparisons
- Risk distribution analysis
- Strategic insights

## 🛠️ Development

### Prerequisites
- Next.js 15.3.3+
- Supabase integration
- TypeScript
- Tailwind CSS

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Schema
The system requires the following tables:
- `properties` - Property information
- `electrical_reports` - Electrical compliance data
- `drainage_reports` - Drainage maintenance data
- `risk_assessments` - Historical risk calculations
- `organisations` - Organisation details

## 📚 Usage Examples

### 1. Calculate Property Risk
```typescript
import { RiskCalculationAPI } from '@/app/lib/api/risk-calculation-api'

const assessment = await RiskCalculationAPI.calculatePropertyRisk(propertyId)
console.log(`Risk Score: ${assessment.overallScore}`)
console.log(`Risk Level: ${assessment.riskLevel}`)
```

### 2. Get Risk History
```typescript
const history = await RiskCalculationAPI.getPropertyRiskHistory(propertyId)
const trends = await RiskCalculationAPI.getPropertyRiskTrends(propertyId)
```

### 3. Compare Properties
```typescript
const comparison = await RiskCalculationAPI.comparePropertyRisks([
  'property-1-uuid',
  'property-2-uuid',
  'property-3-uuid'
])
```

### 4. Organisation Analysis
```typescript
const orgAssessments = await RiskCalculationAPI.calculateOrganisationRisk(organisationId)
const summary = await RiskCalculationAPI.getRiskSummary(organisationId)
```

## 🎯 British English Integration

The system is fully localized for British English with:
- UK-specific risk factors and compliance requirements
- British address formats and postcodes
- UK terminology and spelling
- British regulatory standards
- Local currency symbols (£)

## 🔄 Integration Points

### Frontend Integration
- React components for dashboard displays
- Real-time data updates
- Interactive controls and overrides
- Responsive design for all devices

### Backend Integration
- Supabase database integration
- RESTful API endpoints
- Authentication and authorization
- Error handling and logging

### External Systems
- Property management systems
- Compliance monitoring tools
- Reporting and analytics platforms
- Alert and notification systems

## 📋 API Documentation

Complete API documentation is available in `RISK_CALCULATION_API.md` with:
- Detailed endpoint specifications
- Request/response examples
- Error handling guidelines
- Authentication requirements
- Usage patterns and best practices

## 🚀 Deployment

### Production Deployment
1. Set up production Supabase instance
2. Configure environment variables
3. Deploy to Vercel/Netlify/AWS
4. Set up monitoring and logging
5. Configure backup and recovery

### Performance Optimization
- Database query optimization
- Caching strategies
- API response compression
- Frontend bundle optimization

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style
- Write comprehensive tests
- Update documentation
- Follow security best practices

### Code Structure
- Modular component architecture
- Separation of concerns
- Clear naming conventions
- Comprehensive error handling

## 📞 Support

For technical support or questions:
- Check the API documentation
- Review the demo page
- Test with the test endpoint
- Consult the system logs

## 🔮 Future Enhancements

### Planned Features
- Machine learning risk prediction
- Advanced analytics and reporting
- Mobile application support
- Third-party integrations
- Automated compliance monitoring

### Scalability Improvements
- Microservices architecture
- Advanced caching strategies
- Real-time notifications
- Multi-tenant support

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Production Ready 