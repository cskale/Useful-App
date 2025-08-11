import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import type { SimpleData } from './BarChart';
import AnimatedTooltip from './AnimatedTooltip';

interface RadarChartProps {
  data: SimpleData[];
}

const RadarChartModule: React.FC<RadarChartProps> = React.memo(({ data }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar name="Value" dataKey="value" stroke="#f472b6" fill="#fbcfe8" fillOpacity={0.6} />
          <Tooltip content={<AnimatedTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

export default RadarChartModule;
