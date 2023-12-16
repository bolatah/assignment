import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface AltitudeGaugeChartProps {
  altitude: number;
}

const AltitudeGaugeChart: React.FC<AltitudeGaugeChartProps> = ({ altitude }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current!);
    const min = Math.round(altitude - 20);
    const max = Math.round(altitude + altitude < 0 ? (altitude*15)*-1 : altitude*15 );
    const option: echarts.EChartsOption = {
        series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              center: ['50%', '75%'],
              radius: '90%',
              min: min,
              max: max,
              splitNumber: 8,
              axisLine: {
                lineStyle: {
                  width: 6,
                  color: [
                    [0.25, '#FF0000'],
                    [0.5, '#FDDD60'],
                    [0.75, '#58D9F9'],
                    [1,  '#FF0000']
                  ]
                }
              },
              pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 20,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                length: 12,
                lineStyle: {
                  color: 'auto',
                  width: 2
                }
              },
              splitLine: {
                length: 20,
                lineStyle: {
                  color: 'auto',
                  width: 5
                }
              },
              axisLabel: {
                color: '#464646',
                fontSize: 20,
                distance: -60,
                rotate: 'tangential',
                formatter: function (value) {
                  if (value === 0.875) {
                    return 'Grade A';
                  } else if (value === 0.625) {
                    return 'Grade B';
                  } else if (value === 0.375) {
                    return 'Grade C';
                  } else if (value === 0.125) {
                    return 'Grade D';
                  }
                  return '';
                }
              },
              title: {
                offsetCenter: [0, '-10%'],
                fontSize: 20
              },
              detail: {
                fontSize: 30,
                offsetCenter: [0, '-35%'],
                valueAnimation: true,
                formatter: function (value) {
                  return Math.round(value) + 'km';
                },
                color: 'inherit'
              },
              data: [
                {
                  value: altitude,
                }
              ]
            }
          ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [altitude]);

  return <div ref={chartRef} style={{ height: '300px', width: '400px' }} />;
};

export default AltitudeGaugeChart;