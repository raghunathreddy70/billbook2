import { Table, Typography, Button, DatePicker } from "antd";
import axios from "axios";
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from "react";
import {
  itemRender,
  onShowSizeChange,
} from "../_components/paginationfunction";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { backendUrl } from "../backendUrl";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const VenderTransactions = ({ id, toggleTabsState, showContent, setDownloadData }) => {
  const { SearchData } = useFiltersSales();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchContent, setSearchContent] = useState(null);
  const [selectedDateVar, setSelectedDateVar] = useState("purchasesDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("purchaseName");

  const [vendorInvoiceDetails, setVendorInvoiceDetails] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const vendorid = vendorDetails?.vendorId;


  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addVendor/vendors/${id}`
        );
        console.log(response.data, "response")
        setVendorDetails(response.data);

        console.log("Fetched Vendor Details:", response.data);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchVendorDetails();
  }, [id]);


  const fetchVendorInvoiceDetails = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/addPurchases/ventransactions/${vendorid}`
      );
      setVendorInvoiceDetails(response.data);
      setFilteredDatasource(response.data);
      setDatasource(response.data)
      // console.log("Fetched Customer Details:", response.data);
    } catch (error) {
      console.error("Error fetchingfilterData< customer details:", error);
    }
  };
  useEffect(() => {
    fetchVendorInvoiceDetails();
  }, [vendorid]);



  const getStatusColor = (status) => {
    let text = status.toLowerCase()
    switch (text) {
      case 'paid':
        return '#33B469';
      case "unpaid":
        return '#ed2020';
      case 'partially paid':
        return '#f9dc0b';
      default:
        return 'white';
    }
  };

  const columns = [
    {
      title: "Invoice ID",
      render: (_, record) => (
        <span>{record?.purchaseNumber || "N/A"}</span>
      ),
    },
    {
      title: "Created On",
      dataIndex: "purchasesDate",
      render: (text, record) => {
        const formattedDate = record?.purchasesDate ? new Date(record.purchasesDate).toLocaleDateString(
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
      render: (_, record) => (
        <span>{record?.purchaseName || "N/A"}</span>
      ),
    },
    {
      title: "Total Amount / Balance",
      dataIndex: "totalAndBalance",
      render: (_, record) => (
        <>
          <span className="pe-2">{record?.paymentAmount ? record?.paymentAmount : record?.grandTotal}</span>
          {record?.balance ? <span>Unpaid({record.balance})</span> : ""}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span style={{ backgroundColor: getStatusColor(text), color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
          {text}
        </span>
      ),
    },
  ];


  // filter function with customer name 
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();


  useEffect(() => {
    if (toggleTabsState === 1) {
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
    <>
      <div className="rowa">
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
      {/* <TotalLengthBlocks vendorInvoiceDetails={vendorInvoiceDetails} /> */}
    </>
  );
};

export default VenderTransactions;
