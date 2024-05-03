import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale
);

interface WeatherDataProps {
  x: number[];
  y: string[];
  category: string;
  day: number;
}

const AreaCharts = ({ x, y, category, day }: WeatherDataProps) => {
  const title = category + " and " + day;
  const yaxis = category;

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Forecast Data with ${title}`,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "HH:mm",
          },
          tooltipFormat: "HH:mm",
        },
        ticks: {
          display: true,
        },
        title: {
          display: true,
          font: {
            size: 24,
          },
          text: "Timestamp",
        },
      },
      y: {
        type: "linear",
        ticks: {
          display: true,
        },
        title: {
          display: true,
          font: {
            size: 24,
          },
          text: yaxis,
        },
      },
    },
  };

  const data = {
    labels: y,
    datasets: [
      {
        fill: true,
        label: yaxis,
        data: x.map((value, index) => ({ x: y[index], y: value })),
        borderColor: "darkgreen",
        backgroundColor: "lightgreen",
        tension: 0.5,
      },
    ],
  };

  return (
    <>
      <div className="w-full h-[500px] overflow-auto">
        <Line options={options} data={data} />
      </div>
    </>
  );
};

export default AreaCharts;
