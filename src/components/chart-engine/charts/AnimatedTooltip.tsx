import React from 'react';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { motion } from 'framer-motion';

const AnimatedTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const name = (label ?? payload[0].name) as string;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded bg-white/80 p-2 text-sm shadow-lg backdrop-blur"
      >
        <p className="font-medium">{name}</p>
        <p>{payload[0].value}</p>
      </motion.div>
    );
  }
  return null;
};

export default AnimatedTooltip;
