import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

interface BarChartProps {
  data: { date: string; uv: number }[] | undefined;
  width: number;
  height: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, width, height }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (data && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart instance
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.map((item) => item.date),
            datasets: [
              {
                label: "UV",
                data: data.map((item) => item.uv),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [data]);

  return <canvas ref={chartRef} width={width} height={height}></canvas>;
};

export default BarChart;
