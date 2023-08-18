import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);

function BarChart({ barChartData, onQueryMpByName }) {


  const barChart = React.useRef(null);

  const getMp = (evt) => {
    const res = barChart.current.getElementsAtEventForMode(
      evt,
      'nearest',
      { intersect: true },
      true
    );
    // If didn't click on a bar, `res` will be an empty array
    if (res.length === 0) {
      return;
    }

    // onQueryMp()
    // Alerts "You clicked on A" if you click the "A" chart
    console.log('You clicked on ' + barChart.current.data.labels[res[0].index]);
    console.log('You clicked on ' + JSON.stringify(barChart.current.data));

    onQueryMpByName(barChart.current.data.labels[res[0].index]);
  }

  return (
    <div>
      <Bar
        ref={barChart}
        data={barChartData}
        onClick={getMp}
        options={{
          title: {
            display: true,
            text: 'Average Rainfall per month',
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          }
        }}
      />
    </div>
  );
}

export default BarChart;