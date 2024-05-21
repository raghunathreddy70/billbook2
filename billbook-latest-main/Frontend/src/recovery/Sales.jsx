import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import "../_components/antd.css";
import { Button, Table, Typography } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import axios from "axios";
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const { Text } = Typography;
import { format } from 'date-fns';
import useHandleDownload from "../Hooks/useHandleDownload";
import { useSelector } from "react-redux";

const RevevoredSales = () => {
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [menu, setMenu] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [deletedInvoices, setDeletedInvoices] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);

  const handleSearch = (value) => {
    setSearchText(value);
  };
  const handleReset = () => {
    setSearchText("");
  };
  const [showContent, setShowContent] = useState(false);
  const [vendorInvoiceDetails, setVendorInvoiceDetails] = useState([]);
  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);

  useEffect(() => {
    if (toggleTabsState !== 1 && toggleTabsState !== 2 && toggleTabsState !== 3) {
      setToggleTabsState(0)
    }
  }, [toggleTabsState])

  // useEffect(() => {
  //   let downloadableData = deletedInvoices;
  //   setDownloadData(downloadableData)
  // }, [deletedInvoices])

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/addInvoice/invoices/delete/${invoiceId}`
      );
      if (response.status === 200) {
        // const deletedInvoice = datasource.find(
        //   (item) => item._id === invoiceId
        // );
        // setDeletedInvoices((prevDeletedInvoices) => [
        //   ...prevDeletedInvoices,
        //   deletedInvoice,
        // ]);
        // setDatasource((prevData) =>
        //   prevData.filter((item) => item._id !== invoiceId)
        // );
      } else {
        console.error("Failed to delete invoice:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };


  const handleRestoreSales = async (invoiceId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/addInvoice/salesRestore/${invoiceId}`
      );

      if (response.status === 200) {
        toast.success("sales Invoice Restored Successfully")
      } else {
        console.error("Failed to restore sales:", response.statusText);
        toast.error("Error Restoring sales Invoice")
      }
    } catch (error) {
      console.error("Error deleting sales:", error);
    }
  };

  const confirmRestoreSales = (invoiceId) => {
    if (window.confirm("Are you sure you want to restore this purchase?")) {
      handleRestoreSales(invoiceId);
    }
  };

  // filter function with customer name 
  const handleCustomerNameFilterChange = (e) => {
    const value = e.target.value;
    setCustomerNameFilter(value);

    if (value.trim() === '') {
      // If the customer name filter is empty, reset to full data
      setFilteredDatasource(vendorInvoiceDetails);
    } else {
      // Filter data based on the entered customer name
      const filteredData = filterData(datasource, dateRange, value, customerNameFilter);
      setFilteredDatasource(filteredData);
    }
  };

  // Function to filter data based on date range and customer name
  const filterData = (data, dateRange, customerNameFilter) => {
    return data.filter((record) => {
      const invoiceDate = new Date(record?.invoiceDate);
      const dateInRange =
        (!dateRange[0] || invoiceDate >= dateRange[0]) &&
        (!dateRange[1] || invoiceDate <= dateRange[1]);

      const customerNameMatch =
        typeof record?.name?.name === 'string' &&
        record?.name?.name.toLowerCase().includes(customerNameFilter.toLowerCase());
      console.log("name", record?.name?.name)
      return dateInRange && customerNameMatch;
    });
  };
  // filter function with customer name 

  const reversedDataSource = filteredDatasource ? [...filteredDatasource].reverse() : [];


  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      const filteredData = datasource.filter((record) => {
        const invoiceDate = new Date(record.invoiceDate);
        return invoiceDate >= dates[0] && invoiceDate <= dates[1];
      });
      setFilteredDatasource(filteredData);
    } else {
      // Handle case where dates is null or has invalid length
      // For example, you can reset the filteredDatasource to the full datasource
      setFilteredDatasource(datasource);
    }
  };
  useEffect(() => {
    let downloadableData = filteredDatasource ? [...filteredDatasource].reverse() : [];
    setDownloadData(downloadableData)
  }, [filteredDatasource])

  const confirmDeleteInvoice = (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      handleDeleteInvoice(invoiceId);
    }
  };
  const userData = useSelector((state) => state?.user?.userData)
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchDeletedInvoices(1);
  }, []);
    const fetchDeletedInvoices = async (page) => {
      try {
        setLoading(true)
        const response = await axios.get(
          `http://localhost:8000/api/addInvoice/newDeletedInvoice/invoices/${userData?.data?._id}?page=${page}&pageSize=10`
        );
        setVendorInvoiceDetails(response.data);
        setFilteredDatasource(response.data);
        setDatasource(response.data);
        setLoading(false);
      setTotalPages(response.data?.length)
      } catch (error) {
        console.error("Error fetching deleted invoices:", error);
      }finally{
        setLoading(false)
      }
    };

  useEffect(() => {
    fetchDeletedInvoices();
  }, [userData]);


  // Functions for the download excel
  const handleDownloadFilteredData = () => {
    const filteredDataWorkbook = XLSX.utils.book_new();
    const filteredDataWorksheet = XLSX.utils.json_to_sheet(filteredDatasource);
    XLSX.utils.book_append_sheet(filteredDataWorkbook, filteredDataWorksheet, 'FilteredData');
    XLSX.writeFile(filteredDataWorkbook, 'filtered_data.xlsx');
  };

  const handleDownloadAllData = () => {
    const allDataWorkbook = XLSX.utils.book_new();
    const allDataWorksheet = XLSX.utils.json_to_sheet(datasource);
    XLSX.utils.book_append_sheet(allDataWorkbook, allDataWorksheet, 'AllData');
    XLSX.writeFile(allDataWorkbook, 'all_data.xlsx');
  };
  // Functions for the download excel

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return '#33B469';
      case 'UNPAID':
        return '#ed2020';
      case 'PARTIALLY PAID':
        return '#f9dc0b';
      default:
        return 'white'; // Default background color
    }
  };
  const deletedInvoicesColumns = [
    {
      title: "Invoice ID",
      dataIndex: "invoiceNumber",
      sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
      render: (text, record) => <Link to={`/invoice-details/${record?._id}`}>{text}</Link>,
    },
    {
      title: "Invoice To",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <h2 className="table-avatar">
          {/* <Link to="#" className="avatar avatar-sm me-2">
            {customerName && customerName.image && (
              <img
                className="avatar-img rounded-circle"
                src={`${customerName.image.url}`}
                alt="User"
              />
            )}
          </Link> */}
          <ul>
            <li>
              <Link to={`/invoice-details/${record?._id}`}>
                {customerName ? customerName?.name : ""}
              </Link>
            </li>
          </ul>
        </h2>
      ),
      sorter: (a, b) => a.customerName.length - b.customerName.length,
    },
    {
      title: "Created On",
      dataIndex: "invoiceDate",
      sorter: (a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate),
      render: (text, record) => {
        const formattedDate = new Date(record?.invoiceDate).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <Link to={`/invoice-details/${record?._id}`}>{formattedDate}</Link>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: ["grandTotal"],
      sorter: (a, b) => a.grandTotal - b.grandTotal,
      render: (text, record) => <Link to={`/invoice-details/${record?._id}`}>{text}</Link>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => a.balance.length - b.balance.length,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (text, record) => {
        const formattedDate = new Date(record?.dueDate).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <Link to={`/invoice-details/${record?._id}`}>{formattedDate}</Link>;
      },
    },
    {
      title: "Status",
      dataIndex: "payments",
      render: (payments, record) => {

        if (payments.length > 0) {

          const lastPayment = payments[payments.length - 1];
          const purchasesDate = new Date(record?.purchasesDate);
          const dueDate = new Date(record?.dueDate);


          if (lastPayment.balance === 0) {
            return <span className={`badge bg-success-light`}>Paid</span>;
          } else if (purchasesDate > dueDate) {

            const overdueDays = Math.floor(
              (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
            );
            return (
              <span className={`badge bg-danger-light`}>
                Overdue by {overdueDays} days
              </span>
            );
          } else {

            return (
              <span className={`badge bg-warning-light text-warning`}>Partially Paid</span>
            );
          }
        } else {

          return <span className={`badge bg-success-light`}>Unpaid</span>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <Link
                  className="dropdown-item"
                  to={`/edit-invoice/${record?._id}`}
                >
                  <i className="far fa-edit me-2" />
                  Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to={`/invoice-details/${record?._id}`}
                >
                  <i className="far fa-eye me-2" />
                  View
                </Link>
                <button
                  className="dropdown-item"
                  onClick={() => confirmDeleteInvoice(record?._id)}
                >
                  <i className="far fa-trash-alt me-2" />
                  Delete
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => confirmRestoreSales(record?._id)}
                >
                  <i className="far fa-trash-alt me-2" />
                  Restore
                </button>
              </div>
            </div>
          </div>
        </>
      ),
      sorter: (a, b) => a.action.length - b.action.length,
    },
  ];


  // download data in csv format code goes here 
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map(item => ({
      "Invoice Number": item?.invoiceNumber,
      "Name": item?.Name?.name,
      "Invoice Date": item?.invoiceDate && format(new Date(item?.invoiceDate), 'MM/dd/yyyy'), // Format invoiceDate
      "Due Date": item?.dueDate && format(new Date(item?.dueDate), 'MM/dd/yyyy'), // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      "Status ": item?.invoiceStatus,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: 'Invoice Number', key: 'invoiceNumber' },
      { label: 'Name', key: 'customerName' },
      { label: 'Invoice Date', key: 'invoiceDate' },
      { label: 'Due Date', key: 'dueDate' },
      { label: 'Total', key: 'grandTotal' },
      { label: 'Balance', key: 'balance' },
      { label: 'Status', key: 'invoiceStatus' },
    ];
    // Add more he

    handleCSVDownload({ csvData, headers })
  };
  // download data in csv format code goes here 



  // download data in pdf format code goes here 

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ['Invoice Number', 'Name', 'Invoice Date', 'Due Date', 'Total', 'Balance', 'Status'];
    // Set up table rows
    const rows = downloadData.map(item => [
      item?.invoiceNumber,
      item?.Name?.name,
      item?.invoiceDate && format(new Date(item?.invoiceDate), 'MM/dd/yyyy'), // Format invoiceDate
      item?.dueDate && format(new Date(item?.dueDate), 'MM/dd/yyyy'), // Format dueDate
      item?.grandTotal,
      item?.balance,
      item?.invoiceStatus
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Deleted Sales Invoices" })
  };

  // download data in pdf format code goes here 


  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* <InvoiceHead setShow={setShow} show={show} showContent={showContent} toggleContent={toggleContent} /> */}
            {/* Deleted Invoices Table */}
            <div className="row ">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body invoiceList">
                    <div className="page-header m-0">
                      <div className="content-page-header">
                        <h3 className="text-[20px] font-semibold">Deleted Invoices</h3>
                        <div className="list-btn">
                          <ul className="filter-list">
                            <li className="">
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="btn-filters me-2"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span>
                                    <FeatherIcon icon="download" />
                                  </span>
                                </Link>
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
                              <button className="btn btn-primary me-2" onClick={toggleContent}>
                                {showContent ? <FeatherIcon icon="filter" /> : <FeatherIcon icon="filter" />}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive table-hover">
                      <div className="table-filter">
                        {showContent && (
                          <div className="col-md-12 my-2">
                            <div className="row align-items-center">
                              <div className="col-md-3 col-sm-6 mt-1">
                                <RangePicker onChange={handleDateRangeChange} />
                              </div>
                              <div className="col-md-3 col-sm-6 mt-1">
                                <input
                                className="EnterCustomerName-input"
                                  type="text"
                                  placeholder="Enter Customer Name"
                                  value={customerNameFilter}
                                  onChange={handleCustomerNameFilterChange}
                                />
                              </div>
                              <div className="col-md-6">
                                {dateRange?.length > 0 && (
                                  <>
                                    <Text>
                                      Total Invoices For the selected filter: {filteredDatasource.length}
                                    </Text>
                                    <Button onClick={handleDownloadFilteredData} style={{ marginLeft: 10 }} className="my-2 btn btn-primary">
                                      Download Filtered Data
                                    </Button>
                                    <Button onClick={toggleContent} classNames="ResetButton" style={{ marginLeft: 10, background: "rgb(237, 32, 32)" }} className="my-2" >
                                      {showContent ? 'Reset' : 'Filters'}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <Table
                        pagination={{
                          pageSize:10,
                          total:totalPages,
                          onChange:(page)=>{
                            fetchDeletedInvoices(page)
                          },
                          // total: reversedDataSource ? reversedDataSource.length : 0,
                          // showTotal: (total, range) =>
                          //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          // showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        loading={loading}
                        rowKey={(record) => record.id}
                        columns={deletedInvoicesColumns}
                        dataSource={reversedDataSource}
                        expandedRowKeys={[]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Deleted Invoices Table */}
          </div>
        </div>

        <AddVendor setShow={setShow} show={show} />

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
                        className="w-100 btn btn-primary paid-cancel-btn"
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

export default RevevoredSales;
