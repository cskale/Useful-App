import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Rectangle } from 'recharts';
import { motion } from 'framer-motion';
import AnimatedTooltip from './AnimatedTooltip';

export interface SimpleData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: SimpleData[];
}

const BarChartModule: React.FC<BarChartProps> = React.memo(({ data }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<AnimatedTooltip />} animationDuration={300} />
          <Legend />
          <Bar dataKey="value" fill="url(#barGradient)" radius={4} activeBar={<Rectangle fillOpacity={0.9} stroke="#818cf8" />} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

export default BarChartModule;
