import React from 'react';
import { ChartEngine } from '@/components/chart-engine';
import type { SimpleData } from '@/components/chart-engine/charts/BarChart';

const sample: SimpleData[] = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 35 },
  { name: 'Mar', value: 50 },
  { name: 'Apr', value: 55 },
  { name: 'May', value: 70 },
  { name: 'Jun', value: 65 },
];

export default function ChartsDemo() {
  return (
    <div className="p-4 space-y-4">
      <ChartEngine data={sample} title="Sales" description="Responsive chart demo" desktopType="bar" mobileType="pie" />
      <ChartEngine data={sample} title="Growth" description="Line/Area switch" desktopType="line" mobileType="area" />
    </div>
  );
}
