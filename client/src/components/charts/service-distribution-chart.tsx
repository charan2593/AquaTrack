import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface ServiceDistributionChartProps {
  rentalCount: number;
  amcCount: number;
}

export default function ServiceDistributionChart({ rentalCount, amcCount }: ServiceDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Rental Service', 'AMC Service'],
      datasets: [{
        data: [rentalCount, amcCount],
        backgroundColor: [
          'hsl(183, 26%, 41%)', // Winter secondary
          'hsl(183, 19%, 63%)'  // Winter accent
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
          'hsl(183, 26%, 35%)',
          'hsl(183, 19%, 58%)'
        ]
      }]
    };

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data,
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
  }, [rentalCount, amcCount]);

  return (
    <div className="relative h-64" data-testid="service-distribution-chart">
      <canvas ref={chartRef} />
    </div>
  );
}
