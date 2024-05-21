import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import useHandleDownload from '../Hooks/useHandleDownload';
import { Tooltip } from "antd";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
const CreditHead = ({ show, setShow, toggleContent, showContent, dataSourceDownload, toggleTabsState }) => {

  const { handlePDFDownload, handleCSVDownload } = useHandleDownload()

  // download data in csv format code goes here 
  const handleCSVDownloadSet = () => {

    // Create a CSV-ready data array
    const csvData = dataSourceDownload.map(item => ({
      "Credit Notes ID": item?.creditnotesNumber,
      "Credit Notes To": item?.customerName?.name,
      "CreateNotes Date": item?.creditnotesDate && format(new Date(item?.creditnotesDate), 'MM/dd/yyyy'), // Format creditnotesDate
      "Due Date": item?.dueDate && format(new Date(item?.dueDate), 'MM/dd/yyyy'), // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: 'Credit Notes ID', key: 'creditnotesNumber' },
      { label: 'Credit Notes To', key: 'customerName' },
      { label: 'CreateNotes Date', key: 'creditnotesDate' },
      { label: 'Due Date', key: 'dueDate' },
      { label: 'Total', key: 'grandTotal' },
      { label: 'Balance', key: 'balance' },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers })
  };
  // download data in csv format code goes here 



  // download data in pdf format code goes here 
  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ['Invoice Number', 'Name', 'Invoice Date', 'Due Date', 'Total', 'Balance'];

    // Set up table rows
    const rows = dataSourceDownload.map(item => [
      item?.creditnotesNumber,
      item?.customerName?.name,
      item?.creditnotesDate && format(new Date(item?.creditnotesDate), 'MM/dd/yyyy'), // Format creditnotesDate
      item?.dueDate && format(new Date(item?.dueDate), 'MM/dd/yyyy'), // Format dueDate
      item?.grandTotal,
      item?.balance,
      // Add more fields as needed
    ]);
    let heading = toggleTabsState === 0 ? "All Credit Notes" : (toggleTabsState === 1 ? "Paid Credit Notes" : (toggleTabsState === 2 ? "Overdue Credit Notes" : "Outstanding Credit Notes"))
    handlePDFDownload({ columns, rows, heading })
  };

  // download data in pdf format code goes here 
  return (
    <>
      <div className="page-header 300:mb-3 700:mb-4">
        <div className="content-page-header 300:mb-0">
          <h5>Credit Notes</h5>
          <ul className="d-flex gap-2">
              <Tooltip placement="topLeft" title={"Filter Data"}>
                <div className="Dashboard3one-parent-sub2-sub-content" onClick={toggleContent}>
                  <div className="filterssales-image">
                    <img src="./newdashboard/filterssales.svg" alt="" />
                  </div>
                  <p>Filters</p>
                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title={"Download Data"}>
                <Link
                  to="#"
                  className="btn-filters"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="Dashboard3one-parent-sub2-sub-content">
                    <RiDownloadCloud2Line />
                    <p>Download</p>
                  </div>
                </Link>
              </Tooltip>
              <div className="dropdown-menu dropdown-menu-end">
                <ul className="d-block">
                  <li>
                    <Link
                      className="d-flex align-items-center download-item"
                      to="#"
                      download=""
                      onClick={handlePDFDownloadSet}
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
                      onClick={handleCSVDownloadSet}
                    >
                      <i className="far fa-file-text me-2" />
                      CSV
                    </Link>
                  </li>
                </ul>
              </div>
              <Tooltip placement="topLeft" title={"Add Credit Notes"}>
                <Link className="Dashboard3one-parent-sub2-sub-content" to="/add-credit-notes">
                <FaPlus />
                    Create Credit Notes
                </Link>
              </Tooltip>
            </ul>
        </div>
      </div>
    </>
  );
};

export default CreditHead;