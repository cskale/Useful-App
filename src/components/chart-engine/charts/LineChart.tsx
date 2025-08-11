import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { motion } from 'framer-motion';
import type { SimpleData } from './BarChart';
import AnimatedTooltip from './AnimatedTooltip';

interface LineChartProps {
  data: SimpleData[];
}

interface DotProps {
  cx?: number;
  cy?: number;
}

const AnimatedDot = (props: DotProps) => {
  const { cx, cy } = props;
  return (
    <motion.circle cx={cx} cy={cy} r={4} fill="#818cf8" initial={{ scale: 0 }} animate={{ scale: 1 }} />
  );
};

const LineChartModule: React.FC<LineChartProps> = React.memo(({ data }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<AnimatedTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={<AnimatedDot />} activeDot={{ r: 6 }} filter="url(#lineGlow)" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

export default LineChartModule;
