import { Table, Typography, Button, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import axios from "axios";
import { itemRender, onShowSizeChange } from "../_components/paginationfunction";
import { backendUrl } from "../backendUrl";
import SalesFilters from "../invoices/filters/SalesFilters";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";

const VenderLedger = ({ id, toggleTabsState, showContent, setDownloadData }) => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorPaymentDetails, setVendorPaymentDetails] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchContent, setSearchContent] = useState(null);
  const { SearchData } = useFiltersSales();
  const [selectedDateVar, setSelectedDateVar] = useState("purchasesDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("purchaseName");
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
          `${backendUrl}/api/addPurchases/venledgers/${vendorDetails?.vendorId}`
        );
        setFilteredDatasource(response.data);
        setDatasource(response.data)
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
      title: "Invoice ID",
      dataIndex: "purchaseNumber",
    },
    {
      title: "Created On",
      dataIndex: "purchasesDate",
      render: (text, record) => {
        const formattedDate = record?.purchasesDate ? new Date(record?.purchasesDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        ) : "N/A";
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Vouchers",
      dataIndex: "purchaseName",
    },
    {
      title: "Credit",
      render: (_, record) => (
        <span>{record?.credit || 0}</span>
      ),
    },
    {
      title: "Debit",
      render: (_, record) => (
        <span>{record?.debit || 0}</span>
      ),
    },
    {
      title: "Balance",
      render: (_, record) => (
        <span>{record?.vendorBalance || 0}</span>
      ),
    },
   
  ];

   // filter function with customer name 
   const reversedDataSource = isFiltered
   ? [...filteredDatasource].reverse()
   : [...datasource].reverse();


 useEffect(() => {
   if (toggleTabsState === 2) {
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
     value: "purchasesDate",
   },
 ]
 const searchSelectDrop = [
   {
     title: "ID",
     value: "purchaseNumber",
   },
   {
     title: "Vouchers",
     value: "purchaseName",
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
                rowKey={(record) => record.id}
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

export default VenderLedger;
