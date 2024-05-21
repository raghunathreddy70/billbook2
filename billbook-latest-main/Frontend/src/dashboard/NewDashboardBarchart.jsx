import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const NewDashboardBarchart = ({ selectedPeriod, invoiceCount }) => {
  const [chartOptions, setChartOptions] = useState(null);
  const userData = useSelector((state) => state?.user?.userData);
  const businessId = userData?.data?._id;
  const [monthlyInvoiceData, setMonthlyInvoiceData] = useState([]);
  
  const fetchMonthlyInvoice = async () => {
    if (!userData) {
      console.log("User data not available");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8000/api/admin/invoiceCount", { params: { businessId } });
      setMonthlyInvoiceData(response.data.monthlyInvoiceCount || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyInvoice();
  }, [userData]);

  useEffect(() => {
    if (monthlyInvoiceData.length) {
      const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
      const getFilteredData = () => {
        const now = new Date();
        const currentMonthIndex = now.getMonth();
        let monthsToShow;
        switch (selectedPeriod) {
          case '3 Months':
            monthsToShow = 3;
            break;
          case '6 Months':
            monthsToShow = 6;
            break;
          case '1 Year':
          default:
            monthsToShow = 12;
            break;
        }
  
        const startIndex = (currentMonthIndex - monthsToShow + 1 + 12) % 12;
        const filteredData = [];
        const filteredCategories = [];
  
        for (let i = 0; i < monthsToShow; i++) {
          const monthIndex = (startIndex + i) % 12;
          filteredCategories.push(categories[monthIndex]);
          filteredData.push(monthlyInvoiceData[monthIndex] || 0);
        }
  
        return { filteredData, filteredCategories };
      };
  
      const { filteredData, filteredCategories } = getFilteredData();
  
      const series = [{
        name: 'Invoice Count',
        data: filteredData
      }];
  
      const options = {
        chart: {
          type: 'bar',
          height: 150,
          toolbar: {
            show: false
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '10%',
            endingShape: 'rounded',
            startingShape: 'rounded',
            borderRadius: 2
          },
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#ffffff'],
        grid: {
          show: false,
        },
        xaxis: {
          categories: filteredCategories,
          axisBorder: {
            show: false
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#ffffff'
            },
            formatter: function (value) {
              return value.toFixed(0);
            }
          },
          min: 0,
          tickAmount: 5,
        },
        fill: {
          opacity: 1
        },
      };
  
      setChartOptions({ options, series });
    }
  }, [monthlyInvoiceData, selectedPeriod]);

  useEffect(() => {
    if (invoiceCount) {
      const { years, yearlyInvoiceCount, months, monthlyInvoiceCount, weeklyInvoiceCounts, week, day, dailyInvoiceCounts, startDate, endDate } = invoiceCount;
      const dateDifference = Math.abs(new Date(endDate) - new Date(startDate));
      const daysDifference = Math.ceil(dateDifference / (1000 * 60 * 60 * 24));
  
      if (daysDifference <= 7) {
        setChartOptions(prevOptions => ({
          ...prevOptions,
          options: {
            ...prevOptions.options,
            xaxis: {
              categories: day || []
            }
          },
          series: [{
            name: 'Invoice Count',
            data: dailyInvoiceCounts || []
          }]
        }));
      } else if (daysDifference <= 31) {
        setChartOptions(prevOptions => ({
          ...prevOptions,
          options: {
            ...prevOptions.options,
            xaxis: {
              categories: week || []
            }
          },
          series: [{
            name: 'Invoice Count',
            data: weeklyInvoiceCounts || []
          }]
        }));
      } else if (daysDifference <= 365) {
        setChartOptions(prevOptions => ({
          ...prevOptions,
          options: {
            ...prevOptions.options,
            xaxis: {
              categories: months || []
            }
          },
          series: [{
            name: 'Invoice Count',
            data: monthlyInvoiceCount || []
          }]
        }));
      } else {
        setChartOptions(prevOptions => ({
          ...prevOptions,
          options: {
            ...prevOptions.options,
            xaxis: {
              categories: years || []
            }
          },
          series: [{
            name: 'Invoice Count',
            data: yearlyInvoiceCount || []
          }]
        }));
      }
    }
  }, [invoiceCount]);

  return (
    <div className="bar-chart" style={{ background: 'linear-gradient(to right, #313860 0%, #151928 100%)', borderRadius: '10px' }}>
      {chartOptions && 
      <Chart options={chartOptions.options} series={chartOptions.series} type="bar" height={150} />
     }
      <style>
        {`.apexcharts-xaxis-tick {
          opacity: 0;
        }`}
      </style>
    </div>
  );
};

export default NewDashboardBarchart;
