# Hoops Store Operations - Claude Context

## Project Overview
Hoops Store Operations is a production-ready Next.js property operations dashboard for UK retail property management. It features real-time risk assessment, compliance monitoring, and comprehensive operational insights with full Supabase integration.

## Tech Stack
- **Frontend**: Next.js 15 with React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Storage)
- **Database**: 22-table enterprise schema with optimized views
- **UI Components**: Radix UI, Heroicons, Lucide React, Recharts
- **Styling**: Tailwind CSS with custom components

## Key Development Commands
```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing APIs (custom script)
./test-api-endpoints.sh   # Test all API endpoints
```

## Project Structure
```
app/
├── api/                    # API routes with Supabase integration
│   ├── auth/              # Authentication endpoints
│   ├── properties/        # Property management APIs
│   ├── organisations/     # Organisation management
│   ├── risk-calculation/  # Risk assessment engine
│   ├── electrical-reports/# Electrical compliance
│   ├── drainage-reports/  # Drainage maintenance
│   └── documents/         # Document management
├── dashboard/             # Main dashboard pages
├── auth/                  # Authentication pages
├── components/            # Reusable React components
├── lib/                   # Utilities and services
│   ├── services/         # Business logic services
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
└── test*/                # Debug/test pages
```

## Core Features
- **Risk Management**: 8-category risk assessment with real-time scoring
- **Property Operations**: Electrical, drainage, building, refrigeration management
- **Organisation Management**: Multi-tenant with granular permissions
- **Document Management**: Centralized storage with version control
- **Staff Management**: Training records and compliance tracking
- **Insurance Integration**: Risk-based premium calculations

## Database Schema
The system uses 22 production tables including:
- User Management: `profiles`, `organisations`, `user_permissions`
- Property Operations: `properties`, `property_overview` (view)
- Risk Management: `risk_assessments`, `risk_categories`, `risk_factors`, `risks`
- Operational Reports: `electrical_reports`, `drainage_reports`, `building_reports`
- Document Management: `documents` with versioning
- Insurance: `insurance_policies`, `claims_management`

## Authentication & Security
- Supabase Auth with JWT tokens
- Role-based access control (organisation and property-level)
- Row Level Security (RLS) policies
- GDPR-compliant data handling
- Complete audit trails

## Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## British English Localization
The system uses British English terminology throughout:
- Properties, organisations, colour, realise, etc.
- UK-specific compliance standards
- British date formats and conventions

## Key Files to Understand
- `app/lib/supabase-client.ts` - Database connection setup
- `app/lib/services/risk-assessment-repository.ts` - Risk calculation logic
- `app/lib/hooks/use-api.ts` - API integration hooks
- `app/components/dashboard/` - Main dashboard components
- `middleware.ts` - Authentication middleware

## Current Status
- ✅ 95% Complete - Production ready
- ✅ Full Supabase integration (no mock data)
- ✅ Complete CRUD operations
- ✅ Real-time risk calculations
- ✅ Responsive UI with British English
- ⚠️ Minor enhancements needed in user assignment UI

## Development Notes
- Uses App Router (Next.js 13+)
- TypeScript strict mode enabled
- Tailwind CSS for styling
- Real-time updates via Supabase subscriptions
- Comprehensive error handling and validation
- Modular component architecture

## Common Development Tasks
1. **Adding new API endpoint**: Create in `app/api/[endpoint]/route.ts`
2. **New dashboard page**: Add to `app/dashboard/[page]/page.tsx`
3. **Database changes**: Update types in `app/lib/types/` and services
4. **New component**: Add to `components/` with proper TypeScript interfaces
5. **Risk calculation updates**: Modify `app/lib/services/risk-assessment-repository.ts`

## Testing
- API endpoints can be tested using `test-api-endpoints.sh`
- Debug pages available at `/test-*` routes
- Authentication testing at `/debug-auth`
- Real data flow testing documented in `REAL_DATA_FLOW_TEST_REPORT.md`