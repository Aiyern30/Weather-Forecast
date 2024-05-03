import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";

Chart.register(...registerables);

interface PolarProps {
  data: { label: string; value: number | undefined }[];
}

const PolarChart: React.FC<PolarProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const chartConfig: ChartConfiguration<"polarArea"> = {
        type: "polarArea",
        data: {
          labels: data.map((item) => item.label),
          datasets: [
            {
              label: "Dataset",
              data: data.map((item) => item.value || 0),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(75, 192, 192)",
                "rgb(255, 205, 86)",
                "rgb(201, 203, 207)",
                "rgb(54, 162, 235)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      };

      const chart = new Chart(chartRef.current, chartConfig);

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return <canvas ref={chartRef} width={200} height={200}></canvas>;
};

export default PolarChart;
