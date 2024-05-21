import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Button, Table, Typography, Divider, Radio, Tooltip } from "antd";
import { itemRender } from "../_components/paginationfunction";
import InvoiceHead from "./invoiceHead";
import axios from "axios";
import InvoicePaid from "./Invoicepaid";
import InvoiceOutstanding from "./InvoiceOutstanding";
import Invoiceoverdue from "./Invoiceoverdue";
import SalesFilters from "./filters/SalesFilters";
import useFiltersSales from "./customeHooks/useFiltersSales";
import useSalesUrlHandler from "./customeHooks/useSalesUrlHandler";
import useDeleteSales from "./customeHooks/useDeleteSales";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import ViewButton from "../Buttons/ViewButton";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import { PiTelegramLogo, PiTelegramLogoBold } from "react-icons/pi";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";

// import { IoCopyOutline, IoSettingsOutline } from "react-icons/io5";
import { Menu, Dropdown } from "antd";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { BsMenuApp } from "react-icons/bs";
import { FaArrowDown } from "react-icons/fa6";
import Middleware from "../_components/Middleware";
import html2pdf from "html2pdf.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import sharedRef from "./SharedRef";

const InvoiceList = ({ active }) => {
  const { SearchData } = useFiltersSales();
  const { handleDeleteInvoice } = useDeleteSales();
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [deletedInvoices, setDeletedInvoices] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const invoiceContentRef = useRef(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const history = useHistory();
  const dateSelectDrop = [
    {
      title: "Created On",
      value: "invoiceDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Invoice No.",
      value: "invoiceNumber",
    },
    {
      title: "Invoice To",
      value: "customerName?.name",
    },
    {
      title: "Total Amount",
      value: "grandTotal",
    },
    {
      title: "Balance",
      value: "balance",
    },
  ];
  const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
  const [selectedSearchVar, setSelectedSearchVar] =
    useState("customerName?.name");
  const [searchContent, setSearchContent] = useState(null);
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);
  const [filteredDatasource, setFilteredDatasource] = useState([]);

  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();

  useEffect(() => {
    if (convertedToNumberActiveState === 0) {
      const fetchDownloadData = async () => {
        const data = isFiltered
          ? [...filteredDatasource].reverse()
          : [...datasource].reverse();
        let downloadableData = SearchData({
          data: data,
          selectedVar: selectedSearchVar,
          searchValue: searchContent,
        });
        setDownloadData(downloadableData);
      };
      fetchDownloadData();
    }
  }, [isFiltered, filteredDatasource, searchContent]);

  const [showContent, setShowContent] = useState(false);
  const [showContentSalesMenu, setShowContentSalesMenu] = useState(false);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const toggleContentSalesMenu = () => {
    setShowContentSalesMenu(!showContentSalesMenu);
  };
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const userData = useSelector((state) => state?.user?.userData);

  useEffect(() => {
    fetchData(1);
  }, []);

  const [paidInvoices, setPaidInvoices] = useState(0);

  const fetchData = async (page) => {
    try {
      if (userData?.data?._id) {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:8000/api/addInvoice/invoices/${userData?.data?._id}?page=${page}&pageSize=10`
        );
        const invoices = response.data;
        setDatasource(invoices);
        setFilteredDatasource(invoices);
        setLoading(false);
        setTotalPages(invoices);
      }
      // const paidInvoices = invoices.filteer
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toggleTabsState, userData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return { bg: "#a5f990", text: "#59904B" };
      case "UNPAID":
        return { bg: "#FBE7E7", text: "#C95C5C" };
      case "PARTIALLY PAID":
        return { bg: "#FBE7E7", text: "#C95C5C" };
      default:
        return { bg: "white", text: "#333" };
    }
  };

  const [invoiceListid, setInvoiceListid] = useState("");



  console.log("invoiceListid", invoiceListid);

  const handleselectedInvoiceListidDelete = (value) => {
    setInvoiceListid(value);
  };

  const [invoiceDetails, setInvoiceDetails] = useState([]);



  const invoiceDetailsLink = (record) => {
    const { _id, invoiceDate, invoiceName, invoiceNumber, customerName } =
      record;

    const customerPhone = customerName?.phone;
    const customerGSTNo = customerName?.GSTNo;
    const email = customerName?.email;
    const billingAddress = customerName?.billingAddress || {};
    const { addressLine1, addressLine2, country, state, city, pincode } =
      billingAddress;

    const link =
      `/invoice-details/${_id}?` +
      `date=${invoiceDate}` +
      `&Name=${invoiceName}` +
      `&Number=${invoiceNumber}` +
      `&name=${customerName?.name}` +
      `&phone=${customerPhone}` +
      `&GSTNo=${customerGSTNo}` +
      `&email=${email}` +
      `&addressLine1=${addressLine1}` +
      `&addressLine2=${addressLine2}` +
      `&country=${country}` +
      `&state=${state}` +
      `&city=${city}` +
      `&pincode=${pincode}`;

    return link;
  };

  const [checkedRecords, setCheckedRecords] = useState([]);

  const handleCheckboxChange = (index) => {
    const isChecked = checkedRecords.includes(index);
    if (isChecked) {
      setCheckedRecords(checkedRecords.filter((item) => item !== index));
    } else {
      setCheckedRecords([...checkedRecords, index]);
    }
  };

  const handleDownloadPDF = (record) =>{
    sharedRef.current = { message: 'Download PDF' };  
    history.push(invoiceDetailsLink(record));  
  }

  const handleshare = (record) =>{
    sharedRef.current = { message: 'Share PDF'};
    history.push(invoiceDetailsLink(record));
  }

  const columns = [
    {
      title: (
        <div>
          <input type="checkbox" className="salesInvoiceCheckbox" />
        </div>
      ),
      dataIndex: "customerName",
      render: (customerName, record, index) => (
        <div>
          <input
            type="checkbox"
            checked={checkedRecords.includes(index)}
            onChange={() => handleCheckboxChange(index)}
          />
        </div>
      ),
    },
    {
      title: "Client",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <div
          className="d-flex gap-2 align-items-center"
          style={{ width: "220px" }}
        >
          <img
            className="userbadge"
            src="./newdashboard/userbadge.png"
            alt=""
          />
          <Link to={invoiceDetailsLink(record)}>
            {customerName?.name || "N/A"}
          </Link>
        </div>
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
      render: (text, record) => {
        const { bg, text: textColor } = getStatusColor(text);
        return (
          <span
            style={{
              backgroundColor: bg,
              color: textColor,
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: 500,
              width: "80px", // Adjust the width as needed
              display: "inline-block", // Ensures that width property works
            }}
          >
            <Link
              to={invoiceDetailsLink(record)}
              style={{ marginRight: "5px" }}
            >
              <span style={{ fontWeight: 600, fontSize: 20 }}>.</span> {text}
            </Link>
          </span>
        );
      },
    },

    {
      title: "Invoice No",
      dataIndex: "invoiceNumber",
      render: (invoiceNumber, record) => (
        <Link to={invoiceDetailsLink(record)}>
          <h2 className="table-avatar">{invoiceNumber}</h2>
        </Link>
      ),
    },
    {
      title: "Taxes",
      dataIndex: "totalTax",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>
          <h2 className="table-avatar">{record.totalTax}</h2>
        </Link>
      ),
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>
          <h2 className="table-avatar">{record.grandTotal}</h2>
        </Link>
      ),
    },
    {
      title: "Date",
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
        return (
          <Link to={invoiceDetailsLink(record)}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    // {
    //   title: "Balance",
    //   dataIndex: "balance",
    //   render: (text, record) => (
    //     <Link to={invoiceDetailsLink(record)}>{text}</Link>
    //   ),
    // },
    // {
    //   title: "Due Date",
    //   dataIndex: "dueDate",
    //   render: (text, record) => {
    //     const formattedDate = new Date(record.dueDate).toLocaleDateString(
    //       "en-GB",
    //       {
    //         year: "numeric",
    //         month: "2-digit",
    //         day: "2-digit",
    //       }
    //     );
    //     return (
    //       <Link to={invoiceDetailsLink(record)}>
    //         <span>{formattedDate}</span>
    //       </Link>
    //     );
    //   },
    // },
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
            aria-expanded="false"
          >
            <PiTelegramLogoBold className="telegramicon-sales"  onClick={()=> handleshare(record)}/>
          </Link>
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-h telegramicon-sales" />
          </Link>

          <div className="dropdown-menu dropdown-menu-right">
            {record.balance === 0 ? (
              <Tooltip title="This Invoice cannot be Edited" placement="top">
                <div className="dropdown-item d-flex gap-1">
                  <img src="./newdashboard/editicon.png" alt="" />
                  <p>Edit</p>
                </div>
              </Tooltip>
            ) : (
              <Link
                to={`/edit-invoice/${record._id}`}
                className="dropdown-item d-flex gap-1"
              >
                <img src="./newdashboard/editicon.png" alt="" />
                <p>Edit</p>
              </Link>
            )}
            <Link
              onClick={() => handleselectedInvoiceListidDelete(record._id)}
              className="dropdown-item d-flex gap-1"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
            >
              <img src="./newdashboard/deleteicon.svg" alt="" />
              <p>Delete</p>
            </Link>
            <Link className="dropdown-item" to="#">
              <h5>Export to ..</h5>
            </Link>
            <div className="dropdown-item d-flex gap-1" onClick={()=>handleDownloadPDF(record)}>
              <img src="./newdashboard/importfile.png" alt="" />
              <p>PDF</p>
            </div>
            {/* <Link className="dropdown-item d-flex gap-1" to="#">
              <img src="./newdashboard/importfile.png" alt="" />
              <p>CSV</p>
            </Link> */}
          </div>
        </div>
      ),
      width: "250px",
    },

    
  ];
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className={`page-wrapper ${active && "ml-0 pt-[20px]"}`}>
          <div className={`content container-fluid ${active && "p-0"}`}>
            <InvoiceHead
              toggleTabsState={convertedToNumberActiveState}
              setShow={setShow}
              show={show}
              showContent={showContent}
              toggleContent={toggleContent}
              dataSourceDownload={downloadData}
              active={active}
            />
            <div className="Sales-invoice-details-table-parent">
              <div className="row">
                <div className="col-md-9">
                  <div className="Sales-invoice-details-table-sub1">
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
                                className={`nav-link ${
                                  convertedToNumberActiveState === 0 && "active"
                                }`}
                                href="#salesinvoice1"
                                data-bs-toggle="tab"
                              >
                                All Invoice
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
                                className={`nav-link ${
                                  convertedToNumberActiveState === 1 && "active"
                                }`}
                                href="#salesinvoice2"
                                data-bs-toggle="tab"
                              >
                                Paid
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
                                className={`nav-link ${
                                  convertedToNumberActiveState === 3 && "active"
                                }`}
                                href="#salesinvoice4"
                                data-bs-toggle="tab"
                              >
                                UnPaid
                              </a>
                            </li>
                          </ul>
                          <div className="tab-content">
                            <div
                              className={`tab-pane ${
                                convertedToNumberActiveState === 0 &&
                                "show active"
                              } `}
                              id="salesinvoice1"
                            >
                              {/* Table */}
                              <div className="row my-3 mt-0">
                                <div className="col-sm-12">
                                  <div className="card-table">
                                    <div className="card-body invoiceList">
                                      <div className="table-responsive table-hover">
                                        <div className="table-filter p-0">
                                          {showContent && (
                                            <SalesFilters
                                              datasource={datasource}
                                              dateSelectDrop={dateSelectDrop}
                                              reversedDataSource={
                                                reversedDataSource
                                              }
                                              searchContent={searchContent}
                                              searchSelectDrop={
                                                searchSelectDrop
                                              }
                                              selectedDateVar={selectedDateVar}
                                              selectedSearchVar={
                                                selectedSearchVar
                                              }
                                              setFilteredDatasource={
                                                setFilteredDatasource
                                              }
                                              setIsFiltered={setIsFiltered}
                                              setSearchContent={
                                                setSearchContent
                                              }
                                              setSelectedDateVar={
                                                setSelectedDateVar
                                              }
                                              setSelectedSearchVar={
                                                setSelectedSearchVar
                                              }
                                            />
                                          )}
                                        </div>
                                        <Table
                                          pagination={{
                                            pageSize: 10,
                                            total: totalPages,
                                            onChange: (page) => {
                                              fetchData(page);
                                            },

                                            itemRender: itemRender,
                                          }}
                                          columns={columns}
                                          dataSource={SearchData({
                                            data: reversedDataSource,
                                            selectedVar: selectedSearchVar,
                                            searchValue: searchContent,
                                          })}
                                          rowKey={(record) => record.id}
                                          loading={loading}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* /Table */}
                            </div>
                            <div
                              className="modal custom-modal fade"
                              id="delete_modal"
                              role="dialog"
                            >
                              <div className="modal-dialog modal-dialog-centered modal-md">
                                <div className="modal-content">
                                  <div className="modal-body">
                                    <div className="form-header">
                                      <h3>Delete Invoice</h3>
                                      <p>Are you sure want to delete?</p>
                                    </div>
                                    <div className="modal-btn delete-action">
                                      <div className="row">
                                        <div className="col-6">
                                          <button
                                            type="reset"
                                            onClick={() =>
                                              handleDeleteInvoice({
                                                invoiceId: invoiceListid,
                                                setDatasource: setDatasource,
                                                setDeletedInvoices:
                                                  setDeletedInvoices,
                                                datasource: datasource,
                                                setFilteredDatasource:
                                                  setFilteredDatasource,
                                              })
                                            }
                                            data-bs-dismiss="modal"
                                            className="w-100 btn btn-primary paid-continue-btn"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                        <div className="col-6">
                                          <button
                                            type="submit"
                                            data-bs-dismiss="modal"
                                            className="w-100 btn btn-primary paid-continue-btn"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`tab-pane ${
                                convertedToNumberActiveState === 1 &&
                                "show active"
                              } `}
                              id="salesinvoice2"
                            >
                              <InvoicePaid
                                setDownloadData={setDownloadData}
                                toggleTabsState={convertedToNumberActiveState}
                                showContent={showContent}
                                datasourcePaid={datasource}
                                filteredDatasourcePaid={filteredDatasource}
                              />
                            </div>

                            <div
                              className={`tab-pane ${
                                convertedToNumberActiveState === 2 &&
                                "show active"
                              } `}
                              id="salesinvoice3"
                            >
                              <Invoiceoverdue
                                setDownloadData={setDownloadData}
                                toggleTabsState={convertedToNumberActiveState}
                                showContent={showContent}
                                // datasourceUnPaid={datasource}
                                // filteredDatasourceUnPaid={filteredDatasource}
                              />
                            </div>

                            <div
                              className={`tab-pane ${
                                convertedToNumberActiveState === 3 &&
                                "show active"
                              } `}
                              id="salesinvoice4"
                            >
                              <InvoiceOutstanding
                                setDownloadData={setDownloadData}
                                toggleTabsState={convertedToNumberActiveState}
                                showContent={showContent}
                                datasourceUnPaid={datasource}
                                filteredDatasourceUnPaid={filteredDatasource}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  {/* <div className="card-top-buttons">
                    <button>
                      Edit Customer
                    </button>
                    <button>
                      Delete Customer
                    </button>
                  </div> */}
                  <div className="Sales-invoice-details-table-sub2">
                    <div class="card">
                      <div className="Sales-invoice-details-table-sub2-image">
                        <img src="./newdashboard/salescardimage.png" alt="" />
                      </div>
                      <div class="card-body">
                        <h5 class="card-title">
                          Welcome to the new Brand-na experience
                        </h5>
                        <p class="card-text">
                          Discover the new page of Invoices, along with a whole
                          renewed experience.
                        </p>
                        <button>Read More</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* customer details tabs code here  */}

            <div className="row"></div>
            {/* customer details tabs code here  */}
          </div>
        </div>
      </div>

      {/* {invoiceDetails?.invoiceDate && (
        <SendEmail
          endpoint={`/view-only-invoice/addInvoice/invoicesforview/${id}`}
          defaultMail={invoiceDetails?.customerName?.email}
        />
      )} */}
    </>
  );
};

export default InvoiceList;
