import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface TemperatureGaugeChartProps {
  temperature: number;
}

const TemperatureGaugeChart: React.FC<TemperatureGaugeChartProps> = ({
  temperature,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const min = Math.round(temperature - 30);
  const max = Math.round(temperature + 30);

  useEffect(() => {
    const chart = echarts.init(chartRef.current!);

    const option: echarts.EChartsOption = {
      series: [
        {
          type: "gauge",
          center: ["50%", "60%"],
          startAngle: 200,
          endAngle: -20,
          min: min,
          max: max,
          splitNumber: 12,
          itemStyle: {
            color: "#FFAB91",
          },
          progress: {
            show: true,
            width: 30,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 30,
            },
          },
          axisTick: {
            distance: -45,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: "#999",
            },
          },
          splitLine: {
            distance: -52,
            length: 14,
            lineStyle: {
              width: 3,
              color: "#999",
            },
          },
          axisLabel: {
            distance: -20,
            color: "#999",
            fontSize: 20,
          },
          anchor: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            width: "60%",
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, "-15%"],
            fontSize: 40,
            fontWeight: "bolder",
            formatter: `{value} °C`,
            color: "inherit",
          },
          data: [
            {
              value: temperature,
            },
          ],
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [temperature]);

  return <div ref={chartRef} style={{ height: "300px", width: "400px" }} />;
};

export default TemperatureGaugeChart;
