import { Table, Typography, Button, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  itemRender,
  onShowSizeChange,
} from "../_components/paginationfunction";
import { backendUrl } from "../backendUrl";
import SalesFilters from "../invoices/filters/SalesFilters";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";


const ItemwiseVendorReport = ({
  id,
  toggleTabsState,
  showContent,
  setDownloadData,
}) => {
  const [isFiltered, setIsFiltered] = useState(false);
  const { SearchData } = useFiltersSales();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorInvoiceDetails, setVendorInvoiceDetails] = useState([]);
  const [vendorPaymentDetails, setVendorPaymentDetails] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [searchContent, setSearchContent] = useState(null);
  const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("invoiceName");
  const [filteredDatasource, setFilteredDatasource] = useState([]);


  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addVendor/vendors/${id}`
        );
        setVendorDetails(response.data);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      }
    };

    fetchVendorDetails();
  }, [id]);

  useEffect(() => {
    const fetchVendorInvoiceDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addPurchases/partyReportbyvendor/${vendorDetails?.vendorId}`
        );
        setVendorInvoiceDetails(response.data);
        setDatasource(response.data);
        setFilteredDatasource(response.data)
      } catch (error) {
        console.error("Error fetching vendor invoice details:", error);
      }
    };

    if (vendorDetails) {
      fetchVendorInvoiceDetails();
    }
  }, [vendorDetails]);


  useEffect(() => {
    const fetchVendorPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/paymentOutDetails/paymentbyvendorid/${vendorDetails?.vendorId}`
        );
        setVendorPaymentDetails(response.data);
      } catch (error) {
        console.error("Error fetching vendor payment details:", error);
      }
    };

    if (vendorDetails) {
      fetchVendorPaymentDetails();
    }
  }, [vendorDetails]);


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
      title: "Purchase Quantity",
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
      title: "Purchase Amount",
      dataIndex: "products",
      render: (products) => (
        <ul>
          {products.map((product) => (
            <li key={product.productId}>{product.purAmount}</li>
          ))}
        </ul>
      ),
    },
  ];
 // filter function with customer name 
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
                  showSizeChanger: true,
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

export default ItemwiseVendorReport;
