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

const ItemReportParty = () => {

  const userData = useSelector((state) => state?.user?.userData)
  const [showFilters, setShowFilters] = useState(false);
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
  const searchSelectDrop = [
    {
      title: "Item Name",
      value: "itemName",
    },
    {
      title: "Item Code",
      value: "itemCode",
    },
    {
      title: "Sales Quantity",
      value: "quantity",
    },
    {
      title: "Sales Amount",
      value: "salesAmount",
    },
  ];

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    // Add logic to handle the change in pagination size
  };

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchData(1);
  }, []);
  const fetchData = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${backendUrl}/api/addCustomer/customers/${userData?.data?._id}`
      );
      setLoading(false);
      setTotalPages(response.data?.length);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, [userData]);

  console.log("customers", customers);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  console.log("selectedCustomer", selectedCustomer);

  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProductReportDetails = async (selectedCustomer) => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addInvoice/partyReportbycustomer/${selectedCustomer}`
        );
        setProductDetails(response.data);
        setDatasource(response.data);
        setShowFilters(true);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (selectedCustomer) {
      fetchProductReportDetails(selectedCustomer);
    }
  }, [selectedCustomer]);

  function getOnlyProducts(data) {
    let arr = [];
    if (data?.length === 0) {
      return arr;
    }
    data.map((item) => {
      item.products?.map((item2) => {
        arr.push(item2);
      });
    });
    console.log("arrproduct", arr);
    return arr;
  }

  const handleCustomerChange = (customerId) => {
    setSelectedCustomer(customerId);
  };

  const customerOptions = customers.map((cus) => ({
    id: cus.customerId,
    text: cus.name,
  }));

  console.log("productindu", productDetails);

  const item1 = [
    {
      label: "All Categories",
      key: "1",
    },
  ];

  const item2 = [
    {
      label: "Cash Sale",
      key: "1",
    },
  ];

  const columns = [
    {
      title: "Item Name",
      dataIndex: "products",
      render: (products) => (products.length > 0 ? products[0].itemName : ""),
      sorter: (a, b) =>
        (a.products[0]?.itemName || "").localeCompare(
          b.products[0]?.itemName || ""
        ),
    },
    {
      title: "Item Code",
      dataIndex: "products",
      render: (products) => (products.length > 0 ? products[0].itemCode : ""),
    },
    {
      title: "Sales Quantity",
      dataIndex: "products",
      render: (products) => (products.length > 0 ? products[0].quantity : ""),
    },
    {
      title: "Sales Amount",
      dataIndex: "products",
      render: (products) =>
        products.length > 0 ? products[0].salesAmount : "",
    },
    // {
    //   title: "Item Name",
    //   dataIndex: "products",
    //   render: (products) => (
    //     <Table
    //     dataSource={products}
    //     columns={[{ dataIndex: 'itemName', title: 'itemName' }]}
    //     pagination={false}
    //     showHeader={false}
    //   />
    //   ),
    // },
    // {
    //   title: "Item Code",
    //   dataIndex: "products",
    //   render: (products) => (
    //      <Table
    //      dataSource={products}
    //      columns={[{ dataIndex: 'itemCode', title: 'itemCode' }]}
    //      pagination={false}
    //      showHeader={false}
    //    />
    //   ),
    // },
    // {
    //   title: "Sales Quantity",
    //   dataIndex: "products",
    //   render: (products) => (
    //     <Table
    //       dataSource={products}
    //       columns={[{ dataIndex: 'quantity', title: 'Quantity' }]}
    //       pagination={false}
    //       showHeader={false}
    //     />
    //   ),
    // },
    // {
    //   title: "Sales Amount",
    //   dataIndex: "products",
    //   render: (products) => (
    //     <ul>
    //       {products.map((product) => (
    //         <li key={product.productId}>{product.salesAmount}</li>
    //       ))}
    //     </ul>
    //   ),
    // },
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
      let dataFound = getOnlyProducts(downloadableData);
      setDownloadData(dataFound);
    };
    fetchDownloadData();
  }, [isFiltered, filteredDatasource, searchContent, datasource]);

  const { handlePDFDownload, handleCSVDownload } = useHandleDownload();

  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Item Name": item?.itemName,
      "Item Code": item?.itemCode,
      "Sales Quantity": item?.quantity,
      "Sales Amount": item?.salesAmount,
      // Map more fields as needed
    }));
    console.log("downloadableDatadfhb", csvData);
    const headers = [
      { label: "Item Name", key: "Item Name" },
      { label: "Item Code", key: "Item Code" },
      { label: "Sales Quantity", key: "Sales Quantity" },
      { label: "Sales Amount", key: "Sales Amount" },
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
      "Item Code",
      "Sales Quantity",
      "Sales Amount",
      // Add more columns as needed
    ];
    console.log(downloadData, "downloadData");
    const rows = downloadData.map((item) => [
      item?.itemName,
      item?.itemCode,
      item?.quantity, // Format invoiceDate
      item?.salesAmount, // Format dueDate
    ]);

    let heading =
      toggleTabsState === 0
        ? "Item Batch Report"
        : toggleTabsState === 1
        ? "Paid Credit Notes"
        : toggleTabsState === 2
        ? "Overdue Credit Notes"
        : "Outstanding Credit Notes";

    // handlePDFDownload({ columns, rows, heading });
    handlePDFDownload({ columns, rows, heading });
  };

  return (
    <div className="page-wrapper customers">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <div className="d-flex align-items-start">
              <BackButton />
              <h5 className="reports-h5">Item Report By Customer</h5>
            </div>
            <div className="reports-filter-parent">
              <div className="list-btn">
                {showFilters && (
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
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-6 col-sm-12">
          <div className="form-group">
            <label>Customers</label>
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
        <div className="row">
          <div className="col-sm-12">
            <div className="card customers">
              <div className="card-body">
                <div className="table-responsive table-hover">
                  {showContent && (
                    <SalesFilters
                      datasource={datasource}
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
                  loading={loading}
                  fetchData={fetchData}
                  totalPages={totalPages}
                    // DataSourceFilter={DataSourceFilter}
                    datasource={productDetails}
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
        {/* <div className="row">
          <div className="col-sm-12">
            <div className="card-table">
              <div className="card-body">
                <div className="table-responsive table-hover customer-details table-striped">
                  <Table
                    pagination={{
                      total: productDetails && productDetails.length,
                      showTotal: (total, range) =>
                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                      showSizeChanger: true,
                      // onShowSizeChange: onShowSizeChange,
                      // itemRender: itemRender,
                    }}
                    rowKey={(record) => record._id}
                    columns={columns}
                    dataSource={productDetails}
                    expandedRowKeys={[]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ItemReportParty;
