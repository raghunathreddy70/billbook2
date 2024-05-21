import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";

import "../_components/antd.css";
import * as XLSX from 'xlsx';

import {  Table, Typography, Button, DatePicker } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import { toast } from "react-toastify";
import useHandleDownload from "../Hooks/useHandleDownload";
import { format } from 'date-fns';
const { RangePicker } = DatePicker;
const { Text } = Typography;
const PurchaseRecovery = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [datasource, setDatasource] = useState([]);

  const [deletedPurchase, setDeletedPurchase] = useState([]);

  const [toggleTabsState, setToggleTabsState] = useState(0);

  const [showContent, setShowContent] = useState(false)
  const [dateRange, setDateRange] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [customerNameFilter, setCustomerNameFilter] = useState(""); 
  const [downloadData, setDownloadData] = useState([]);
  const [vendorInvoiceDetails, setVendorInvoiceDetails] = useState([]);

  const toggleContent = () => {
    setShowContent(!showContent)
  }
  useEffect(() => {
    if (toggleTabsState !== 1 && toggleTabsState !== 2 && toggleTabsState !== 3) {
      setToggleTabsState(0)
    }
  }, [toggleTabsState])



  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const [menu, setMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };



  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
      const purchasesDate = new Date(record.purchasesDate);
      const dateInRange =
        (!dateRange[0] || purchasesDate >= dateRange[0]) &&
        (!dateRange[1] || purchasesDate <= dateRange[1]);

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
        const purchasesDate = new Date(record.purchasesDate);
        return purchasesDate >= dates[0] && purchasesDate <= dates[1];
      });
      setFilteredDatasource(filteredData);
    } else {
      // Handle case where dates is null or has invalid length
      // For example, you can reset the filteredDatasource to the full datasource
      setFilteredDatasource(datasource);
    }
  };



  const handleDeletePurchase = async (purchasesId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/addPurchases/purchases/delete/${purchasesId}`
      );

      if (response.status === 200) {
        const deletedPurchase = datasource.find(
          (item) => item._id === purchasesId
        );
        setDeletedPurchase((prevDeletedPurchase) => [
          ...prevDeletedPurchase,
          deletedPurchase,
        ]);
        setDatasource((prevData) =>
          prevData.filter((item) => item._id !== purchasesId)
        );
      } else {
        console.error("Failed to delete purchase:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const confirmDeletePurchase = (purchasesId) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      handleDeletePurchase(purchasesId);
    }
  };


  const handleRestorePurchase = async (purchasesId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/addPurchases/Restore/${purchasesId}`
      );

      if (response.status === 200) {
        toast.success("purchase Invoice Restored Successfully")
      } else {
        console.error("Failed to restore purchase:", response.statusText);
        toast.error("Error Restoring purchase Invoice")
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const confirmRestorePurchase = (purchasesId) => {
    if (window.confirm("Are you sure you want to restore this purchase?")) {
      handleRestorePurchase(purchasesId);
    }
  };

  useEffect(() => {
    const fetchDeletedPurchases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addPurchases/newDeletedPurchase/purchase"
        );
        setVendorInvoiceDetails(response.data);
        setFilteredDatasource(response.data);
        setDatasource(response.data);
        console.log("Deleted Purchases:", response.data);
      } catch (error) {
        console.error("Error fetching deleted purchase:", error);
      }
    };

    fetchDeletedPurchases();
  }, []);
  // filter function with customer name 
  useEffect(() => {
    let downloadableData = filteredDatasource ? [...filteredDatasource].reverse() : [];
    setDownloadData(downloadableData)
  }, [filteredDatasource])

  // filter function with customer name 
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

  const deletedPurchasesColumns = [
    {
      title: "Purchase ID",
      dataIndex: "purchaseNumber",
      sorter: (a, b) => a.purchaseNumber.length - b.purchaseNumber.length,
      render: (text, record) => <Link to={`/purchases-details/${record._id}`}>{text}</Link>,
    },
    // {
    //   title: "Purchase To",
    //   dataIndex: "name",
    //   render: (name, record) => (
    //     <h2 className="table-avatar">
    //       {/* <Link to="#" className="avatar avatar-sm me-2">
    //         {name && name.image && (
    //           <img
    //             className="avatar-img rounded-circle"
    //             src={`${name.image.url}`}
    //             alt="User"
    //           />
    //         )}
    //       </Link> */}
    //       <ul>
    //         <li>
    //           <Link to={`/purchases-details/${record._id}`}>
    //             {name}
    //           </Link>
    //         </li>
    //       </ul>
    //     </h2>
    //   ),
    //   sorter: (a, b) => a.name.length - b.name.length,
    // },
    {
      title: "Purchase To",
      dataIndex: "name",
      render: (name, record) => (
        <h2 className="table-avatar">
         
          <ul>
            <li>
              <Link to={`/purchases-details/${record._id}`}>
                {name && name.name} 
              </Link>
            </li>
          </ul>
        </h2>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    
    {
      title: "Created On",
      dataIndex: "purchasesDate",
      sorter: (a, b) => a.purchasesDate.length - b.purchasesDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.purchasesDate).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <Link to={`/purchases-details/${record._id}`}>{formattedDate}</Link>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: ["grandTotal"],
      sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
      render: (text, record) => <Link to={`/purchases-details/${record._id}`}>{text}</Link>,
    },
    {
      title: "Balance",
      dataIndex: "payments",
      render: (payments, record) => {
        if (payments.length > 0) {
          const lastPayment = payments[payments.length - 1];
          const lastPaymentBalance = lastPayment ? lastPayment.balance : 0;
          return <Link to={`/purchases-details/${record._id}`}>{lastPaymentBalance}</Link>;
        } else {
          return <Link to={`/purchases-details/${record._id}`}>{record.grandTotal}</Link>;
        }
      },
      sorter: (a, b) => {
        const lastBalanceA =
          a.payments.length > 0 ? a.payments[a.payments.length - 1].balance : 0;
        const lastBalanceB =
          b.payments.length > 0 ? b.payments[b.payments.length - 1].balance : 0;
        return lastBalanceA - lastBalanceB;
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => a.dueDate.length - b.dueDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.dueDate).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <Link to={`/purchases-details/${record._id}`}>{formattedDate}</Link>;
      },
    },
    {
      title: "Status",
      dataIndex: "payments",
      render: (payments, record) => {
        if (payments.length > 0) {
          const lastPayment = payments[payments.length - 1];
          const purchasesDate = new Date(record.purchasesDate);
          const dueDate = new Date(record.dueDate);
          if (lastPayment.balance === 0) {
            return <span className={`badge bg-success-light`}>Paid</span>;
          } else if (purchasesDate > dueDate) {
            const overdueDays = Math.floor((purchasesDate - dueDate) / (1000 * 60 * 60 * 24));
            return (
              <span className={`badge bg-danger-light`}>Overdue by {overdueDays} days</span>
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
                <Link className="dropdown-item" to={`/edit-purchases/${record._id}`}>
                  <i className="far fa-edit me-2" />
                  Edit
                </Link>
                {/* <Link className="dropdown-item" to={`/purchases-details/${record._id}`}>
                  <i className="far fa-eye me-2" />
                  View
                </Link> */}
                <button
                  className="dropdown-item"
                  onClick={() => confirmDeletePurchase(record._id)}
                >
                  <i className="far fa-trash-alt me-2" />
                  Delete
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => confirmRestorePurchase(record._id)}
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


  const getStatus = (payments, record) => {
    if (payments.length > 0) {

      const lastPayment = payments[payments.length - 1];
      const purchasesDate = new Date(record.purchasesDate);
      const dueDate = new Date(record.dueDate);


      if (lastPayment.balance === 0) {
        return "Paid";
      } else if (purchasesDate > dueDate) {

        const overdueDays = Math.floor(
          (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
        );
        return `Overdue by ${overdueDays} days`;
      } else {

        return "Partially Paid";
      }
    } else {
      return "Unpaid";
    }
  }

  const getBalance = (payments, record) => {
    if (payments.length > 0) {
      const lastPayment = payments[payments.length - 1];
      const lastPaymentBalance = lastPayment ? lastPayment.balance : 0;
      return lastPaymentBalance;
    } else {
      return record?.grandTotal;
    }
  }

  // download data in csv format code goes here 
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map(item => ({
      "Purchase ID": item?.purchaseNumber,
      "Purchase To": item?.name?.name,
      "Purchases Date": item?.purchasesDate && format(new Date(item?.purchasesDate), 'MM/dd/yyyy'), // Format invoiceDate
      "Due Date": item?.dueDate && format(new Date(item?.dueDate), 'MM/dd/yyyy'), // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": getBalance(item?.payments, item),
      "Status ": getStatus(item?.payments, item),
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: 'Purchase ID', key: 'purchaseNumber' },
      { label: 'Purchase To', key: 'name?.name' },
      { label: 'Purchases Date', key: 'purchasesDate' },
      { label: 'Due Date', key: 'dueDate' },
      { label: 'Total', key: 'grandTotal' },
      { label: 'Balance', key: 'balance' },
      { label: 'Status', key: 'purchaseStatus' },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers })
  };
  // download data in csv format code goes here 



  // download data in pdf format code goes here 

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ['Purchase ID', 'Purchase To', 'Purchases Date', 'Due Date', 'Total', 'Balance', 'Status'];
    // Set up table rows
    const rows = downloadData.map(item => [
      item.purchaseNumber,
      item?.name?.name,
      format(new Date(item.purchasesDate), 'MM/dd/yyyy'), // Format invoiceDate
      format(new Date(item.dueDate), 'MM/dd/yyyy'), // Format dueDate
      item.grandTotal,
      getBalance(item?.payments, item),
      getStatus(item?.payments, item)
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Deleted Purchases" })
  };

  // download data in pdf format code goes here 

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        {/* <InventorySideBar /> */}
        <Sidebar active={20} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Deleted Invoices Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body invoiceList">
                    <div className="page-header m-0">
                      <div className="content-page-header purchase-recovery-component">
                        <h3 className="text-[20px] font-semibold">Deleted Purchases</h3>
                        <div className="list-btn">
                          <ul className="filter-list p-0">
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
                      {/* <Table
                        pagination={false}
                        columns={columns}
                        dataSource={deletedInvoices}
                        rowKey={(record) => record.id}
                      /> */}
                      <Table
                        pagination={{
                          total: reversedDataSource ? reversedDataSource.length : 0,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        rowKey={(record) => record.id}
                        columns={deletedPurchasesColumns}
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
      </div>
    </>
  );
};

export default PurchaseRecovery;
