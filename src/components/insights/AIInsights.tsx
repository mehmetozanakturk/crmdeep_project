'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  Sparkles,
  Award,
  MessageSquare,
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'achievement';
  category: 'sales' | 'marketing' | 'customer' | 'revenue' | 'performance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  actionable: boolean;
  action?: string;
  metric?: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  };
  createdAt: string;
}

// Mock AI-generated insights
const DEMO_INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'prediction',
    category: 'sales',
    title: 'Deal Pipeline at Risk',
    description:
      '3 high-value deals ($45K total) are showing low engagement. Historical data suggests 72% probability of loss if no action taken within 48 hours.',
    impact: 'high',
    confidence: 87,
    actionable: true,
    action: 'Schedule follow-up calls',
    metric: {
      label: 'Potential Revenue at Risk',
      value: '$45,000',
      trend: 'down',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'recommendation',
    category: 'marketing',
    title: 'Optimize Campaign Spend',
    description:
      'Meta Ads campaign "Spring Promo" is underperforming (2.1% CTR vs. 4.5% avg). Reallocating $2K to Google Ads could increase conversions by 35%.',
    impact: 'high',
    confidence: 79,
    actionable: true,
    action: 'Adjust campaign budget',
    metric: {
      label: 'Potential ROI Increase',
      value: '+35%',
      trend: 'up',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'alert',
    category: 'customer',
    title: 'Churn Risk Detected',
    description:
      '5 enterprise customers (worth $180K ARR) have decreased activity by 60% in the last 30 days. Average churn time for this pattern: 45 days.',
    impact: 'high',
    confidence: 92,
    actionable: true,
    action: 'Launch retention campaign',
    metric: {
      label: 'ARR at Risk',
      value: '$180,000',
      trend: 'down',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'prediction',
    category: 'revenue',
    title: 'Revenue Forecast Exceeds Target',
    description:
      'Based on current pipeline velocity and win rates, Q1 revenue is projected to exceed target by 18%. Continue current sales strategy.',
    impact: 'medium',
    confidence: 83,
    actionable: false,
    metric: {
      label: 'Projected Revenue',
      value: '$520,000',
      trend: 'up',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    type: 'recommendation',
    category: 'sales',
    title: 'Best Time to Contact Leads',
    description:
      'Analysis of 1,200+ interactions shows 3x higher response rate when contacting leads on Tuesday/Wednesday between 10-11 AM.',
    impact: 'medium',
    confidence: 88,
    actionable: true,
    action: 'Adjust outreach schedule',
    metric: {
      label: 'Expected Response Lift',
      value: '+3x',
      trend: 'up',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    type: 'achievement',
    category: 'performance',
    title: 'Conversion Rate Milestone',
    description:
      'Your team achieved 23% lead-to-customer conversion rate this month - 40% above industry average. Top performer: Sarah Johnson (31%).',
    impact: 'low',
    confidence: 100,
    actionable: false,
    metric: {
      label: 'Conversion Rate',
      value: '23%',
      trend: 'up',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    type: 'recommendation',
    category: 'customer',
    title: 'Upsell Opportunity',
    description:
      '12 customers are using 90%+ of their plan limits. AI models predict 85% likelihood of accepting upgrade offer in next 2 weeks.',
    impact: 'high',
    confidence: 85,
    actionable: true,
    action: 'Create upsell campaign',
    metric: {
      label: 'Potential MRR Increase',
      value: '+$8,400',
      trend: 'up',
    },
    createdAt: new Date().toISOString(),
  },
];

export function AIInsights() {
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'prediction':
        return Brain;
      case 'recommendation':
        return Lightbulb;
      case 'alert':
        return AlertTriangle;
      case 'achievement':
        return Award;
      default:
        return Sparkles;
    }
  };

  const getCategoryIcon = (category: Insight['category']) => {
    switch (category) {
      case 'sales':
        return Target;
      case 'marketing':
        return MessageSquare;
      case 'customer':
        return Users;
      case 'revenue':
        return DollarSign;
      case 'performance':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
      case 'medium':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'low':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
    }
  };

  const getTypeColor = (type: Insight['type']) => {
    switch (type) {
      case 'prediction':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'recommendation':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'alert':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'achievement':
        return 'bg-green-100 dark:bg-green-900/30';
    }
  };

  const highImpactInsights = DEMO_INSIGHTS.filter((i) => i.impact === 'high');
  const actionableInsights = DEMO_INSIGHTS.filter((i) => i.actionable);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5">
            <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              AI-Powered Insights
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Predictive analytics and intelligent recommendations
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {DEMO_INSIGHTS.length} Active Insights
        </Badge>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">High Priority</p>
                <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">
                  {highImpactInsights.length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-error-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Actionable</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {actionableInsights.length}
                </p>
              </div>
              <Target className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg Confidence</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {Math.round(
                    DEMO_INSIGHTS.reduce((sum, i) => sum + i.confidence, 0) / DEMO_INSIGHTS.length
                  )}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {DEMO_INSIGHTS.map((insight) => {
          const TypeIcon = getInsightIcon(insight.type);
          const CategoryIcon = getCategoryIcon(insight.category);

          return (
            <Card
              key={insight.id}
              className="border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`rounded-lg ${getTypeColor(insight.type)} p-2.5`}>
                      <TypeIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <CategoryIcon className="h-3 w-3" />
                            {insight.category}
                          </Badge>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="mt-2">{insight.description}</CardDescription>

                      {/* Metric */}
                      {insight.metric && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            {insight.metric.label}:
                          </span>
                          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            {insight.metric.value}
                          </span>
                          {insight.metric.trend && (
                            <span>
                              {insight.metric.trend === 'up' ? (
                                <TrendingUp className="h-4 w-4 text-success-600" />
                              ) : insight.metric.trend === 'down' ? (
                                <TrendingDown className="h-4 w-4 text-error-600" />
                              ) : null}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Confidence */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 min-w-[60px]">
                          {insight.confidence}% confident
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {insight.actionable && insight.action && (
                <CardContent className="pt-0">
                  <Button className="w-full sm:w-auto">
                    {insight.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Powered by AI Notice */}
      <Card className="border-neutral-200 dark:border-neutral-700 bg-primary-50 dark:bg-primary-900/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Powered by Agentic AI
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                These insights are generated by analyzing your CRM data, industry benchmarks, and
                historical patterns. The AI continuously learns from your business to provide more
                accurate predictions over time.
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                Last updated: {new Date().toLocaleString()} • Next update: in 4 hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
