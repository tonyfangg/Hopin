# Unified Risk Scoring System

## Overview

The Unified Risk Scoring System provides a standardized approach to risk assessment across the Hoops Store Operations platform. It consolidates risk calculations from various data sources (electrical reports, drainage reports, etc.) into a single, consistent scoring framework.

## Architecture

### Core Components

1. **Risk Types** (`app/lib/types/risk-types.ts`)
   - `RiskScore`: Unified risk score interface
   - `RiskLevel`: Enum for risk levels (LOW, MEDIUM, HIGH, CRITICAL)
   - `RiskLevelConfig`: Configuration for each risk level
   - `UnifiedRiskCategory`: Risk categories with weights and descriptions

2. **Risk Scoring Utils** (`app/lib/utils/risk-scoring.ts`)
   - `RiskScoringUtils` class with static methods for risk calculations
   - Score conversion between safety and risk scales
   - Risk level determination and styling

3. **UI Components**
   - `RiskBadge`: Displays risk levels with consistent styling
   - `RiskMeter`: Circular gauge for risk score visualization
   - `UnifiedRiskOverview`: Comprehensive risk dashboard component

## Risk Levels

| Level | Range | Color | Description | Action |
|-------|-------|-------|-------------|--------|
| LOW | 0-30 | Emerald | Minimal risk, standard monitoring | Continue current practices |
| MEDIUM | 31-60 | Amber | Moderate risk, enhanced monitoring | Review and improve |
| HIGH | 61-80 | Red | Elevated risk, immediate attention required | Take immediate action |
| CRITICAL | 81-100 | Dark Red | Critical risk, urgent intervention needed | Emergency response required |

## Risk Categories

The system uses 8 weighted categories to calculate overall risk:

1. **Security & Risk Management** (25% weight)
   - Fire safety, CCTV, compliance
   - Data source: Electrical safety scores

2. **Property & Asset Factors** (20% weight)
   - Building condition, electrical, drainage
   - Data source: Electrical and drainage reports

3. **Operational Risk** (15% weight)
   - Staff training, procedures, turnover
   - Data source: Mock data (to be integrated)

4. **Business-Specific Factors** (10% weight)
   - Industry type, size, claims history
   - Data source: Mock data (to be integrated)

5. **Location-Based Factors** (8% weight)
   - Crime rate, postcode risk, hazards
   - Data source: Mock data (to be integrated)

6. **Financial & Administrative** (8% weight)
   - Credit history, stability
   - Data source: Mock data (to be integrated)

7. **Specialised Risk** (8% weight)
   - Cybersecurity, supply chain
   - Data source: Mock data (to be integrated)

8. **Market & External** (6% weight)
   - Inflation, regulatory changes
   - Data source: Mock data (to be integrated)

## Usage Examples

### Basic Risk Badge
```tsx
import { RiskBadge } from '@/components/ui/risk-badge'

<RiskBadge score={75} showScore={true} size="md" />
```

### Risk Meter
```tsx
import { RiskMeter } from '@/components/ui/risk-meter'

<RiskMeter 
  score={65} 
  size={120} 
  showLabel={true} 
  showScore={true} 
/>
```

### Risk Scoring Calculations
```tsx
import { RiskScoringUtils } from '@/app/lib/utils/risk-scoring'

// Convert safety score to risk score
const riskScore = RiskScoringUtils.safetyToRiskScore(85) // Returns 15

// Get risk level from score
const level = RiskScoringUtils.scoreToRiskLevel(75) // Returns 'HIGH'

// Calculate overall risk from category scores
const overallRisk = RiskScoringUtils.calculateOverallRisk({
  security_risk_management: 25,
  property_asset_factors: 30,
  // ... other categories
})
```

### Complete Risk Overview
```tsx
import { UnifiedRiskOverview } from '@/components/dashboard/unified-risk-overview'

<UnifiedRiskOverview propertyId="property-123" />
```

## Data Integration

### Current Data Sources

1. **Electrical Reports** (`/api/electrical-reports`)
   - Provides safety scores for electrical compliance
   - Used for Security & Risk Management category

2. **Drainage Reports** (`/api/drainage-reports`)
   - Provides safety scores for drainage systems
   - Used for Property & Asset Factors category

### Future Data Sources

The system is designed to integrate additional data sources:

- Staff training records
- Claims history
- Financial data
- Location-based risk data
- Cybersecurity assessments

## API Integration

### Risk Calculation API

```typescript
// POST /api/risk-calculation
interface RiskCalculationRequest {
  propertyId: string
  categoryScores: Record<string, number>
}

interface RiskCalculationResponse {
  success: boolean
  data: {
    overallRiskScore: number
    overallSafetyScore: number
    categoryScores: Record<string, number>
    riskLevel: RiskLevel
    recommendations: string[]
  }
}
```

## Styling and Theming

The system uses Tailwind CSS classes for consistent styling:

- **Low Risk**: `text-emerald-600 bg-emerald-50`
- **Medium Risk**: `text-amber-600 bg-amber-50`
- **High Risk**: `text-red-600 bg-red-50`
- **Critical Risk**: `text-red-800 bg-red-100`

## Error Handling

The system includes comprehensive error handling:

1. **Data Validation**: All risk scores are validated to be 0-100
2. **Fallback Values**: Default to medium risk (50) when data is unavailable
3. **Loading States**: Skeleton loaders during data fetching
4. **Error States**: User-friendly error messages

## Performance Considerations

1. **Caching**: Risk calculations are cached to avoid redundant API calls
2. **Lazy Loading**: Components load data only when needed
3. **Optimistic Updates**: UI updates immediately while background sync occurs

## Testing

### Unit Tests
```typescript
// Test risk level calculation
expect(RiskScoringUtils.scoreToRiskLevel(25)).toBe(RiskLevel.LOW)
expect(RiskScoringUtils.scoreToRiskLevel(75)).toBe(RiskLevel.HIGH)

// Test score conversion
expect(RiskScoringUtils.safetyToRiskScore(80)).toBe(20)
expect(RiskScoringUtils.riskToSafetyScore(30)).toBe(70)
```

### Integration Tests
- Test API endpoints with real data
- Verify component rendering with different risk levels
- Test error handling scenarios

## Migration Guide

### From Old Risk System

1. Replace individual risk components with unified components
2. Update API calls to use new risk calculation endpoints
3. Migrate existing risk scores to 0-100 scale
4. Update UI to use new risk level styling

### Example Migration
```tsx
// Old
<RiskScoreCard score={85} level="good" />

// New
<RiskBadge score={15} /> // Inverted scale
```

## Future Enhancements

1. **Machine Learning Integration**: Predictive risk modeling
2. **Real-time Updates**: Live risk score updates
3. **Historical Tracking**: Risk score trends over time
4. **Custom Categories**: User-defined risk categories
5. **Advanced Analytics**: Risk correlation analysis

## Support

For questions or issues with the unified risk system:

1. Check the component documentation
2. Review the API integration guide
3. Test with the provided examples
4. Contact the development team

---

*Last updated: December 2024* 