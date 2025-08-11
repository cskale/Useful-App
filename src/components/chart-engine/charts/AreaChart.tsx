import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { motion } from 'framer-motion';
import type { SimpleData } from './BarChart';
import AnimatedTooltip from './AnimatedTooltip';

interface AreaChartProps {
  data: SimpleData[];
}

const AreaChartModule: React.FC<AreaChartProps> = React.memo(({ data }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#e0f2fe" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<AnimatedTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="value" stroke="#60a5fa" fill="url(#areaGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

export default AreaChartModule;
