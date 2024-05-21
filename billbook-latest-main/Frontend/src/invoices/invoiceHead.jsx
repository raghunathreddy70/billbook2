import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import * as XLSX from "xlsx";
import {
  Recepit,
  TransactionMinus,
  ArchiveBook,
  Clipboard,
  MessageEdit,
  Rotate,
} from "../_components/imagepath";
import { Input, Pagination, Space, Table, Button, Tooltip } from "antd";
import axios from "axios";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format, subDays } from "date-fns";
import Papa from "papaparse";
import NumberCardsSales from "./Cards/NumberCardsSales";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { PiTelegramLogo, PiTelegramLogoBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

const InvoiceHead = ({
  show,
  setShow,
  toggleContent,
  showContent,
  dataSourceDownload,
  active,
  toggleTabsState,
}) => {
  const userData = useSelector((state) => state?.user?.userData);
  const [totalGrandTotal, setTotalGrandTotal] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalOutstandingAmount, setTotalOutstandingAmount] = useState("");
  const [datasource, setDatasource] = useState([]);
  const [paidInvoicesTotalAmount, setPaidInvoicesTotalAmount] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState("24 hours");

  useEffect(() => {
    if (userData?.data?._id) {
      axios
        .get(
          `http://localhost:8000/api/addInvoice/invoices/${userData?.data?._id}`
        )
        .then((response) => {
          const invoices = response.data;
          setDatasource(invoices);
          console.log("Fetched invoices:", invoices);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userData]);

  useEffect(() => {
    filterDataByDateRange(dateRange);
  }, [datasource, dateRange]);

  const filterDataByDateRange = (range) => {
    const now = new Date();
    let filteredInvoices;

    if (range === "24 hours") {
      filteredInvoices = datasource.filter(
        (invoice) => new Date(invoice.invoiceDate) >= subDays(now, 1)
      );
    } else if (range === "7 days") {
      filteredInvoices = datasource.filter(
        (invoice) => new Date(invoice.invoiceDate) >= subDays(now, 7)
      );
    } else if (range === "30 days") {
      filteredInvoices = datasource.filter(
        (invoice) => new Date(invoice.invoiceDate) >= subDays(now, 30)
      );
    } else {
      filteredInvoices = datasource;
    }
    console.log("filteredInvoices",filteredInvoices)
    setFilteredData(filteredInvoices);
    updateSummary(filteredInvoices);
  };

  const updateSummary = (invoices) => {
    const paidInvoices = invoices.filter(
      (invoice) => invoice.invoiceStatus === "PAID"
    );
    const unpaidInvoices = invoices.filter(
      (invoice) => invoice.invoiceStatus === "UNPAID"
    );

    const totalGrandTotalValue = invoices.reduce(
      (acc, invoice) => acc + (Number(invoice.grandTotal) || 0),
      0
    );
    const totalPaidAmountValue = paidInvoices.reduce(
      (acc, invoice) => acc + (Number(invoice.grandTotal) || 0),
      0
    );
    const totalOutstandingAmountValue = unpaidInvoices.reduce(
      (acc, invoice) => acc + (Number(invoice.balance) || 0),
      0
    );

    setTotalGrandTotal(totalGrandTotalValue);
    setPaidAmount(totalPaidAmountValue);
    setTotalOutstandingAmount(totalOutstandingAmountValue);
    setPaidInvoicesTotalAmount(totalPaidAmountValue);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleCSVDownload = (e) => {
    e.preventDefault();
    const customFilename = window.prompt(
      "Enter a custom filename (without extension):"
    );

    if (!customFilename) {
      return;
    }

    const csvData = filteredData.map((item) => ({
      "Invoice Number": item?.invoiceNumber,
      Name: item?.customerName?.name,
      "Invoice Date":
        item?.invoiceDate && format(new Date(item?.invoiceDate), "MM/dd/yyyy"),
      "Due Date": item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"),
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      "Status ": item?.invoiceStatus,
    }));

    const csvContent = {
      data: csvData,
      filename: `${customFilename}.csv`,
    };

    const csvLink = document.createElement("a");
    csvLink.href = encodeURI(
      `data:text/csv;charset=utf-8,${Papa.unparse(csvData, { header: true })}`
    );
    csvLink.target = "_blank";
    csvLink.download = `${customFilename}.csv`;
    csvLink.click();
  };

  const handlePDFDownload = (e) => {
    e.preventDefault();
    const customFilename = window.prompt(
      "Enter a custom filename (without extension):"
    );

    if (!customFilename) {
      return;
    }

    let pdfHeading =
      toggleTabsState === 0
        ? "All Sales Invoices"
        : toggleTabsState === 1
        ? "Paid Sales Invoices"
        : toggleTabsState === 2
        ? "Overdue Sales Invoices"
        : "Outstanding Sales Invoices";

    const pdf = new jsPDF();
    pdf.text(pdfHeading, 10, 10);

    const columns = [
      "Invoice Number",
      "Name",
      "Invoice Date",
      "Due Date",
      "Total",
      "Balance",
      "Status",
    ];

    const rows = filteredData.map((item) => [
      item?.invoiceNumber,
      item?.customerName?.name,
      item?.invoiceDate && format(new Date(item?.invoiceDate), "MM/dd/yyyy"),
      item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"),
      item?.grandTotal,
      item?.balance,
      item?.invoiceStatus,
    ]);

    pdf.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    pdf.save(`${customFilename}.pdf`);
  };

  return (
    <>
      <div className="page-header 300:mb-0 sales-invoicepage">
        <div className="content-page-header 300:mb-0">
          <div className="Dashboard3one-parent-sub2">
            <div className="serchbar-inputfield">
              <FaMagnifyingGlass />
              <input type="text" placeholder="Search" />
            </div>
            <div className="Dashboard3one-parent-sub2-sub">
              <Tooltip placement="topLeft" title={"Add invoice"}>
                <Link to="/add-invoice">
                  <div className="Dashboard3one-parent-sub2-sub-content">
                    <FaPlus />
                    <p>Add Invoice</p>
                  </div>
                </Link>
              </Tooltip>
              <Tooltip placement="topLeft" title={"Share"}>
                <Link to="">
                  <div className="Dashboard3one-parent-sub2-sub-content">
                    <PiTelegramLogo />
                    <p>Share</p>
                  </div>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="SalesInvoice-filtersbydate">
          <div className="SalesInvoice-filtersbydate-sub1">
            <p onClick={() => handleDateRangeChange("24 hours")}>24 hours</p>
            <p onClick={() => handleDateRangeChange("7 days")}>7 days</p>
            <p onClick={() => handleDateRangeChange("30 days")}>30 days</p>
            <p onClick={() => handleDateRangeChange("custom")}>Customize</p>
          </div>
          <div className="SalesInvoice-filtersbydate-sub2">
            {/* <Tooltip placement="topLeft" title={"Filter Data"}>
              <Link to="/add-invoice">
                <div className="Dashboard3one-parent-sub2-sub-content">
                  <div className="filterssales-image">
                    <img src="./newdashboard/filterssales.svg" alt="" />
                  </div>
                  <p>Filters</p>
                </div>
              </Link>
            </Tooltip> */}
            <Tooltip placement="topLeft" title={"Filter Data"}>
              <button
                className="Dashboard3one-parent-sub2-sub-conten"
                onClick={toggleContent}
              >
                <div className="filterssales-image">
                  <img src="./newdashboard/filterssales.svg" alt="" />
                  Filters
                </div>
                
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* /Page Header */}

      {/* Inovices card */}
      {!active && (
        <NumberCardsSales
          allInvoicelength={filteredData.length}
          invoiceGrandTotal={totalGrandTotal}
          totalPaidAmount={paidAmount}
          paidAmountLength={filteredData.filter(
            (invoice) => invoice.invoiceStatus === "PAID"
          ).length}
          totalOutstandingAmount={totalOutstandingAmount}
          outStandingLength={filteredData.filter(
            (invoice) => invoice.invoiceStatus === "UNPAID"
          ).length}
          paidInvoicesTotalAmount={paidInvoicesTotalAmount}
        />
      )}
      <div className="SalesInvoice-dropdown-parent">
        <div className="Sales-invoice-summery-dropdown">
          <div className="Dashboard3one-dropdown-container">
            <select
              className="Dashboard3one-dropdown"
              name="dashboard-dropdown"
              id="dashboard-dropdown"
            >
              <option value="">Summary</option>
              {/* <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                    <option value="Option 4">Option 4</option> */}
            </select>
          </div>
        </div>

        <div className="SalesInvoice-summery-icons">
          <Tooltip placement="top" title="Add Invoice">
            <Link to="/add-invoice">
              <div className="Dashboard3one-parent-sub2-sub-content">
                <FaPlus />
              </div>
            </Link>
          </Tooltip>

          <div className="Dashboard3one-parent-sub2-sub-content">
            <PiTelegramLogoBold />
          </div>
          <div className="">
            <Link
              to="#"
              className=" 700:me-2 300:me-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="Dashboard3one-parent-sub2-sub-content">
                <RiDownloadCloud2Line />
                <p>Download</p>
              </div>
            </Link>

            {/* Download data */}
            <div className="dropdown-menu dropdown-menu-end">
              <ul className="d-block">
                <li>
                  <Link
                    className="d-flex align-items-center download-item"
                    to="#"
                    download=""
                    onClick={handlePDFDownload}
                  >
                    <i className="far fa-file-pdf me-2" />
                    PDF
                  </Link>
                </li>
                <li>
                  <Link
                    className="d-flex align-items-center download-item"
                    to="#"
                    download=""
                    onClick={handleCSVDownload}
                  >
                    <i className="far fa-file-text me-2" />
                    CSV
                  </Link>
                </li>
              </ul>
            </div>

            {/* Download data */}
          </div>
          <Tooltip placement="top" tittle="Select Template">
            <Link to="/invoice-template">
              <div className="Dashboard3one-parent-sub2-sub-content">
                <IoSettingsOutline />
                <p>Settings</p>
              </div>
            </Link>
          </Tooltip>
        </div>
      </div>
      <div className="list-btn">
        <ul className="filter-list flex space-x-0">
          {/* <li>
                <Tooltip placement="topLeft" title={"Filter Data"}>
                  <button className="btn btn-primary 700:me-2 300:me-0"
                    onClick={toggleContent}>
                    <FilterInvoiceButton />
                  </button>
                </Tooltip>
              </li> */}

          <li className=""></li>
        </ul>
      </div>
    </>
  );
};

export default InvoiceHead;
