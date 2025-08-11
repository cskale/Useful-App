import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, description, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card ref={ref} className="relative bg-gradient-to-br from-pink-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button size="icon" variant="ghost" onClick={handleDownload} aria-label="Download chart">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
