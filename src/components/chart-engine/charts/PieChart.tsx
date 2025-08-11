import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import type { SimpleData } from './BarChart';
import AnimatedTooltip from './AnimatedTooltip';

interface PieChartProps {
  data: SimpleData[];
}

const COLORS = ['#fbcfe8', '#c7d2fe', '#bae6fd', '#bbf7d0', '#fde68a'];

const PieChartModule: React.FC<PieChartProps> = React.memo(({ data }) => {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<AnimatedTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

export default PieChartModule;
