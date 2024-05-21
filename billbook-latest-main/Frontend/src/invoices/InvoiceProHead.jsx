import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import useHandleDownload from "../Hooks/useHandleDownload";
import { format } from "date-fns";
import { Tooltip } from "antd";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";

const InvoiceProHead = ({
  show,
  setShow,
  toggleContent,
  showContent,
  dataSourceDownload,
  toggleTabsState,
}) => {
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();

  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = dataSourceDownload?.map((item) => ({
      "Proforma ID": item?.proformaNumber,
      "Proforma To": item?.customerName?.name,
      "Created On":
        item?.performaDate &&
        format(new Date(item?.performaDate), "MM/dd/yyyy"), // Format performaDate
      "Due Date":
        item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"), // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Proforma ID", key: "proformaNumber" },
      { label: "Proforma To", key: "customerName" },
      { label: "Created On", key: "performaDate" },
      { label: "Due Date", key: "dueDate" },
      { label: "Total", key: "grandTotal" },
      { label: "Balance", key: "balance" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "Proforma ID",
      "Proforma To",
      "Created On",
      "Due Date",
      "Total",
      "Balance",
    ];

    // Set up table rows
    const rows = dataSourceDownload?.map((item) => [
      item?.proformaNumber,
      item?.customerName?.name,
      item?.performaDate && format(new Date(item?.performaDate), "MM/dd/yyyy"), // Format creditnotesDate
      item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"), // Format dueDate
      item?.grandTotal,
      item?.balance,
      // Add more fields as needed
    ]);
    let heading =
      toggleTabsState === 0
        ? "All Proforma Invoices"
        : toggleTabsState === 1
          ? "Paid Proforma Invoices"
          : toggleTabsState === 2
            ? "Overdue Proforma Invoices"
            : "Outstanding Proforma Invoices";
    handlePDFDownload({ columns, rows, heading });
  };

  const [searchText, setSearchText] = useState("");
  const [totalGrandTotal, setTotalGrandTotal] = useState(0);
  // const [paidAmount, setPaidAmount] = useState({ totalAmountFromPayments: 0 });
  const [paidAmount, setPaidAmount] = useState();
  const [totalpaidinvoice, setTotalPaidInvoice] = useState([]);
  const [totalOutstandingAmount, setTotalOutstandingAmount] = useState("");
  // const [totaloutstandingamount, setTotalOutstandingAmountList] = useState([]);
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const [datasource, setDatasource] = useState([]);
  const handleReset = () => {
    setSearchText("");
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/addInvoice/invoices")
      .then((response) => {
        setDatasource(response.data);

        // Calculate totalGrandTotal
        let totalGrandTotalValue = response.data.reduce((acc, invoice) => {
          return acc + (invoice.grandTotal || 0);
        }, 0);
        setTotalGrandTotal(totalGrandTotalValue);

        // Calculate totalPaidAmount
        let totalPaidAmountValue = response.data.reduce((acc, invoice) => {
          return acc + (invoice.grandTotal - invoice.balance || 0);
        }, 0);
        setPaidAmount(totalPaidAmountValue);

        // Calculate totalOutstandingAmount
        let totalOutstandingAmountValue = response.data.reduce(
          (acc, invoice) => {
            return acc + (invoice.balance || 0);
          },
          0
        );
        setTotalOutstandingAmount(totalOutstandingAmountValue);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // console.log("paidAmount.totalAmountFromPayments", paidAmount.totalAmountFromPayments)
  // console.log("paid",paidAmount)
  // console.log("unpaid",totalOutstandingAmount)

  return (
    <>
      <div className="page-header 700:mb-3 300:mb-2">
        <div className="content-page-header 300:mb-0">
          <h5>Proforma Invoices</h5>
          <div className="d-flex gap-2">
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
            <Tooltip placement="topLeft" title={"Proforma Invoice"}>
              <Link className="Dashboard3one-parent-sub2-sub-content" to="/add-Proforma">
                <FaPlus/> Create Sales Return
                {/* <i className="fa fa-plus-circle" aria-hidden="true" /> */}
              </Link>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* /Page Header */}
    </>
  );
};

export default InvoiceProHead;
