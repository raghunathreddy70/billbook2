import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
// import Data from "../assets/jsons/inventory";
import "../_components/antd.css";
import { Input, Pagination, Space, Table, Tooltip } from "antd";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";

import Select2 from "react-select2-wrapper";

import axios from "axios";

import "jspdf-autotable";
import { format } from "date-fns";
import Papa from "papaparse";
import useHandleDownload from "../Hooks/useHandleDownload";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import { useSelector } from "react-redux";
import { RiDownloadCloud2Line } from "react-icons/ri";

const PaymentIn = () => {
  const { SearchData } = useFiltersSales();
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [paymentDetails, setPaymentDetails] = useState([]);

  const [menu, setMenu] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);

  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);

  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Date",
      value: "paymentDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Payment Number.",
      value: "paymentNumber",
    },
    {
      title: "Customer Name",
      value: "customerName?.name",
    },
    {
      title: "Amount",
      value: "paymentAmount",
    },
  ];
  const [selectedDateVar, setSelectedDateVar] = useState("paymentDate");
  const [selectedSearchVar, setSelectedSearchVar] =
    useState("customerName?.name");
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

  const [filteredDatasource, setFilteredDatasource] = useState([]);

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...paymentDetails].reverse();

  useEffect(() => {
    const fetchDownloadData = async () => {
      const data = isFiltered
        ? [...filteredDatasource].reverse()
        : [...paymentDetails].reverse();
      let downloadableData = SearchData({
        data: data,
        selectedVar: selectedSearchVar,
        searchValue: searchContent,
      });
      setDownloadData(downloadableData);
    };
    fetchDownloadData();
  }, [isFiltered, filteredDatasource, searchContent]);

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };

  const [units, setUnits] = useState([
    { id: 1, text: "Pieces" },
    { id: 2, text: "Inches" },
    { id: 3, text: "Kilograms" },
    { id: 4, text: "Inches" },
    { id: 5, text: "Box" },
  ]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const userData = useSelector((state) => state?.user?.userData)
  useEffect(() => {
    fetchPaymentDetails(1);
  }, []);
  const fetchPaymentDetails = async (page) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:8000/api/paymentDetails/payment/${userData?.data?._id}?page=${page}&pageSize=10`
      );
      setLoading(false)
      setPaymentDetails(response.data.filter(item => !item.isDeleted));
      setFilteredDatasource(response.data.filter(item => !item.isDeleted));

      setTotalPages(response.data?.length);
    } catch (error) {
      console.error("Error fetching Payment details:", error);
    }
    finally {
      setLoading(false);
    };
  }

  useEffect(() => {
    fetchPaymentDetails();
  }, [userData]);
  console.log("paymentDetails", paymentDetails);

  const columns = [
    {
      title: "Date",
      dataIndex: "paymentDate",
      render: (text, record) => {
        const formattedDate = new Date(record.paymentDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return (
          <Link to={`/paymetin-view/${record._id}`}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    {
      title: "Vocher Name",
      dataIndex: "voucherName",
    },
    {
      title: "Payment Number",
      dataIndex: "paymentNumber",
      render: (text, record) => (
        <Link to={`/paymetin-view/${record._id}`}>
          <h2 className="table-avatar">{record.paymentNumber}</h2>
        </Link>
      ),
    },

    {
      title: "Customer Name",
      dataIndex: "customername",
      render: (text, record) => (
        <div>
          {text?.name}
        </div>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];

  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      Date:
        item?.paymentDate && format(new Date(item?.paymentDate), "MM/dd/yyyy"),
      "Payment Number": item?.paymentNumber,
      "Customer Name": item?.customerName?.name,
      "Amount ": item?.paymentAmount,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Date", key: "paymentDate" },
      { label: "Payment Number", key: "paymentNumber" },
      { label: "Customer Name", key: "customerName?.name" },
      { label: "Amount", key: "paymentAmount" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ["Date", "Payment Number", "Customer Name", "Amount"];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.paymentDate && format(new Date(item?.paymentDate), "MM/dd/yyyy"),
      item?.paymentNumber,
      item?.customerName?.name,
      item?.paymentAmount,
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Payment In" });
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header 700:mb-3 300:mb-2">
              <div className="content-page-header 300:mb-0">
                <h5>Payment In</h5>

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
                  <Tooltip
                    placement="topLeft"
                    title={"Create Payment In"}
                  >
                    <Link
                      className="Dashboard3one-parent-sub2-sub-content"
                      to="/add-payments-in"
                    >
                      Create Payment In
                    </Link>
                  </Tooltip>
                </div>
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
                        <h4 className="modal-title">
                          Quick Payment In Settings
                        </h4>
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
                              <p>Payment In Prefix & Sequence Number</p>
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
                                <p>Payment In Number:&nbsp;</p>
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
                              datasource={paymentDetails}
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

        <div className="modal custom-modal fade" id="stock_in" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Stock in</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="bg-white-smoke form-control"
                        placeholder="SEO Service"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group mb-0">
                      <label>Units</label>
                      <Select2
                        className="w-100"
                        data={units}
                        options={{
                          placeholder: "Pieces",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mb-0">
                      <label>Notes</label>
                      <textarea
                        rows={3}
                        cols={3}
                        className="form-control"
                        placeholder="Enter Notes"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                >
                  Add Quantity
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="modal custom-modal fade" id="stock_out" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Remove Stock</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="bg-white-smoke form-control"
                        placeholder="SEO Service"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={0}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group mb-0">
                      <label>Units</label>
                      <Select2
                        className="w-100"
                        data={units}
                        options={{
                          placeholder: "Pieces",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mb-0">
                      <label>Notes</label>
                      <textarea
                        rows={3}
                        cols={3}
                        className="form-control"
                        placeholder="Enter Notes"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                >
                  Remove Quantity
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal custom-modal fade"
          id="edit_inventory"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Edit Inventory</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Lorem ipsum dolor sit"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Code</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="P125389"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Units</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Box"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={3}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Sales Price</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="$155.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Purchase Price</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="$150.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>Status</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Stock in"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                >
                  Update
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal custom-modal fade"
          id="delete_stock"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Inventory</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <Link
                        to="#"
                        className="btn btn-primary paid-continue-btn"
                      >
                        Delete
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to="#"
                        data-bs-dismiss="modal"
                        className="btn btn-primary paid-cancel-btn"
                      >
                        Cancel
                      </Link>
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

export default PaymentIn;
