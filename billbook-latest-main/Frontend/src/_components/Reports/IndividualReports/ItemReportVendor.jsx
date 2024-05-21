import React, { useState, useEffect } from "react";
import FilterBar from "../Components/FilterBar";
import DateRangeFilter from "../Components/DateRangeFilter";
import AntTable from "../Components/AntTable";
import useFiltersSales from "../../../invoices/customeHooks/useFiltersSales";
import useHandleDownload from "../../../Hooks/useHandleDownload";
import BackButton from "../../../invoices/Cards/BackButton";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Typography, Button } from "antd";
import SalesFilters from "../../../invoices/filters/SalesFilters";
import Select2 from "react-select2-wrapper";
import { backendUrl } from "../../../backendUrl";
import { useSelector } from "react-redux";

const ItemReportVendor = () => {

  const userData = useSelector((state) => state?.user?.userData)

  const { SearchData } = useFiltersSales();
  const [datasource, setDatasource] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [selectedDateVar, setSelectedDateVar] = useState("addingDate");
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  // const [selectedDateVar, setSelectedDateVar] = useState("creditnotesDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("itemName");
  const [searchContent, setSearchContent] = useState(null);


  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1); 
  useEffect(() => {
    fetchData();
  }, []);
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${backendUrl}/api/purchaseorder/purchaseOrder/${userData?.data?._id}`);
        setPurchaseOrder(response.data);
        setLoading(false);
        setTotalPages(response.data?.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally {
        setLoading(false)
      }
    };
  useEffect(() => {
    fetchData();
  }, [userData]);

  console.log("purchaseOrder", purchaseOrder);

  const columns = [
    {
      title: "Purchase Order Number",
      dataIndex: "purchaseORNumber",
      render: (text, record) => <Link>{text}</Link>,
    },
    {
      title: "Purchase Order To",
      dataIndex: "name",
      render: (name, record) => <Link>{name?.name || "N/A"}</Link>,
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
        return <Link>{formattedDate}</Link>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      // render: (text, record) => (
      //   <Link to={invoiceDetailsLink(record)}>{text}</Link>
      // ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      // render: (text, record) => (
      //   <Link to={invoiceDetailsLink(record)}>{text}</Link>
      // ),
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
    
  ];

  const filterItemFun = (e) => {
    console.log(e.key);
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
      "Item Name": item?.itemName,
      "Manufacturing Date": item?.addingDate,
      "Purchase Pice": item?.purchasePrice,
      "Selling Price": item?.salesPrice,
      "Current Stock": item?.openingStock,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Item Name", key: "itemName" },
      { label: "Manufacturing Date", key: "addingDate" },
      { label: "Purchase Pice", key: "purchasePrice" },
      { label: "Selling Price", key: "salesPrice" },
      { label: "Current Stock", key: "openingStock" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here
  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "Item Name",
      "Manufacturing Date",
      "Purchase Pice",
      "Selling Price",
      "Current Stock",
    ];

    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.itemName,
      item?.addingDate,
      item?.purchasePrice,
      item?.salesPrice,
      item?.openingStock,
      item?.balance,
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
              <h5 className="reports-h5">Purchase Orders</h5>
            </div>
            <div className="reports-filter-parent">
              {/* <FilterBar items={item1} filterItemFun={filterItemFun} title={"Select Category"} /> */}
              {/* <DateRangeFilter /> */}
              {/* <FilterBar items={item2} filterItemFun={filterItemFun} title={"Select Party"} /> */}
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
        {/* <div className="col-lg-12 col-md-6 col-sm-12">
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
        </div> */}
        {/* <div className="row">
          <div className="col-sm-12">
            <div className="card customers">
              <div className="card-body">
                <div className="table-responsive table-hover">
                  {showContent && (
                    <SalesFilters
                      datasource={datasource}
                      dateSelectDrop={dateSelectDrop}
                      reversedDataSource={reversedDataSource}
                      selectedDateVar={selectedDateVar}
                      setSelectedDateVar={setSelectedDateVar}
                      searchContent={searchContent}
                      searchSelectDrop={searchSelectDrop}
                      selectedSearchVar={selectedSearchVar}
                      setFilteredDatasource={setFilteredDatasource}
                      setIsFiltered={setIsFiltered}
                      setSearchContent={setSearchContent}
                      setSelectedSearchVar={setSelectedSearchVar}
                    />
                  )}
                  <AntTable
                    // DataSourceFilter={DataSourceFilter}
                    datasource={productDetails}
                    columns={columns}
                    dateSelectDrop={dateSelectDrop}
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
        </div> */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table">
              <div className="card-body">
                <div className="table-responsive table-hover customer-details table-striped">
                  <Table
                    pagination={{
                      pageSize: 10,
                          total: totalPages,
                          onChange: (page) => {
                            fetchData(page);
                          },
                      
                      showTotal: (total, range) =>
                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                      showSizeChanger: true,
                      // onShowSizeChange: onShowSizeChange,
                      // itemRender: itemRender,
                    }}
                    loading={loading}
                    rowKey={(record) => record._id}
                    columns={columns}
                    dataSource={purchaseOrder}
                    expandedRowKeys={[]}
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

export default ItemReportVendor;
