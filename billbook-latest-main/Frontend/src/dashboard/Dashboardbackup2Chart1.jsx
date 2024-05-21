import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './Dashboardbackup2.css';

const Dashboardbackup2Chart1 = () => {
  // Dummy data for Pie Chart
  const [pieSeries] = useState([30, 40, 25, 20, 35]);
  const [pieOptions] = useState({
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });

  // Dummy data for Donut Chart
  const [donutSeries] = useState([20, 30, 15, 35, 25]);
  const donutOptions = {
    chart: {
      height: 350,
      type: 'donut',
      toolbar: {
        show: false,
      }
    },
    series: donutSeries,
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E']
  };

  return (
    <div className="Dashboardbackup2Chart1-parent">
      <div className="row">
        {/* Pie Chart */}
        <div className="col-md-6">
          <div className='Dashboardbackup2Chart1-sub-chart'>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Distribution of Sales by Category</h5>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <ReactApexChart options={pieOptions} series={pieSeries} type="pie" width={"100%"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Donut Chart */}
        <div className="col-md-6">
          <div className='Dashboardbackup2Chart1-sub-chart'>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Revenue Contribution by Category</h5>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <ReactApexChart options={donutOptions} series={donutOptions.series} type="donut" height={350} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboardbackup2Chart1;