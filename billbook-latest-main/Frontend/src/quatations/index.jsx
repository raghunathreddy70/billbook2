import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import "../_components/antd.css";
import { Button, Table, Tooltip, Typography } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
// import InvoiceHead from "./invoiceHead";
import axios from "axios";
import { DatePicker } from "antd";
import useHandleDownload from "../Hooks/useHandleDownload";
const { RangePicker } = DatePicker;
const { Text } = Typography;
import { format } from "date-fns";
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
import { RiDownloadCloud2Line } from "react-icons/ri";
import { PiTelegramLogoBold } from "react-icons/pi";
import { FaEye, FaPlus } from "react-icons/fa6";

const Quotations = () => {
  const { SearchData } = useFiltersSales();
  const { handleDeleteQuotation } = useDeleteSales();
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();

  const [menu, setMenu] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [deletedQuotations, setDeletedQuotations] = useState([]);

  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [filteredDatasource, setFilteredDatasource] = useState([]);

  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Created On",
      value: "quotationDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Quotation ID",
      value: "quotationNumber",
    },
    {
      title: "Quotation To",
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
  const [selectedDateVar, setSelectedDateVar] = useState("quotationDate");
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

  const [quotationInvoiceid, setQuotationInvoiceid] = useState("");

  const handleselectedQuotationDelete = (value) => {
    setQuotationInvoiceid(value);
  };
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const userData = useSelector((state) => state?.user?.userData)

  useEffect(() => {
    fetchData(1);
  }, []);
  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/addQuotation/quotations/${userData?.data?._id}?page=${page}&pageSize=10`)
      setDatasource(response.data);
      setFilteredDatasource(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);


  const invoiceDetailsLink = (record) => {
    const { _id, quotationDate, quotationName, quotationNumber, customerName } =
      record;
    const customerPhone = customerName?.phone;
    const customerGSTNo = customerName?.GSTNo;
    const email = customerName?.email;
    const billingAddress = customerName?.billingAddress || {};
    const { addressLine1, addressLine2, country, state, city, pincode } =
      billingAddress;

    const link =
      `/quotation-details/${_id}?` +
      `date=${quotationDate}` +
      `&Name=${quotationName}` +
      `&Number=${quotationNumber}` +
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

  const [active, setActive] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    console.log("selectedRowKeys", selectedRowKeys);
    if (selectedRowKeys.length > 0) {
      setActive(true);
    } else {
      setActive(false);
    }
    let totalPaymentAmount = 0;
    let invoiceid = [];
    selectedRows.forEach((row) => {
      totalPaymentAmount += row.balance;
      invoiceid.push(row._id);
    });
    console.log(selectedRows, "selectedrows");
    if (totalPaymentAmount > 0) {
      // setValidation({
      //   ...validation,
      //   amount: true,
      // });
    }
    // setFormData({
    //   ...formData,
    //   amount: totalPaymentAmount,
    //   invoiceId: invoiceid,
    // });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: "checkbox",
  };
  const columns = [
    {
      title: "Quotation ID",
      dataIndex: "quotationNumber",

      render: (quotationNumber, record) => {
        return (
          <Link to={invoiceDetailsLink(record)}>
            <h2 className="table-avatar">{quotationNumber}</h2>
          </Link>
        );
      },
    },
    {
      title: "Quotation To",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <Link to={invoiceDetailsLink(record)}>
          {customerName?.name || "N/A"}
        </Link>
      ),
    },
    {
      title: "Created On",
      dataIndex: "quotationDate",
      render: (text, record) => {
        const formattedDate = new Date(record.quotationDate).toLocaleDateString(
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
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>
          <h2 className="table-avatar">{record.grandTotal}</h2>
        </Link>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>
          <h2 className="table-avatar">{record.balance}</h2>
        </Link>
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
        return (
          <Link to={invoiceDetailsLink(record)}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record,index) => (
        <>
          {/* <div className="d-flex align-items-center">
            <span className="d-flex">
              <Link to={`/quotation-details/${record._id}`}>
                <ViewButton />
              </Link>
            </span>


            {record.balance === 0 ? (
              <Tooltip title="This Invoice cannot be Edited" placement="top">
                <div className="btn-action-icon me-2">
                  <EditButton />
                </div>
              </Tooltip>
            ) : (
              <Link
                className="btn-action-icon me-2"
                to={`/edit-quotations/${record._id}`}
              >
                <EditButton />
              </Link>
            )}
            <Link
              className="btn-action-icon"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal_Comp"
              onClick={() => handleselectedQuotationDelete(record._id)}
            >
              <DeleteButton />
            </Link>
          </div> */}
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
              {record.balance === 0 ? (
                <div className="dropdown-item d-flex gap-1">
                  <img src="./newdashboard/editicon.png" alt="" />
                  <p>Edit</p>
                </div>

              ) : (
                <Link
                  to={`/edit-quotations/${record._id}`}
                  className="dropdown-item d-flex gap-1"
                >
                  <img src="./newdashboard/editicon.png" alt="" />
                  <p>Edit</p>
                </Link>
              )}
              <Link
                onClick={() => handleselectedQuotationDelete(record._id)}
                className="dropdown-item d-flex gap-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete_modal_Comp"
              >
                <img src="./newdashboard/deleteicon.svg" alt="" />
                <p>Delete</p>
              </Link>
              <Link
                className="dropdown-item d-flex gap-1"
                to={`/quotation-details/${record._id}`}
              >
                <FaEye />
                <p>View</p>
              </Link>
              <Link className="dropdown-item" to="#">
                <h5>Export to ..</h5>
              </Link>
              <div className="dropdown-item d-flex gap-1" onClick={() => handleDownloadPDF(record)}>
                <img src="./newdashboard/importfile.png" alt="" />
                <p>PDF</p>
              </div>
              {/* <Link className="dropdown-item d-flex gap-1" to="#">
              <img src="./newdashboard/importfile.png" alt="" />
              <p>CSV</p>
            </Link> */}
            </div>
          </div>
        </>
      ),
    },
  ];

  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Quotation ID": item?.quotationNumber,
      "Quotation To": item?.customerName?.name,
      "Created On":
        item?.quotationDate &&
        format(new Date(item?.quotationDate), "MM/dd/yyyy"), // Format quotationDate
      "Due Date":
        item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"), // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Quotation ID", key: "quotationNumber" },
      { label: "Quotaion To", key: "customerName" },
      { label: "Created On", key: "quotationDate" },
      { label: "Due Date", key: "dueDate" },
      { label: "Total", key: "grandTotal" },
      { label: "Balance", key: "balance" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "Quotation ID",
      "Quotation To",
      "Created On",
      "Due Date",
      "Total",
      "Balance",
    ];

    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.quotationNumber,
      item?.customerName?.name,
      item?.quotationDate &&
      format(new Date(item?.quotationDate), "MM/dd/yyyy"), // Format creditnotesDate
      item?.dueDate && format(new Date(item?.dueDate), "MM/dd/yyyy"), // Format dueDate
      item?.grandTotal,
      item?.balance,
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Quotations" });
  };

  // download data in pdf format code goes here


  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header 700:mb-3 300:mb-2">
              <div className="content-page-header 300:mb-0">
                <h5>Quotations</h5>
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
                  <Tooltip placement="topLeft" title={"Create Quotations"}>
                    <Link className="Dashboard3one-parent-sub2-sub-content" to="/add-quotations">
                    <FaPlus/>
                      Create Quotation
                      {/* <i className="fa fa-plus-circle" aria-hidden="true" /> */}
                    </Link>
                  </Tooltip>
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
                            pageSize: 10,
                            total: totalPages,
                            onChange: (page) => {
                              fetchData(page);
                            },
                            // total: SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent }).length,
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
                          rowSelection={rowSelection}
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

        <DeleteModal
          deleteFunction={() =>
            handleDeleteQuotation({
              quotationInvoiceid: quotationInvoiceid,
              setDatasource: setDatasource,
              setFilteredDatasource: setFilteredDatasource,
            })
          }
          title={"Delete Quotation"}
        />
      </div>
    </>
  );
};

export default Quotations;
