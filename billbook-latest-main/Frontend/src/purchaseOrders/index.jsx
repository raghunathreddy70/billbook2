import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import {
  Input,
  Pagination,
  Space,
  Table,
  Button,
  Typography,
  Tooltip,
} from "antd";
import * as XLSX from "xlsx";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
const { Text } = Typography;
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import "jspdf-autotable";
import { format } from "date-fns";
import Papa from "papaparse";
import useHandleDownload from "../Hooks/useHandleDownload";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import DeleteModal from "../invoices/Modals/DeleteModal";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import { PiTelegramLogoBold } from "react-icons/pi";
import { RiDownloadCloud2Line } from "react-icons/ri";
import PurchaseOrderCards from "./PurchaseOrderCards";
import { FaPlus } from "react-icons/fa";

const PurchaseOrders = () => {
  const { handleDeleteInvoice } = useDeleteSales();

  const { SearchData } = useFiltersSales();
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const { handleDeletePurchaseOrders } = useDeleteSales();
  const [datasource, setDatasource] = useState([]);
  const [deletedInvoices, setDeletedInvoices] = useState([]);

  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [menu, setMenu] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Purchase Order Date",
      value: "purchasesORDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Purchase Order Number",
      value: "purchaseORNumber",
    },
    {
      title: "Purchase Order To",
      value: "name?.name",
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
  const [selectedDateVar, setSelectedDateVar] = useState("purchasesORDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("name?.name");
  const [searchContent, setSearchContent] = useState(null);

  useEffect(() => {
    if (
      toggleTabsState !== 1 &&
      toggleTabsState !== 2 &&
      toggleTabsState !== 3
    ) {
      setToggleTabsState(0);
    }
  }, [toggleTabsState]);

  const [showContent, setShowContent] = useState(false);
  const toggleContent = () => {
    setShowContent(!showContent);
  };

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();

  useEffect(() => {
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
  }, [isFiltered, filteredDatasource, searchContent]);

  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Purchase Order Number": item?.purchaseORNumber,
      "Purchase Order To": item?.name?.name,
      "Purchase Order Date": item?.purchasesORDate, // Format purchasesORDate
      "Due Date": item?.dueDate, // Format dueDate
      "Total Amount": item?.grandTotal,
      "Balance ": item?.balance,
      "Status ": item?.purchaseStatus,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Purchase Order Number", key: "purchaseORNumber" },
      { label: "Purchase Order To", key: "name.name" },
      { label: "Purchase Order Date", key: "purchasesORDate" },
      { label: "Due Date", key: "dueDate" },
      { label: "Balance", key: "balance" },
      { label: "Status", key: "purchaseStatus" },
      // Add more headers as needed
    ];
    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "Purchase Order Number",
      "Purchase Order To",
      "Purchase Order Date",
      "Due Date",
      "Total Amount",
      "Balance",
      "Status",
    ];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.purchaseORNumber,
      item?.name?.name,
      item?.purchasesORDate &&
      format(new Date(item?.purchasesORDate), "MM/dd/yyyy"),
      item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"),
      item?.grandTotal,
      item?.balance,
      item?.purchaseStatus,
    ]);
    handlePDFDownload({ columns, rows, heading: "Purchase Orders" });
  };

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };
  const userData = useSelector((state) => state?.user?.userData);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchData(1);
  }, []);

  const [purOrderLength, setpurOrderLength] = useState(0);
  const [totalPurOrdAmount, setTotalPurOrdAmount] = useState(0);

  const fetchData = async (page) => {
    try {
      if (userData?.data?._id) {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/purchaseorder/purchaseOrder/${userData?.data?._id}?page=${page}&pageSize=10`
        );
        setLoading(false);
        setTotalPages(response.data?.length);
        setDatasource(response.data);
        setFilteredDatasource(response.data);

        const purOrdLength = response.data.length;
        setpurOrderLength(purOrdLength);

        const totalPurOrdAmount = response.data.reduce((total, purchase) => {
          return total + (Number(purchase.grandTotal) || 0);
        }, 0);
        setTotalPurOrdAmount(totalPurOrdAmount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userData]);


  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "#33B469";
      case "UNPAID":
        return "#ed2020";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };

  const [purchaseOrderid, setPurchaseOrderid] = useState("");
  console.log("purchaseOrderid", purchaseOrderid);
  const handleselectedPurchaseOrderidDelete = (value) => {
    setPurchaseOrderid(value);
  };

  const invoiceDetailsLink = (record) => {
    const { _id, purchasesORDate, purchaseORName, purchaseORNumber, name } =
      record;
    const customerPhone = name?.phoneNumber;
    const customerGSTNo = name?.GSTNo;
    const email = name?.email;
    const addressLine1 = name?.addressLine1;
    const addressLine2 = name?.addressLine2;

    const link =
      `/purchase-order-view/${_id}?` +
      `date=${purchasesORDate}` +
      `&Name=${purchaseORName}` +
      `&Number=${purchaseORNumber}` +
      `&name=${name?.name}` +
      `&phone=${customerPhone}` +
      `&GSTNo=${customerGSTNo}` +
      `&email=${email}` +
      `&addressLine1=${addressLine1}` +
      `&addressLine2=${addressLine2}`;

    return link;
  };

  const columns = [
    {
      title: "Purchase Order To",
      dataIndex: "name",
      render: (name, record) => (
        <div className="d-flex gap-2 align-items-center">
          <img
            className="userbadge"
            src="./newdashboard/userbadge.png"
            alt=""
          />
          <Link to={invoiceDetailsLink(record)}>{name?.name || "N/A"}</Link>
        </div>
      ),
    },
    {
      title: "Purchase Order Number",
      dataIndex: "purchaseORNumber",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>{text}</Link>
      ),
    },
    {
      title: "Purchase Order Date",
      dataIndex: "purchasesORDate",
      render: (text, record) => {
        const formattedDate = new Date(
          record.purchasesORDate
        ).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <Link to={invoiceDetailsLink(record)}>{formattedDate}</Link>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>{text}</Link>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>{text}</Link>
      ),
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
        return <Link to={invoiceDetailsLink(record)}>{formattedDate}</Link>;
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
            aria-expanded="false"
          >
            <PiTelegramLogoBold className="telegramicon-sales" />
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
            <Link
              to={`/edit-purchase-order/${record._id}`}
              className="dropdown-item d-flex gap-1"
            >
              <img src="./newdashboard/editicon.png" alt="" />
              <p>Edit</p>
            </Link>

            <Link
              onClick={() => handleselectedPurchaseOrderidDelete(record._id)}
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
            <Link className="dropdown-item d-flex gap-1" to="#">
              <img src="./newdashboard/importfile.png" alt="" />
              <p>PDF</p>
            </Link>

          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header 700:mb-3 300:mb-2">
              <div className="content-page-header 300:mb-0">
                <h5>Purchase Orders</h5>
                <div className="d-flex gap-1 align-items-center">
                  <div className="d-flex gap-2 align-items-center">
                    <Tooltip title="Filters" placement="top">
                      <button
                        className="btn btn-primary"
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
                  <Tooltip title="Create Purchase Order" placement="top">
                    <Link className="btn btn-primary" to="/add-purchase-order">
                      <FaPlus className="mr-2" />
                      Add Purchase Order
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>
            <PurchaseOrderCards
              purOrderLength={purOrderLength}
              totalPurOrdAmount={totalPurOrdAmount}
            />
            <div
              id="con-close-modal"
              className="modal fade"
              tabIndex={-1}
              role="dialog"
              aria-hidden="true"
              style={{ display: "none" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Quick Payment Out Settings</h4>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body p-4">
                    <div className="row">
                      <div className="col-lg-12 col-md-6 col-sm-12">
                        <div className="form-group manage-business-enable-tds">
                          <p>Payment Out Prefix & Sequence Number</p>
                          <span>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={handleCheckboxChange}
                              />
                              <span className="slider round"></span>
                            </label>
                          </span>
                        </div>
                      </div>
                    </div>
                    {isEnabled && (
                      <div>
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label>Prefix</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Prefix"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label>Sequence Number</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sequence No"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group">
                            <p>Payment Out Number:&nbsp;</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary waves-effect me-2"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-info waves-effect waves-light"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* /Page Header */}

            <div className="tab-pane show active" id="salesinvoice1">
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
                              reversedDataSource={reversedDataSource}
                              searchContent={searchContent}
                              searchSelectDrop={searchSelectDrop}
                              selectedDateVar={selectedDateVar}
                              selectedSearchVar={selectedSearchVar}
                              setFilteredDatasource={setFilteredDatasource}
                              setIsFiltered={setIsFiltered}
                              setSearchContent={setSearchContent}
                              setSelectedDateVar={setSelectedDateVar}
                              setSelectedSearchVar={setSelectedSearchVar}
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
                            // total: SearchData({
                            //   data: reversedDataSource,
                            //   selectedVar: selectedSearchVar,
                            //   searchValue: searchContent,
                            // }).length,
                            // showTotal: (total, range) =>
                            //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            // showSizeChanger: true,
                            itemRender: itemRender,
                          }}
                          columns={columns}
                          dataSource={SearchData({
                            data: reversedDataSource,
                            selectedVar: selectedSearchVar,
                            searchValue: searchContent,
                          })}
                          loading={loading}
                          rowKey={(record) => record.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Table */}
            </div>
          </div>
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
                            invoiceId: purchaseOrderid,
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
        
      </div>
    </>
  );
};

export default PurchaseOrders;
