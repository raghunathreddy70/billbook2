import { Table, Typography, Button } from "antd";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  itemRender,
  onShowSizeChange,
} from "../_components/paginationfunction";
import { DatePicker } from "antd";
import { backendUrl } from "../backendUrl";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
const { RangePicker } = DatePicker;
const { Text } = Typography;
const itemwiseReport = ({
  id,
  showContent,
  setDownloadData,
  toggleTabsState,
}) => {
  const { SearchData } = useFiltersSales();

  const [customerDetails, setCustomerDetails] = useState([]);

  console.log("customerDetailsasd", customerDetails)
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [searchContent, setSearchContent] = useState(null);
  const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("invoiceName");

  // const productDownloadData=datasource.data[0].products;

  // const [productDownloadData,setProductDownloadData] = useState(false)
  


  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addCustomer/getcustomerdetails/${id}`
        );
        setCustomerDetails(response.data);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchCustomerDetails();
  }, [id]);


  console.log("customerDetailsinreport", customerDetails)


  const [productDetails, setProductDetails] = useState([]);

  console.log("productDetailsssss", productDetails)

  useEffect(() => {
    const fetchProductReportDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addInvoice/partyReportbycustomer/${customerDetails?.customerId}`
        );
        setDatasource(response.data)
        setFilteredDatasource(response.data);
        console.log("responsedfgdgdf",response);
        console.log("responsegtj",response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (customerDetails) {
      fetchProductReportDetails();
    }
  }, [customerDetails]);


  const columns = [
    {
      title: "Item Name",
      dataIndex: "products",
      render: (products) => (
        <ul>
          {products.map((product) => (
            <li key={product.productId}>{product.itemName}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Item Code",
      dataIndex: "products",
      render: (products) => (
        <ul>
          {products.map((product) => (
            <li key={product.productId}>{product.itemCode}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Sales Quantity",
      dataIndex: "products",
      render: (products) => (
        <ul>
          {products.map((product) => (
            <li key={product.productId}>{product.quantity}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Sales Amount",
      dataIndex: "products",
      render: (products) => (
        <ul>
          {products.map((product) => (
            <li key={product.productId}>{product.salesAmount}</li>
          ))}
        </ul>
      ),
    },
    
  ];
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();

  useEffect(() => {
    if (toggleTabsState === 3) {
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
  }, [toggleTabsState, isFiltered, filteredDatasource, searchContent]);


  const dateSelectDrop = [
    {
      title: "Created On",
      value: "invoiceDate",
    },
  ]
  const searchSelectDrop = [
    {
      title: "ID",
      value: "invoiceNumber",
    },
    {
      title: "Vouchers",
      value: "invoiceName",
    },
  ];
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table">
          <div className="card-body">
            <div className="table-responsive table-hover customer-details table-striped">
              <div className="table-filter  p-0">
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
                  // showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={SearchData({
                  data: reversedDataSource,
                  selectedVar: selectedSearchVar,
                  searchValue: searchContent,
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default itemwiseReport;
