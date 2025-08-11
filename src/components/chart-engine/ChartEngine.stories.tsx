import type { Meta, StoryObj } from '@storybook/react';
import { ChartEngine } from './ChartEngine';
import type { SimpleData } from './charts/BarChart';

const meta: Meta<typeof ChartEngine> = {
  title: 'Charts/ChartEngine',
  component: ChartEngine,
};

export default meta;

type Story = StoryObj<typeof ChartEngine>;

const sample: SimpleData[] = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 50 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 60 },
  { name: 'May', value: 70 },
];

export const Default: Story = {
  render: () => <ChartEngine data={sample} title="Sample Chart" />,
};
