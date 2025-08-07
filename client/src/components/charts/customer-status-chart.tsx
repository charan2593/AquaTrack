import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface CustomerStatusChartProps {
  data?: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default function CustomerStatusChart({ data }: CustomerStatusChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chartData = {
      labels: ['Active', 'Inactive'],
      datasets: [{
        data: [data.active, data.inactive],
        backgroundColor: [
          'hsl(183, 26%, 41%)', // Winter secondary
          'hsl(180, 60%, 85%)'  // Winter light
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
          'hsl(183, 26%, 35%)',
          'hsl(180, 60%, 80%)'
        ]
      }]
    };

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        },
        cutout: '60%'
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400" data-testid="customer-status-chart-loading">
        <p>Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="relative h-64" data-testid="customer-status-chart">
      <canvas ref={chartRef} />
    </div>
  );
}
