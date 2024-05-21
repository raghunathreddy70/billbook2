import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import "jspdf-autotable";
import { format } from "date-fns";
import useHandleDownload from "../Hooks/useHandleDownload";
import NumberCardsSales from "../invoices/Cards/NumberCardsSales";
import { Tooltip } from "antd";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import { RiDownloadCloud2Line } from "react-icons/ri";
import PurchaseCards from "./PurchaseCards";
import { useSelector } from "react-redux";

const PurchaseListHeader = ({
  show,
  setShow,
  toggleContent,
  showContent,
  dataSourceDownload,
  active,
  toggleTabsState,
}) => {
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();

  const userData = useSelector((state) => state?.user?.userData);
  // download data in csv format code goes here
  const handleCSVDownloadSet = (e) => {
    e.preventDefault();
    // Create a CSV-ready data array
    const csvData = dataSourceDownload.map((item) => ({
      "Purchase ID": item?.purchaseNumber,
      "Purchase To": item?.name?.name,
      "Purchases Date": item?.purchasesDate, // Format invoiceDate
      "Due Date": item?.dueDate, // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      "Status ": item?.purchaseStatus,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Purchase ID", key: "purchaseNumber" },
      { label: "Purchase To", key: "name?.name" },
      { label: "Purchases Date", key: "purchasesDate" },
      { label: "Due Date", key: "dueDate" },
      { label: "Total", key: "grandTotal" },
      { label: "Balance", key: "balance" },
      { label: "Status", key: "purchaseStatus" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = (e) => {
    e.preventDefault();

    // Set up table columns
    const columns = [
      "Purchase ID",
      "Purchase To",
      "Purchases Date",
      "Due Date",
      "Total",
      "Balance",
      "Status",
    ];
    // Set up table rows
    const rows = dataSourceDownload.map((item) => [
      item?.purchaseNumber,
      item?.name?.name,
      item?.purchasesDate &&
        format(new Date(item?.purchasesDate), "MM/dd/yyyy"), // Format invoiceDate
      item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"), // Format dueDate
      item?.grandTotal,
      item?.balance,
      item?.purchaseStatus,
    ]);
    let heading =
      toggleTabsState === 0
        ? "All Purchases Invoices"
        : toggleTabsState === 1
        ? "Paid Purchases Invoices"
        : toggleTabsState === 2
        ? "Overdue Purchases Invoices"
        : "Outstanding Purchases Invoices";
    handlePDFDownload({ columns, rows, heading });
  };

  // download data in pdf format code goes here

  const [searchText, setSearchText] = useState("");
  const [totalGrandTotal, setTotalGrandTotal] = useState(0);
  // const [paidAmount, setPaidAmount] = useState({ totalAmountFromPayments: 0 });
  const [totalpaidinvoice, setTotalPaidInvoice] = useState([]);
  // const [totalOutstandingAmount, setTotalOutstandingAmount] = useState({ totalOutstandingAmount: 0 });
  const [paidAmount, setPaidAmount] = useState();
  const [totalOutstandingAmount, setTotalOutstandingAmount] = useState("");

  const [datasource, setDatasource] = useState([]);

  const [isEnabled, setIsEnabled] = useState(false);

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };

  const [purLength, setPurLength] = useState(0);
  const [totalPurAmount, setTotalPurAmount] = useState(0);

  useEffect(() => {
    if (userData?.data?._id) {
      axios
        .get(
          `http://localhost:8000/api/addPurchases/purchases/${userData?.data?._id}`
        )
        .then((response) => {
          setDatasource(response.data);
          const purLength = response.data.length;
          setPurLength(purLength);
          const totalPurAmount = response.data.reduce((total, purchase) => {
            return total + (Number(purchase.grandTotal) || 0);
          }, 0);
          setTotalPurAmount(totalPurAmount);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userData]);

  return (
    <>
      <div className="page-header 300:mb-0">
        <div className="content-page-header 300:mb-0">
          <h5>Purchase Invoice</h5>
          <div className="d-flex gap-1 align-items-center">
            <div className="d-flex gap-2 align-items-center">
              <Tooltip title="Filters" placement="top">
               
                  <button
                    className="btn btn-primary me-2"
                    onClick={toggleContent}
                  >
                    <img
                      src="./newdashboard/filterssales.svg"
                      alt="Filters"
                      className="filter-image"
                    />
                    Filters
                  </button>
               
              </Tooltip>
            </div>

            <div className="dropdown">
              <Tooltip title="Download" placement="top">
                <Link
                  to="#"
                  className="btn btn-primary me-2 d-flex gap-1 align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <RiDownloadCloud2Line
                    className="me-1"
                    style={{ fontSize: "15px" }}
                  />
                  <span>Download</span>
                </Link>
              </Tooltip>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
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
                    className="dropdown-item d-flex align-items-center"
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

            <Tooltip title="Create Purchase Invoice" placement="top">
              <Link className="btn btn-primary" to="/add-purchases">
                Add Purchases
              </Link>
            </Tooltip>
          </div>
        </div>
        <PurchaseCards purLength={purLength} totalPurAmount={totalPurAmount} />

        {/* {!active &&
          <NumberCardsSales allInvoicelength={datasource.length} invoiceGrandTotal={totalGrandTotal} totalPaidAmount={paidAmount} paidAmountLength={paidInvoices.length} totalOutstandingAmount={totalOutstandingAmount} outStandingLength={outstandingInvoices.length} />
        } */}
      </div>
    </>
  );
};

export default PurchaseListHeader;
