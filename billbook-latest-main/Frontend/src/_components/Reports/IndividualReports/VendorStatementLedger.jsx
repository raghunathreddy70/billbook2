import React, { useState, useEffect } from "react";
import FilterBar from "../Components/FilterBar";
import DateRangeFilter from "../Components/DateRangeFilter";
import AntTable from "../Components/AntTable";
import { PartyStatementLedgerData } from "../Data/PartyStatementLedgerData";
import FeatherIcon from "feather-icons-react";
import useReportFilters from "../hooks/useReportsFilters";
import axios from "axios";
import { Link } from "react-router-dom";
import useHandleDownload from "../../../Hooks/useHandleDownload";
import SalesFilters from "../../../invoices/filters/SalesFilters";
import useFiltersSales from "../../../invoices/customeHooks/useFiltersSales";
import BackButton from "../../../invoices/Cards/BackButton";
import Select2 from "react-select2-wrapper";
import { backendUrl } from "../../../backendUrl";

const VendorStatementLedger = () => {
  const [searchText, setSearchText] = useState("");
  const { SearchData } = useFiltersSales();
  const [filteredDataState, setFilteredDataState] = useState(false);
  const [downloadData, setDownloadData] = useState([]);
  const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [showTotalSales, setShowTotalSales] = useState(false);
  const [selectedSearchVar, setSelectedSearchVar] =
    useState("customerName?.name");
  const [searchContent, setSearchContent] = useState(null);
  const dateSelectDrop = [
    {
      title: "Invoice Date",
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
  function DataSourceFilter({ data }) {
    return PartyStatementLedgerData.filter((record) =>
      record.transactionType.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  const item1 = [
    {
      label: "Cash Sale",
      key: 1,
    },
  ];

  const [customers, setCustomers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/addVendor/vendors`
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log("customers", customers);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  console.log("selectedCustomer", selectedCustomer);



  useEffect(() => {
    const fetchProductReportDetails = async (selectedCustomer) => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addPurchases/venledgers/${selectedCustomer}`
        );
        setDatasource(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (selectedCustomer) {
      fetchProductReportDetails(selectedCustomer);
    }
  }, [selectedCustomer]);

  const handleCustomerChange = (vendorId) => {
    setSelectedCustomer(vendorId);
  };

  const customerOptions = customers.map((cus) => ({
    id: cus.vendorId,
    text: cus.name,
  }));

  console.log("customerproductDetails s", datasource);

  const columns = [
    {
      title: "Date",
      dataIndex: "purchasesDate",
      sorter: (a, b) => a.purchasesDate.length - b.purchasesDate.length,
    },
    {
      title: "Transaction Type",
      dataIndex: "purchaseName",
      sorter: (a, b) => a.purchaseName.length - b.purchaseName.length,
    },
    {
      title: "Transaction No.",
      dataIndex: "purchaseNumber",
      sorter: (a, b) => a.purchaseNumber.length - b.purchaseNumber.length,
    },
    // {
    //   title: "Original Invoice No.",
    //   dataIndex: "purchaseNumber",
    //   sorter: (a, b) => a.purchaseNumber.length - b.purchaseNumber.length,
    // },
    {
      title: "Credit",
      dataIndex: "credit",
      sorter: (a, b) => a.credit.length - b.credit.length,
    },
    {
      title: "Debit",
      dataIndex: "debit",
      sorter: (a, b) => a.debit.length - b.debit.length,
    },
    {
      title: "TDS By Party",
      dataIndex: "tdsParty",
      sorter: (a, b) => a.tdsParty.length - b.tdsParty.length,
    },
    {
      title: "TDS By Self",
      dataIndex: "tdsSelf",
      sorter: (a, b) => a.tdsSelf.length - b.tdsSelf.length,
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      sorter: (a, b) => a.paymentMode.length - b.paymentMode.length,
    },
  ];

  const filterItemFun = (e) => {
    if (e.key === "1") {
      setShowTotalSales(true);
    } else {
      setShowTotalSales(false);
    }
  };

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
  }, [isFiltered, filteredDatasource, searchContent, datasource]);

  const { handlePDFDownload, handleCSVDownload } = useHandleDownload();

  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Invoice Number": item?.invoiceNumber,
      Name: item?.customerName?.name,
      "Invoice Date": item?.invoiceDate, // Format invoiceDate
      "Due Date": item?.dueDate, // Format dueDate
      "Total ": item?.grandTotal,
      "Balance ": item?.balance,
      "Status ": item?.invoiceStatus,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Invoice Number", key: "invoiceNumber" },
      { label: "Name", key: "customerName" },
      { label: "Invoice Date", key: "invoiceDate" },
      { label: "Due Date", key: "dueDate" },
      { label: "Total", key: "grandTotal" },
      { label: "Balance", key: "balance" },
      { label: "Status", key: "invoiceStatus" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here
  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "Invoice Number",
      "Name",
      "Invoice Date",
      "Due Date",
      "Total",
      "Balance",
      "Status",
    ];

    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.invoiceNumber,
      item?.customerName?.name,
      item?.invoiceDate, // Format invoiceDate
      item?.dueDate, // Format dueDate
      item?.grandTotal,
      item?.balance,
      item?.invoiceStatus,
      // Add more fields as needed
    ]);
    let heading =
      toggleTabsState === 0
        ? "Item Batch Report"
        : toggleTabsState === 1
        ? "Paid Credit Notes"
        : toggleTabsState === 2
        ? "Overdue Credit Notes"
        : "Outstanding Credit Notes";
    handlePDFDownload({ columns, rows, heading });
  };

  // download data in pdf format code goes here
  return (
    <div className="page-wrapper customers">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <div className="d-flex align-items-start">
              <BackButton />
              <h5 className="reports-h5">Vendor Statement (Ledger)</h5>
            </div>
            <div className="reports-filter-parent">
              {/* <AntButton type={"box"} text={"Hide out of stock batches"} hideOutFilter={hideOutFilter} setHideOutFilter={setHideOutFilter} /> */}
              {/* <DatePickerReport handleDateChange={handleDateChange} /> */}
              <div className="list-btn">
                <ul className="filter-list flex space-x-0">
                  <li>
                    <button
                      className="btn btn-primary 700:me-2 300:me-0"
                      onClick={toggleContent}
                    >
                      <span className="me-2 flex-a">
                        <FeatherIcon icon="filter" />
                        {showContent ? "Hide" : "Filters"}
                      </span>
                    </button>
                  </li>
                  <li className="">
                    <div className="dropdown dropdown-action">
                      <Link
                        to="#"
                        className="btn-filters 700:me-2 300:me-0"
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
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-6 col-sm-12">
          <div className="form-group">
            <label>Vendors</label>
            <Select2
              className="w-100"
              data={customerOptions}
              value={selectedCustomer}
              options={{
                placeholder: "None",
              }}
              onSelect={(event) => handleCustomerChange(event.target.value)}
            />
          </div>
        </div>
        {showTotalSales && (
          <div className="mb-3 flex space-x-5">
            <p>
              Party Name: <b>Cash Sale</b>
            </p>
            <p>
              Opening Balance: <b>0</b>
            </p>
            <p>
              Closing Balance: <b>0</b>
            </p>
          </div>
        )}
        <div className="row">
          <div className="col-sm-12">
            <div className="card customers">
              <div className="card-body">
                <div className="table-responsive table-hover">
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
                  <AntTable
                    dateSelectDrop={dateSelectDrop}
                    datasource={PartyStatementLedgerData}
                    columns={columns}
                    SearchData={SearchData}
                    reversedDataSource={reversedDataSource}
                    selectedSearchVar={selectedSearchVar}
                    setSelectedSearchVar={setSelectedSearchVar}
                    searchContent={searchContent}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStatementLedger;
