import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function ServiceTrendsChart() {
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

    // Mock data for service trends
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Services Completed',
        data: [120, 135, 110, 160, 145, 155],
        borderColor: 'hsl(185, 52%, 12%)',
        backgroundColor: 'hsla(185, 52%, 12%, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'hsl(201, 30%, 91%)'
            }
          },
          x: {
            grid: {
              color: 'hsl(201, 30%, 91%)'
            }
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative h-64" data-testid="service-trends-chart">
      <canvas ref={chartRef} />
    </div>
  );
}
