import React from 'react';
import ReactApexChart from 'react-apexcharts';
const DashboardBackup2chart3 = () => {

  {/* column Chart Data*/}

  const columnChartOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false,
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [{
      name: 'Net Profit',
      data: [120, 200, 150, 250, 300, 180, 280, 320, 400],
      color: '#ff6384' 
    }, {
      name: 'Revenue',
      data: [180, 240, 210, 290, 350, 240, 320, 360, 450],
      color: '#36a2eb' 
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands"
        }
      }
    }
  };

 {/* Mixed Chart Data*/}

  const mixedChartOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false,
      }
    },
    series: [{
      name: 'Invoices Generated',
      type: 'line',
      data: [30, 40, 45, 50, 60, 70, 80, 90, 100]
    }, {
      name: 'Payments Received',
      type: 'column',
      data: [20, 25, 30, 35, 40, 45, 50, 55, 60]
    }],
    stroke: {
      width: [2, 0] // Adjusting the width of the line
    },
    colors: ['#ff6384', '#36a2eb'], // Adding colors to the series
    title: {
      text: 'Invoices and Payments Overview'
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    xaxis: {
      type: 'category'
    },
    yaxis: [{
      title: {
        text: 'Invoices Generated',
      },
    }, {
      opposite: true,
      title: {
        text: 'Payments Received'
      }
    }]
  };

  return (
   <>
    <div className="DashboardBackup2chart3-parent">
      <div className="row">

        {/* Column Chart */}

        <div className="col-md-6">
          <div className='DashboardBackup2chart3-sub-chart'>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Revenue Analysis</h5>
              </div>
              <div className="card-body">
                <ReactApexChart options={columnChartOptions} series={columnChartOptions.series} type="bar" height={350} />
              </div>
            </div>
          </div>
        </div>

        {/* Mixed Chart */}

        <div className="col-md-6">
          <div className='DashboardBackup2chart3-sub-chart'>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Invoices and Payments Comparison</h5>
              </div>
              <div className="card-body">
                <ReactApexChart options={mixedChartOptions} series={mixedChartOptions.series} type="line" height={350} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
    </div>
    </>
  );
}

export default DashboardBackup2chart3;
