import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Award, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

// ChartData interface removed; charts derive structure from fetched data

interface EnhancedChartsProps {
  scores: Record<string, number>;
  benchmarks?: Record<string, number>;
  trends?: Record<string, number>;
  dealershipId?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const EnhancedCharts: React.FC<EnhancedChartsProps> = ({
  scores,
  benchmarks = {},
  trends = {},
  dealershipId
}) => {
  // Prepare data for charts
  const radarData = Object.entries(scores).map(([key, value]) => ({
    subject: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: value,
    benchmark: benchmarks[key] || 75,
    fullMark: 100
  }));

  const barData = Object.entries(scores).map(([key, value], index) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: value,
    benchmark: benchmarks[key] || 75,
    trend: trends[key] || 0,
    color: COLORS[index % COLORS.length]
  }));

  const pieData = Object.entries(scores).map(([key, value], index) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: value,
    color: COLORS[index % COLORS.length]
  }));

  // Performance distribution data
  const performanceDistribution = [
    { range: '90-100', count: Object.values(scores).filter(s => s >= 90).length, color: '#10b981' },
    { range: '80-89', count: Object.values(scores).filter(s => s >= 80 && s < 90).length, color: '#3b82f6' },
    { range: '70-79', count: Object.values(scores).filter(s => s >= 70 && s < 80).length, color: '#f59e0b' },
    { range: '60-69', count: Object.values(scores).filter(s => s >= 60 && s < 70).length, color: '#f97316' },
    { range: '<60', count: Object.values(scores).filter(s => s < 60).length, color: '#ef4444' }
  ];

  interface TrendPoint {
    month: string;
    overall: number;
    target: number;
  }

  const [trendData, setTrendData] = useState<TrendPoint[]>([]);

  useEffect(() => {
    if (!dealershipId) return;

    const fetchData = async () => {
      const { data, error } = await supabase.rpc('get_historical_scores', {
        dealership_id: dealershipId,
      });
      if (!error && data) {
        const mapped = data.map((row: { created_at: string; overall_score: number }) => ({
          month: new Date(row.created_at).toLocaleDateString('en', { month: 'short' }),
          overall: row.overall_score || 0,
          target: 80,
        }));
        setTrendData(mapped);
      }
    };

    fetchData();

    const channel = supabase
      .channel('score_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assessments',
          filter: `dealership_id=eq.${dealershipId}`,
        },
        (payload) => {
          const newPoint = {
            month: new Date(payload.new.created_at).toLocaleDateString('en', { month: 'short' }),
            overall: payload.new.overall_score || 0,
            target: 80,
          };
          setTrendData((prev) => [...prev, newPoint]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dealershipId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart - Performance Overview */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Performance Radar Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Your Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Industry Benchmark"
                dataKey="benchmark"
                stroke="#10b981"
                fill="none"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Score vs Benchmark
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" name="Your Score" />
              <Bar dataKey="benchmark" fill="#10b981" name="Benchmark" opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => `${range}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {performanceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={trendData.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="overall"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Overall Performance"
                    isAnimationActive
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    name="Target"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Key Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barData.map((item) => {
              const isAboveBenchmark = item.score > item.benchmark;
              const difference = Math.abs(item.score - item.benchmark);
              
              return (
                <div key={item.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    {isAboveBenchmark ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Score:</span>
                      <Badge variant={item.score >= 70 ? 'default' : 'destructive'}>
                        {item.score.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Benchmark:</span>
                      <span className="text-muted-foreground">{item.benchmark.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gap:</span>
                      <span className={isAboveBenchmark ? 'text-green-600' : 'text-red-600'}>
                        {isAboveBenchmark ? '+' : '-'}{difference.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
