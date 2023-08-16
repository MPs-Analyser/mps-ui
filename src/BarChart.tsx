// @ts-nocheck
import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

function BarChart({ barChartData }) {
    return (
      <div>
        <Bar
          data={barChartData}
          options={{
            title:{
              display:true,
              text:'Average Rainfall per month',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      </div>
    );
  }
 
  export default BarChart;