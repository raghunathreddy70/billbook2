import React, { useEffect, useState, useCallback } from "react";

// import recentinvoices from "../json/recentinvoices";
import recentestimates from "../json/recentestimates";
import axios from "axios";
import Dashboardbackup2 from "./Dashboardbackup2";
import Dashboardbackup2chart2 from "./Dashboardbackup2chart2";
import { DashboardSlide2 } from "./DashboardSlide2";
import DashboardSlide3 from "./DashboardSlide3";
import { backendUrl } from "../backendUrl";
// import Lowstockproductscomponent from "../components/Lowstockproductscomponent";

const Dashboard = ({ active }) => {
  const [dataSource, setDatasource] = useState([]);
  const [totalGrandTotal, setTotalGrandTotal] = useState(0);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/addInvoice/invoices`)
      .then((response) => {
        setDatasource(response.data);
        // Calculate totalGrandTotal
        let totalGrandTotalValue = response.data.reduce((acc, invoice) => {
          return acc + (invoice.grandTotal || 0);
        }, 0);
        setTotalGrandTotal(totalGrandTotalValue);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [menu, setMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const salesOptions = {
    colors: ["#7638ff", "#fda600"],
    chart: {
      type: "bar",
      fontFamily: "Poppins, sans-serif",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: "Received",
        type: "column",
        data: [70, 150, 80, 180, 150, 175, 201, 60, 200, 120, 190, 160, 50],
      },
      {
        name: "Pending",
        type: "column",
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16, 80],
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  },

    recentestimates_ = recentestimates;
    // recentinvoices_ = recentinvoices;
  useEffect(() => {
    // let salesColumn = document.getElementById("sales_chart");
    // let salesChart = new ApexCharts(salesColumn, salesOptions);
    // salesChart?.render();
    

    // let invoiceColumn = document.getElementById("invoice_chart");
    // let invoiceChart = new ApexCharts(invoiceColumn, invoiceOptions);
    // invoiceChart.render();
  }, []);

  // progess bar
  // Assuming dataSource is your API response
  // const countByStatus = (status) => dataSource.filter((item) => item.invoiceStatus === status).length;

  const countByStatus = (status) => dataSource.filter((item) => item.invoiceStatus === status).length;

  const paidCount = countByStatus("PAID");
  const unpaidCount = countByStatus("UNPAID");
  const partiallyPaidCount = countByStatus("PARTIALLY PAID");


  const totalCount = dataSource.length;

  const paidPercentage = (paidCount / totalCount) * 100;
  const unpaidPercentage = (unpaidCount / totalCount) * 100;
  const partiallyPaidPercentage = (partiallyPaidCount / totalCount) * 100;


  const sortedData = dataSource.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const lastFiveInvoices = sortedData.slice(0, 5);


  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid !p-[16px]">
            <Dashboardbackup2 />
            <Dashboardbackup2chart2 />
            {/* <DashboardSlide3 /> */}
            <DashboardSlide2 />
          
           
     


          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
