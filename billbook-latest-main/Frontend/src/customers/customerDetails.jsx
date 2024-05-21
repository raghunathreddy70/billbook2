import React, { useState, useEffect } from "react";
import {
  ArchiveBook,
  Clipboard,
  MessageEdit,
  Recepit,
  Rotate,
  TransactionMinus,
  img5,
} from "../_components/imagepath";
import { IoEye, IoPersonCircleSharp } from "react-icons/io5";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import FeatherIcon from "feather-icons-react";
import "../_components/antd.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Transactions from "./Transactions";
import Ledger from "./ledger";
import TotalLengthBlocks from "./components/TotalLengthBlocks";
import useGetApis from "../ApiHooks/useGetApi";
import useHandleDownload from "../Hooks/useHandleDownload";
import { format } from "date-fns";
import { Dropdown, Modal, Space, Table, Tooltip } from "antd";
import ItemwiseReport from "./itemwiseReport";
import { backendUrl } from "../backendUrl";
import { useHistory } from "react-router-dom";
import { FiEdit2, FiEye } from "react-icons/fi";

import { toast } from "react-toastify";
import EditCustomerModal from "./EditCustomerModal";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import useSalesUrlHandler from "../invoices/customeHooks/useSalesUrlHandler";
import { FaPlus } from "react-icons/fa6";
import Advitise from "./Advitise";
import {
  itemRender,
  onShowSizeChange,
} from "../_components/paginationfunction";
import { RiDeleteBin5Line, RiDownloadCloud2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { FaArrowDown } from "react-icons/fa";
import { PiTelegramLogoBold } from "react-icons/pi";

const CustomerDetails = () => {
  // const userData = useSelector
  // ((state) => state?.user?.userData);
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);
  const history = useHistory();
  const [datasource, setDatasource] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const cusid = useParams().id;
  const items = [
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-invoice", { state: { contact_id: cusid } });
          }}
        >
          Create Invoice
        </div>
      ),
    },
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-payments-in", { state: { contact_id: cusid } });
          }}
        >
          Payment In
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-sales-return", {
              state: { contact_id: cusid },
            });
          }}
        >
          Sales Return
        </div>
      ),
      key: "2",
    },
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-credit-notes", { state: { contact_id: cusid } });
          }}
        >
          Credit Note
        </div>
      ),
      key: "3",
    },
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-Proforma", { state: { contact_id: cusid } });
          }}
        >
          Proforma Invoice
        </div>
      ),
      key: "4",
    },
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-quotations", { state: { contact_id: cusid } });
          }}
        >
          Quotations
        </div>
      ),
      key: "5",
    },
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-delivery-challans", {
              state: { contact_id: cusid },
            });
          }}
        >
          Deliver Challen
        </div>
      ),
      key: "6",
    },
  ];

  const [editCustomer1, setEditCustomer1] = useState(false);

  console.log("cusid", cusid);

  const handleEdit = (cusid) => {
    setEditCustomer1(true);
  };

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const { id } = useParams();
  const [idToDelete, setIdToDelete] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [downloadData, setDownloadData] = useState([]);

  const { fetchTotalInvoicesOfCustomer, getApiData } = useGetApis();

  const [menu, setMenu] = useState(false);
  const [totalNumbers, setTotalNumbers] = useState({
    numberOfInvoices: 0,
    invoicesTotalAmt: 0,
    totalInvoicePaid: 0,
    grandPaid: 0,
    totalInvoiceUnPaid: 0,
    grandUnPaid: 0,
  });

  const [customerDetails, setCustomerDetails] = useState(null);

  const fetchCustomerDetails = async () => {
    try {
      let data = await getApiData({
        endpoint: `/api/addCustomer/getcustomerdetails/${cusid}`,
      });
      console.log(data, "dgdrgergdrg");
      let totalInvoice = await fetchTotalInvoicesOfCustomer({
        customerId: data.customerId,
      });

      let grandTotal = getTotalInvoiceGrandTotal({
        invoiceData: totalInvoice,
      });
      let { totalInvoiceOutStanding, grandOutStanding } = getTotalPaid({
        invoiceData: totalInvoice,
      });
      let { totalInvoiceDueDatesOver, grandDueDateAmt } = getTotalUnPaid({
        invoiceData: totalInvoice,
      });
      // getTotalUnPaid({ invoiceData: totalInvoice })
      setTotalNumbers({
        ...totalNumbers,
        numberOfInvoices: totalInvoice?.length,
        invoicesTotalAmt: grandTotal,
        totalInvoicePaid: totalInvoiceOutStanding,
        grandPaid: grandOutStanding,
        totalInvoiceUnPaid: totalInvoiceDueDatesOver,
        grandUnPaid: grandDueDateAmt,
      });

      console.log("data", data);
      setCustomerDetails(data);
      console.log("Fetched Customer Details:", data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };
  useEffect(() => {
    fetchCustomerDetails();
  }, [cusid]);

  const getTotalInvoiceGrandTotal = ({ invoiceData }) => {
    let grandTotal = invoiceData?.reduce((num, data) => {
      return num + (data?.grandTotal || 0);
    }, 0);
    return grandTotal;
  };

  const getTotalPaid = ({ invoiceData }) => {
    let filteredOutStanding = invoiceData?.filter(
      (invoice) => invoice?.invoiceStatus?.toLowerCase() === "paid"
    );
    let grandOutStanding = filteredOutStanding?.reduce((num, data) => {
      return num + (data?.grandTotal || 0);
    }, 0);
    let totalInvoiceOutStanding = filteredOutStanding?.length;
    return { totalInvoiceOutStanding, grandOutStanding };
  };

  const getTotalUnPaid = ({ invoiceData }) => {
    let filteredOutStanding = invoiceData?.filter(
      (invoice) => invoice?.invoiceStatus.toLowerCase() === "unpaid"
    );
    let grandDueDateAmt = filteredOutStanding?.reduce((num, data) => {
      return num + (data?.balance || 0);
    }, 0);
    let totalInvoiceDueDatesOver = filteredOutStanding?.length;
    return { totalInvoiceDueDatesOver, grandDueDateAmt };
  };

  const totalAmount = customerDetails?.Invoices?.reduce((total, invoice) => {
    return total + invoice.grandTotal;
  }, 0);
  const balance = customerDetails?.Invoices?.reduce((totalBalance, invoice) => {
    const totalPaid = invoice.payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    const invoiceBalance = invoice.grandTotal - totalPaid;
    return totalBalance + invoiceBalance;
  }, 0);

  const [deleteUpdateModal, setDeleteUpdateModal] = useState(false);
  const handleUpdateDelete = () => {
    setDeleteUpdateModal(true);
  };
  const handleDelete = async () => {

    if (invoiceCount > 0) {
      toast.error("Customer has invoices. Cannot delete.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return; 
    }
    try {
      const response = await axios.delete(
        `${backendUrl}/api/addCustomer/deletecustomers/${cusid}`
      );

      if (response.status === 204) {
        toast.success("Customer deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push("/customers");
      } else {
        console.error("Failed to delete Customer record. Please try again.");
      }
    } catch (error) {
      console.error(
        "An error occurred while deleting the Customer record:",
        error
      );
      toast.error("Unable to delete Customer", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const [customerInvoiceDetails, setCustomerInvoiceDetails] = useState([]);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [paidInvoices, setPaidInvoices] = useState(0);
  const [unpaidInvoices, setUnpaidInvoices] = useState(0);
  const [totalGrandTotal, setTotalGrandTotal] = useState(0);

  useEffect(() => {
    const fetchVendorInvoiceDetails = async () => {

      try {
        const response = await axios.get(
          `${backendUrl}/api/addInvoice/invoicebyCustomer/${customerDetails?.customerId}`
        );
        const invoices = response.data;
        setCustomerInvoiceDetails(invoices);
        setInvoiceCount(invoices.length);

        const paidInvoices = invoices.filter(
          (invoice) => invoice.invoiceStatus === "PAID"
        );
        setPaidInvoices(paidInvoices.length);

        const unpaidInvoices = invoices.filter(
          (invoice) => invoice.invoiceStatus === "UNPAID"
        );
        setUnpaidInvoices(unpaidInvoices.length);

        const totalGrandTotal = invoices.reduce(
          (total, invoice) => total + invoice.grandTotal,
          0
        );
        setTotalGrandTotal(totalGrandTotal);
      } catch (error) {
        console.error("Error fetching vendor invoice details:", error);
      }
    };

    if (customerDetails) {
      fetchVendorInvoiceDetails();
    }
  }, [customerDetails, backendUrl]);

  // download data in csv format code goes here
  const handleCSVDownload = () => {
    // e.preventDefault();
    // Prompt the user for a custom filename
    const customFilename = window.prompt(
      "Enter a custom filename (without extension):"
    );

    if (!customFilename) {
      // If the user cancels or enters an empty string, do nothing
      return;
    }

    // Create a CSV-ready data array based on toggleTabsState
    let csvData;
    let headers;
    if (convertedToNumberActiveState === 1) {
      // Create a CSV-ready data array
      csvData = downloadData.map((item, index) => ({
        ID: item?.invoiceNumber,
        "Created On":
          item?.invoiceDate &&
          format(new Date(item?.invoiceDate), "MM/dd/yyyy"),
        Vouchers: item?.invoiceName,
        "Total Amount": item?.paymentAmount
          ? item?.balance
          : balance?.grandTotal,
        "Status ": item?.status,
        // Add more fields as needed
      }));
      // Define CSV headers
      headers = [
        { label: "Id", key: "invoiceNumber" },
        { label: "Created On", key: "invoiceDate" },
        { label: "Vouchers", key: "invoiceName" },
        { label: "Total Amount", key: "paymentAmount" },
        { label: "Stock", key: "status" },
      ];
    } else if (convertedToNumberActiveState === 2) {
      csvData = downloadData.map((item, index) => ({
        ID: item?.invoiceNumber,
        "Created On":
          item?.invoiceDate &&
          format(new Date(item?.invoiceDate), "MM/dd/yyyy"),
        Vouchers: item?.invoiceName,
        Credit: item?.credit,
        Debit: item?.debit,
        Balance: item?.customerBalance,
      }));
      headers = [
        { label: "ID", key: "invoiceNumber" },
        { label: "Created On", key: "invoiceDate" },
        { label: "Vouchers", key: "invoiceName" },
        { label: "Credit", key: "debit" },
        { label: "Debit", key: "debit" },
        { label: "Balance", key: "customerBalance" },
      ];
    } else if (convertedToNumberActiveState === 3) {
      csvData = downloadData?.products?.map((item, index) => ({
        // "No.": index + 1,
        "Item Name": item?.itemName,
        "Item Code": item?.itemCode,
        "Sales Quantity": item?.quantity,
        "Sales Amount": item?.purAmount,
      }));
      headers = [
        // { label: "No.", key: "itemName" },
        { label: "Item Name", key: "itemName" },
        { label: "Item Code", key: "itemCode" },
        { label: "Sales Quantity", key: "quantity" },
        { label: "Sales Amount", key: "purAmount" },
      ];
    } else {
      console.log(downloadData, "2");
    }

    // handleCSVDownload({ csvData, headers });
    // Generate CSV content
    const csvContent = {
      data: csvData,
      headers: headers,
      filename: `${customFilename}.csv`, // Use the custom filename
    };

    // Trigger download
    const csvLink = document.createElement("a");
    csvLink.href = encodeURI(
      `data:text/csv;charset=utf-8,${Papa.unparse(csvData, { header: true })}`
    );
    csvLink.target = "_blank";
    csvLink.download = `${customFilename}.csv`; // Use the custom filename
    csvLink.click();
  };
  // download data in csv format code goes here
  console.log("pnsjd", downloadData);
  // download data in pdf format code goes here

  const handlePDFDownload = (e) => {
    e.preventDefault();
    // Prompt the user for a custom filename
    const customFilename = window.prompt(
      "Enter a custom filename (without extension):"
    );

    if (!customFilename) {
      // If the user cancels or enters an empty string, do nothing
      return;
    }
    let pdfHeading =
      convertedToNumberActiveState === 0
        ? "Profile Data"
        : convertedToNumberActiveState === 1
          ? "Customer Transcation"
          : convertedToNumberActiveState === 2
            ? "Customer Ledger"
            : convertedToNumberActiveState === 3
              ? "Customer Item Wise Report"
              : "Item";
    const pdf = new jsPDF();
    pdf.text(pdfHeading, 10, 10);
    if (convertedToNumberActiveState === 0) {
    } else if (convertedToNumberActiveState === 1) {
      // Set up table columns
      var columns = [
        "Invoice ID",
        "Created On",
        "Vouchers",
        "Total Amount",
        "Status",
      ];
      // Set up table rows
      var rows = downloadData.map((item, index) => [
        item?.invoiceNumber,
        item?.invoiceDate && format(new Date(item?.invoiceDate), "MM/dd/yyyy"),
        item?.invoiceName,
        item?.paymentAmount,
        item?.status,
        // Add more fields as needed
      ]);
    } else if (convertedToNumberActiveState === 2) {
      // Set up table columns
      var columns = [
        "ID",
        "Created On",
        "Vouchers",
        "Credit",
        "Debit",
        "Balance",
      ];
      // Set up table rows
      var rows = downloadData.map((item, index) => [
        item?.invoiceNumber,
        item?.invoiceDate && format(new Date(item?.invoiceDate), "MM/dd/yyyy"),
        item?.invoiceName,
        item?.credit,
        item?.debit,
        item?.customerBalance,
        // getProductsByCategory(item?._id),
      ]);
    } else if (convertedToNumberActiveState === 3) {
      // Set up table columns
      columns = ["Item Name", "Item Code", "Sales Quantity", "Sales Amount"];
      // Set up table rows
      rows = downloadData?.products?.map((item, index) => [
        item?.itemName,
        item?.itemCode,
        item?.quantity,
        item?.purAmount,
      ]);
    } else {
      console.log(downloadData, "2");
    }

    // Set up table options
    const tableOptions = {
      startY: 20,
    };

    // Add the table to the PDF
    pdf.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    // Trigger PDF download with the custom filename
    pdf.save(`${customFilename}.pdf`);
  };

  const rowsPerPage = 5; // Define how many rows to show per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indexes of the items to be displayed on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = customerInvoiceDetails.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // Function to handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "#DAFED1";
      case "UNPAID":
        return "#FBE7E7";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };
  const getTextColor = (text) => {
    switch (text) {
      case "PAID":
        return "#59904B";
      case "UNPAID":
        return "#C95C5C";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };
  const columns = [
    {
      title: "Client Transcations",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <Link to={record} className="invoice-profile-iamge">
          <img src="../img/icon5.png" alt="" />
          {customerName?.name}
        </Link>
      ),
    },
    {
      title: (
        <>
          <div className="flex gap-1 items-center">
            Status <FaArrowDown className="mt-1" />
          </div>
        </>
      ),
      dataIndex: "invoiceStatus",
      render: (text, record) => (
        <span
          style={{
            backgroundColor: getStatusColor(text),
            color: getTextColor(text),
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          <Link to={record}>
            <span className="dot-line">.</span>
            {text}
          </Link>
        </span>
      ),
    },
    {
      title: "Invoice No",
      dataIndex: "invoiceNumber",
    },
    {
      title: "Order Date",
      dataIndex: "invoiceDate",
      render: (text, record) => {
        const formattedDate = new Date(record.invoiceDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <Link>{formattedDate}</Link>;
      },
    },
    {
      title: "Taxes",
      dataIndex: "totalTax",
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text, record) => {
        const formattedDate = new Date(record.dueDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <Link>{formattedDate}</Link>;
      },
    },
    {
      title: "Action",
      selector: (row) => row.action,
      sortable: true,
      render: (text, record, index) => (
        <div
          key={index}
          className="dropdown dropdown-action salesinvoice-action-icon"
        >
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-h telegramicon-sales" />
          </Link>

          <div className="dropdown-menu dropdown-menu-right">
            <Link to={`/view-expenses/${record._id}`} className="dropdown-item d-flex gap-1">
              <IoEye style={{ fontSize: '20px', marginRight: '7px' }} />
              <p>View</p>
            </Link>
            {record.balance === 0 ? (
              <Tooltip title="This Invoice cannot be Edited" placement="top">
                <div className="dropdown-item d-flex gap-1">
                  <img src="../newdashboard/editicon.png" alt="" />
                  <p>Edit</p>
                </div>
              </Tooltip>
            ) : (
              <Link
                to={`/edit-invoice/${record._id}`}
                className="dropdown-item d-flex gap-1"
              >
                <img src="../newdashboard/editicon.png" alt="" />
                <p>Edit</p>
              </Link>
            )}
            <Link
              // onClick={() => handleselectedInvoiceListidDelete(record._id)}
              className="dropdown-item d-flex gap-1"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
            >
              <img src="../newdashboard/deleteicon.svg" alt="" />
              <p>Delete</p>
            </Link>
          </div>
        </div>
      ),
      width: "250px",
    },
  ];

  useEffect(() => {
    const Title = document.getElementById("details");
    console.log("Title", Title);
  }, []);
  return (
    <>
      <div className={`main-wrapper customer-index ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper customer-details-parent-date customer-transction-data-change">
          <div className="content customer-details container-fluid">
            <div className="page-header">
              <div className="content-page-header mb-3">
                <h5 id="details">Customer Details</h5>
                {/* <h5 onClick={ChangeState}>Click</h5> */}

                {convertedToNumberActiveState == 0 ? (
                  <div className="row">
                    <div className="list-btn">
                      <ul className="filter-list">
                        <li className="add-customer-button">
                          <Dropdown
                            menu={{
                              items,
                            }}
                          >
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>
                                <FaPlus />
                                Create New Invoice
                              </Space>
                            </a>
                          </Dropdown>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : null}
                {convertedToNumberActiveState !== 0 ? (
                  <div className="row">
                    <div className="list-btn">
                      <ul className="filter-list">
                        <div
                          onClick={toggleContent}
                          className="add-customer-button"
                        >
                          <Link
                            to="#"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <div className="filterssales-image">
                              <img
                                src="../newdashboard/filterssales.svg"
                                alt=""
                              />
                            </div>
                            <p>Filters</p>
                          </Link>
                        </div>
                        <div className="add-customer-button">
                          <Link
                            to="#"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <RiDownloadCloud2Line />
                            Download
                          </Link>
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
                        </div>
                        <li className="add-customer-button">
                          <Dropdown
                            menu={{
                              items,
                            }}
                          >
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>
                                <FaPlus />
                                Create New Invoice
                              </Space>
                            </a>
                          </Dropdown>
                        </li>


                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="row customer-dashboard">
              <div className="col-md-12">
                <div className="card bg-white">
                  <div className="card-body">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 0,
                            })
                          }
                          className={`nav-link ${convertedToNumberActiveState === 0 && "active"
                            }`}
                          href="#Customertab1"
                          data-bs-toggle="tab"
                        >
                          Profile
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 1,
                            })
                          }
                          className={`nav-link ${convertedToNumberActiveState === 1 && "active"
                            }`}
                          href="#Customertab2"
                          data-bs-toggle="tab"
                        >
                          Transaction
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 2,
                            })
                          }
                          className={`nav-link ${convertedToNumberActiveState === 2 && "active"
                            }`}
                          href="#Customertab3"
                          data-bs-toggle="tab"
                        >
                          Ledger
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 3,
                            })
                          }
                          className={`nav-link ${convertedToNumberActiveState === 3 && "active"
                            }`}
                          href="#Customertab4"
                          data-bs-toggle="tab"
                        >
                          Item wise Report
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 0 && "show active"
                          } `}
                        id="Customertab1"
                      >
                        {/* /Page Header */}
                        <div className="customer-details-group">
                          <div className="row align-items-center">
                            <div className="col-md-4">
                              <div className="customer-name-address-change ">
                                <div className="d-flex gap-4 pb-2">
                                  <div>
                                    <img src="../img/icon1.png" alt="" />
                                  </div>
                                  <div className="text-mater ">
                                    <h6>
                                      {customerDetails && customerDetails.name}
                                    </h6>
                                    {/* <p className="pt-1">12th Dec 2024</p> */}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <div className="text-mater ">
                                    <p>Phone</p>
                                    <h6>
                                      {customerDetails &&
                                        customerDetails.phoneNumber}
                                    </h6>
                                  </div>
                                  <div className="text-mater ">
                                    <p>Email</p>
                                    <h6>
                                      {customerDetails && customerDetails.email}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="customer-name-address-change ">
                                <div className="d-flex justify-content-between align-items-center mx-3">
                                  <div>
                                    <img src="../img/icon 2.png" alt="" />
                                  </div>
                                  <div className="text-mater ">
                                    <p>Address</p>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between g-3">
                                  <div className="text-mater">
                                    <p>Billing Address</p>
                                    {/* {customerDetails?.billingAddress > 0 && ( */}
                                    <h6>
                                      {" "}
                                      {
                                        customerDetails?.billingAddress
                                          ?.addressLine1
                                      }
                                      {", "}
                                      {
                                        customerDetails?.billingAddress?.country
                                          ?.name
                                      }
                                      {", "}
                                      {
                                        customerDetails?.billingAddress?.state
                                          ?.name
                                      }
                                      {", "}
                                      {
                                        customerDetails?.billingAddress?.city
                                          ?.name
                                      }
                                      {", "}
                                      {customerDetails?.billingAddress?.pincode}
                                    </h6>
                                    {/* // )} */}
                                  </div>
                                  <div className="text-mater">
                                    <p className="">Shipping Address</p>
                                    {/* {customerDetails?.shippingAddress > 0 && ( */}
                                    <h6 className="">
                                      {" "}
                                      {
                                        customerDetails?.shippingAddress
                                          ?.addressLine1
                                      }
                                      {", "}
                                      {
                                        customerDetails?.shippingAddress
                                          ?.country?.name
                                      }
                                      {", "}
                                      {
                                        customerDetails?.shippingAddress?.state
                                          ?.name
                                      }
                                      {", "}
                                      {
                                        customerDetails?.shippingAddress?.city
                                          ?.name
                                      }
                                      {", "}
                                      {
                                        customerDetails?.shippingAddress
                                          ?.pincode
                                      }
                                    </h6>
                                    {/* )} */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="customer-name-address-change ">
                                <div className="d-flex justify-content-between align-items-center pb-2 mx-3">
                                  <div>
                                    <img src="../img/icon3.png" alt="" />
                                  </div>
                                  <div className="text-mater ">
                                    <h2>All Time</h2>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between g-3">
                                  <div className="text-mater">
                                    <p>Total Orders Value</p>

                                    <h6>{totalGrandTotal}</h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="customer-name-address-change ">
                                <div className="d-flex justify-content-between align-items-center pb-2 mx-3">
                                  <div>
                                    <img src="../img/icon4.png" alt="" />
                                  </div>
                                  <div className="text-mater ">
                                    <h2> All Time</h2>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between g-3">
                                  <div className="text-mater1">
                                    <p>Total Invoices</p>

                                    <h6>{invoiceCount}</h6>
                                  </div>
                                  <div className="text-mater1">
                                    <p>Pending</p>

                                    <h6>{unpaidInvoices}</h6>
                                  </div>
                                  <div className="text-mater1">
                                    <p>Paid(cleared)</p>

                                    <h6>{paidInvoices}</h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="customer-name-address-change ">
                                <div className="text-mater123">
                                  <h3>
                                    GST NO :{" "}
                                    {customerDetails && customerDetails?.GSTNo}
                                  </h3>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="customer-name-address-change ">
                                <div className="text-mater123">
                                  <h3>
                                    PAN NO : <br />
                                    {customerDetails && customerDetails?.PANNumber}
                                  </h3>
                                </div>
                              </div>
                            </div>
                            {/* } */}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8 table-invoice-datain-page">
                            <Table
                              pagination={{
                                showTotal: (total, range) =>
                                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                // showSizeChanger: true,
                                onShowSizeChange: onShowSizeChange,
                                itemRender: itemRender,
                              }}
                              rowKey={(record) => record.id}
                              columns={columns}
                              dataSource={customerInvoiceDetails}
                            />
                          </div>
                          <div className="col-md-4 ">
                            <div className="edit-delte-buttons-page d-flex justify-content-between">
                              <button
                                className="edit-button"
                                type="button"
                                onClick={() => {
                                  handleEdit(cusid);
                                  setEditCustomer1(true);
                                }}
                              >
                                Edit Customer
                              </button>

                              <button
                                className="delte-button"
                                onClick={handleUpdateDelete}
                              >
                                Delete Customer
                              </button>
                            </div>
                            <Advitise />
                          </div>
                        </div>
                        {/* Inovices card */}
                        {/* <TotalLengthBlocks
                          Recepit={Recepit}
                          totalAmount={totalAmount}
                          customerDetails={customerDetails}
                          TransactionMinus={TransactionMinus}
                          balance={balance}
                          ArchiveBook={ArchiveBook}
                          totalNumbers={totalNumbers}
                          Clipboard={Clipboard}
                        /> */}
                      </div>
                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 1 && "show active"
                          } `}
                        id="Customertab2"
                      >
                        <Transactions
                          id={id}
                          showContent={showContent}
                          toggleContent={toggleContent}
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          datasource={datasource}
                          filteredDatasource={filteredDatasource}
                        />
                      </div>
                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 2 && "show active"
                          } `}
                        id="Customertab3"
                      >
                        <Ledger
                          id={id}
                          showContent={showContent}
                          toggleContent={toggleContent}
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          datasource={datasource}
                          filteredDatasource={filteredDatasource}
                        />
                      </div>
                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 3 && "show active"
                          } `}
                        id="Customertab4"
                      >
                        <ItemwiseReport
                          id={id}
                          toggleContent={toggleContent}
                          showContent={showContent}
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          datasource={datasource}
                          filteredDatasource={filteredDatasource}
                        />
                      </div>
                    </div>
                    <Modal
                      onCancel={() => setDeleteUpdateModal(false)}
                      closable={false}
                      open={deleteUpdateModal}
                      footer={null}
                    >
                      <div className="form-header">
                        <h3 className="update-popup-buttons">
                          Delete Customer
                        </h3>
                        <p>Are you sure you want to delete this customer?</p>
                      </div>
                      <div className="modal-btn delete-action">
                        <div className="row">
                          <div className="col-6">
                            <button
                              type="submit"
                              className="w-100 btn btn-primary paid-continue-btn"
                              onClick={handleDelete}
                            >
                              Delete
                            </button>
                          </div>
                          <div className="col-6">
                            <button
                              type="submit"
                              onClick={() => setDeleteUpdateModal(false)}
                              className="w-100 btn btn-primary paid-cancel-btn delete-category"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    <EditCustomerModal
                      editCustomer1={editCustomer1}
                      // cusid={cusid}
                      onCancel={() => setEditCustomer1(false)}
                      customerDetails={customerDetails}
                      fetchCustomerDetails={fetchCustomerDetails}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;
