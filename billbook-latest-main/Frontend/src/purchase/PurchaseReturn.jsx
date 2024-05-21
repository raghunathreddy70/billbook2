import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import "../_components/antd.css";
import { Table, Tooltip, Typography } from "antd";
// import Data from "../assets/jsons/purchase";
import FeatherIcon from "feather-icons-react";
import { itemRender } from "../_components/paginationfunction";
import axios from "axios";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
const { Text } = Typography;
import "jspdf-autotable";
import { format } from "date-fns";
import useHandleDownload from "../Hooks/useHandleDownload";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import DeleteModal from "../invoices/Modals/DeleteModal";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";

const PurchaseReturn = () => {
  const { SearchData } = useFiltersSales();
  const { handleDeletePurchaseReturn } = useDeleteSales();
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [menu, setMenu] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [datasource, setDatasource] = useState([]);

  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);

  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Debit Notes Date",
      value: "purchaseReturnDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Purchase Return Number",
      value: "purchaseReturnNumber",
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
  const [selectedDateVar, setSelectedDateVar] = useState("purchaseReturnDate");
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

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/purchaseReturn/Purchasereturn")
      .then((response) => {
        setDatasource(response.data);
        setFilteredDatasource(response.data);
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "#33B469";
      case "UNPAID":
        return "#ed2020";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white"; // Default background color
    }
  };

  const [purchaseReturnid, setPurchaseReturnid] = useState("");

  const handleselectedPurchaseReturnidDelete = (value) => {
    setPurchaseReturnid(value);
  };

  const invoiceDetailsLink = (record) => {
    const {
      _id,
      purchaseReturnDate,
      purchaseReturnName,
      purchaseReturnNumber,
      name,
    } = record;
    const customerPhone = name?.phoneNumber;
    const customerGSTNo = name?.GSTNo;
    const email = name?.email;
    const addressLine1 = name?.addressLine1;
    const addressLine2 = name?.addressLine2;

    const link =
      `/purchase-return-view/${_id}?` +
      `date=${purchaseReturnDate}` +
      `&Name=${purchaseReturnName}` +
      `&Number=${purchaseReturnNumber}` +
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
      title: "Purchase Return Number",
      dataIndex: "purchaseReturnNumber",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>{text}</Link>
      ),
    },
    {
      title: "Purchase Order To",
      dataIndex: "name",
      render: (name, record) => (
        <Link to={invoiceDetailsLink(record)}>{name?.name || "N/A"}</Link>
      ),
    },
    {
      title: "Debit Notes Date",
      dataIndex: "purchaseReturnDate",
      render: (text, record) => {
        const formattedDate = new Date(
          record.purchaseReturnDate
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
      title: "Status",
      dataIndex: "purchaseStatus",
      render: (text, record) => (
        <Link
          to={invoiceDetailsLink(record)}
          style={{
            backgroundColor: getStatusColor(text),
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              className="btn-action-icon me-2"
              to={`/edit-purchase-return/${record._id}`}
            >
              <EditButton/>
            </Link>
            <Link
              className="btn-action-icon"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal_Comp"
              onClick={() => handleselectedPurchaseReturnidDelete(record._id)}
            >
              <DeleteButton/>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Purchase Return Number": item?.purchaseReturnNumber,
      "Purchase Order To": item?.name?.name,
      "Debit Notes Date": item?.purchaseReturnDate, // Format purchaseReturnDate
      "Due Date": item?.dueDate, // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      "Status ": item?.purchaseStatus,
    }));

    // Define CSV headers
    const headers = [
      { label: "Purchase Return Number", key: "purchaseReturnNumber" },
      { label: "Purchase Order To", key: "name" },
      { label: "Debit Notes Date", key: "purchaseReturnDate" },
      { label: "Due Date", key: "dueDate" },
      { label: "Total", key: "grandTotal" },
      { label: "Balance", key: "balance" },
      { label: "Status", key: "purchaseStatus" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "Purchase Return Number",
      "Purchase Order To",
      "Debit Notes Date",
      "Due Date",
      "Total",
      "Balance",
      "Status",
    ];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.purchaseReturnNumber,
      item?.name?.name,
      item?.purchaseReturnDate &&
        format(new Date(item?.purchaseReturnDate), "MM/dd/yyyy"), // Format invoiceDate
      item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"), // Format dueDate
      item?.grandTotal,
      item?.balance,
      item?.invoiceStatus,
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Purchase Return" });
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={14} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header 700:mb-3 300:mb-2">
              <div className="content-page-header 300:mb-0">
                <h5>Purchase Return</h5>
                <div className="list-btn">
                  <ul className="filter-list">
                    <li>
                      <Tooltip placement="topLeft" title={"Filter Data"}>
                        <button
                          className="btn btn-primary"
                          onClick={toggleContent}
                        >
                          <FilterInvoiceButton/>
                        </button>
                      </Tooltip>
                    </li>
                    <li className="ms-2">
                      <div className="dropdown dropdown-action ">
                        <Tooltip placement="topLeft" title={"Download Data"}>
                          <Link
                            to="#"
                            className="btn-filters me-2 btn btn-primary"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <DownloadInvoiceButton/>
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
                      </div>
                    </li>
                    <li>
                      <Tooltip
                        placement="topLeft"
                        title={"Create Purchase Return"}
                      >
                        <Link
                          className="btn btn-primary w-auto popup-toggle 700:me-2 300:me-0"
                          to="/create-purchase-return"
                        >
                          Create Purchase Return
                          {/* <i className="fa fa-plus-circle" aria-hidden="true" /> */}
                        </Link>
                      </Tooltip>
                    </li>
                  </ul>
                </div>
              </div>
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
                            total: SearchData({
                              data: reversedDataSource,
                              selectedVar: selectedSearchVar,
                              searchValue: searchContent,
                            }).length,
                            showTotal: (total, range) =>
                              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
                            itemRender: itemRender,
                          }}
                          columns={columns}
                          dataSource={SearchData({
                            data: reversedDataSource,
                            selectedVar: selectedSearchVar,
                            searchValue: searchContent,
                          })}
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

        <DeleteModal
          deleteFunction={() =>
            handleDeletePurchaseReturn({
              purchaseReturnId: purchaseReturnid,
              setDatasource: setDatasource,
              setFilteredDatasource: setFilteredDatasource,
            })
          }
          title={"Delete Purchase Return"}
        />
      </div>
    </>
  );
};

export default PurchaseReturn;
