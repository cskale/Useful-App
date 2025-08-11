import React, { Suspense, lazy, useMemo, useState, useEffect } from 'react';
import ChartCard from './ChartCard';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SimpleData } from './charts/BarChart';

const LazyBar = lazy(() => import('./charts/BarChart'));
const LazyLine = lazy(() => import('./charts/LineChart'));
const LazyPie = lazy(() => import('./charts/PieChart'));
const LazyArea = lazy(() => import('./charts/AreaChart'));
const LazyRadar = lazy(() => import('./charts/RadarChart'));

export type ChartKind = 'bar' | 'line' | 'pie' | 'area' | 'radar';

interface ChartEngineProps {
  data: SimpleData[];
  title: string;
  description?: string;
  mobileType?: ChartKind;
  desktopType?: ChartKind;
  maxPoints?: number;
}

const chartComponents: Record<ChartKind, React.LazyExoticComponent<React.FC<{ data: SimpleData[] }>>> = {
  bar: LazyBar,
  line: LazyLine,
  pie: LazyPie,
  area: LazyArea,
  radar: LazyRadar,
};

export const ChartEngine: React.FC<ChartEngineProps> = ({
  data,
  title,
  description,
  mobileType = 'pie',
  desktopType = 'bar',
  maxPoints = 50,
}) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const type = isMobile ? mobileType : desktopType;
  const ChartComponent = chartComponents[type];

  const processed = useMemo(() => {
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, idx) => idx % step === 0);
  }, [data, maxPoints]);

  if (!mounted) return null;

  return (
    <ChartCard title={title} description={description}>
      <Suspense fallback={<div className="h-72 flex items-center justify-center">Loading...</div>}>
        <ChartComponent data={processed} />
      </Suspense>
    </ChartCard>
  );
};

export default ChartEngine;
