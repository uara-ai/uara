# AI Analysis Components

This folder contains the refactored sub-components that were extracted from the large `ai-whoop-analysis.tsx` component to improve maintainability and code organization.

## Components

### `overall-health-score.tsx`

- Displays the main health score with progress bar
- Shows sub-metrics for recovery, sleep, and strain
- Takes a large 2x2 grid space on desktop

### `quick-metrics.tsx`

- Contains the four metric cards (HRV, Resting HR, Sleep Efficiency, Weekly Workouts)
- Each metric card is reusable with configurable icon, color, value, and label

### `analysis-results.tsx`

- Handles both success and instruction states for AI analysis
- Success state shows analysis summary and key recommendations
- Instruction state shows sample questions and benefits

### `detailed-analysis.tsx`

- Displays the three detailed analysis cards (Recovery, Sleep, Strain)
- Each card shows score, insights, and recommendations
- Reusable card component for consistent styling

### `risk-factors-and-positive-indicators.tsx`

- Shows risk factors that need attention
- Displays positive health indicators
- Only renders if there are items to show

### `index.ts`

- Barrel export file for easy imports
- Centralizes all component exports

## Usage

```tsx
import {
  OverallHealthScore,
  QuickMetrics,
  AnalysisResults,
  DetailedAnalysis,
  RiskFactorsAndPositiveIndicators,
} from './ai-analysis';

// Use components in main component
<OverallHealthScore aiAnalysis={aiAnalysis} whoopStats={whoopStats} isLoading={isLoading} />
<QuickMetrics whoopStats={whoopStats} />
<AnalysisResults aiAnalysis={aiAnalysis} isLoading={isLoading} error={error} onRefreshAnalysis={generateAIAnalysis} />
{aiAnalysis && <DetailedAnalysis aiAnalysis={aiAnalysis} />}
{aiAnalysis && <RiskFactorsAndPositiveIndicators aiAnalysis={aiAnalysis} />}
```

## Benefits

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the app
3. **Testing**: Smaller components are easier to unit test
4. **Code Organization**: Related functionality is grouped together
5. **Performance**: Smaller components can be optimized individually

## Cursor rules applied correctly.
