import { useEffect, useRef } from 'react';

interface ChartProps {
  data: any[];
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  colors?: string[];
  height?: number;
  showLabels?: boolean;
  animated?: boolean;
}

export default function Chart({ 
  data, 
  type = 'bar', 
  colors = ['#00c8ff', '#ff3366', '#ffd700', '#00ff9d', '#ff6b35'],
  height = 300,
  showLabels = true,
  animated = true 
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxValue = Math.max(...data.map(d => d.value));
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    if (type === 'bar') {
      const barWidth = chartWidth / data.length * 0.7;
      const gap = chartWidth / data.length * 0.3;

      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = padding + index * (barWidth + gap) + gap / 2;
        const y = padding + chartHeight - barHeight;

        // Gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, colors[index % colors.length]);
        gradient.addColorStop(1, colors[index % colors.length] + '88');

        ctx.fillStyle = gradient;
        
        if (animated) {
          // Animate from bottom
          const animateHeight = barHeight * (index + 1) / data.length;
          ctx.fillRect(x, y + barHeight - animateHeight, barWidth, animateHeight);
        } else {
          ctx.fillRect(x, y, barWidth, barHeight);
        }

        // Label
        if (showLabels) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(item.label, x + barWidth / 2, canvas.height - 10);
          
          // Value on top
          ctx.fillStyle = colors[index % colors.length];
          ctx.font = 'bold 12px JetBrains Mono, monospace';
          ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
        }
      });
    } else if (type === 'pie' || type === 'doughnut') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 * 0.75;
      const innerRadius = type === 'doughnut' ? radius * 0.65 : 0;

      let startAngle = -Math.PI / 2;

      data.forEach((item, index) => {
        const sliceAngle = (item.value / data.reduce((sum: number, d: any) => sum + d.value, 0)) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        if (innerRadius > 0) {
          ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
        }
        ctx.closePath();

        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        if (showLabels) {
          const labelAngle = startAngle + sliceAngle / 2;
          const labelRadius = radius + 25;
          const labelX = centerX + Math.cos(labelAngle) * labelRadius;
          const labelY = centerY + Math.sin(labelAngle) * labelRadius;

          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = labelX < centerX ? 'right' : 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${item.label} ${item.percentage}%`, labelX, labelY);
        }

        startAngle += sliceAngle;
      });
    } else if (type === 'line') {
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 3;
      ctx.beginPath();

      data.forEach((item, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - (item.value / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area under line
      ctx.lineTo(padding + chartWidth, padding + chartHeight);
      ctx.lineTo(padding, padding + chartHeight);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
      gradient.addColorStop(0, colors[0] + '44');
      gradient.addColorStop(1, colors[0] + '00');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Points
      data.forEach((item, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - (item.value / maxValue) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = colors[0];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Labels
      if (showLabels) {
        data.forEach((item, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          ctx.fillStyle = '#ffffff';
          ctx.font = '11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(item.label, x, canvas.height - 10);
        });
      }
    }

  }, [data, type, colors, showLabels, animated]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={height}
      style={{ width: '100%', height: `${height}px` }}
    />
  );
}
