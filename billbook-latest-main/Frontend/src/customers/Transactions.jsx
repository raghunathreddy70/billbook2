import { Table, Typography, Button } from "antd";
import axios from "axios";
import { DatePicker } from 'antd';
import React, { useEffect, useState } from "react";
import {
  itemRender,
  onShowSizeChange,
} from "../_components/paginationfunction";
import { backendUrl } from "../backendUrl";
import SalesFilters from "../invoices/filters/SalesFilters";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";

const Transactions = ({ id, showContent, setDownloadData, toggleTabsState }) => {
  const { SearchData } = useFiltersSales();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [datasource, setDatasource] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchContent, setSearchContent] = useState(null);
  const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("invoiceName");
  const [filteredDatasource, setFilteredDatasource] = useState([]);


  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addCustomer/getcustomerdetails/${id}`
        );
        setCustomerDetails(response.data);
        console.log("Fetched Customer Details:", response.data);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  useEffect(() => {
    const fetchCustomerInvoiceDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addInvoice/transactions/${customerDetails?.customerId}`
        );

        console.log("response.data", response.data.filter(item => !item.isDeleted))
        setDatasource(response.data.filter(item => !item.isDeleted));
        setFilteredDatasource(response.data.filter(item => !item.isDeleted));
        console.log("Fetched Customer Invoice Details:", response.data);
      } catch (error) {
        console.error("Error fetching customer invoice details:", error);
      }
    };

    if (customerDetails?.customerId) {
      fetchCustomerInvoiceDetails();
    }
  }, [customerDetails]);
  // Functions for the download excel


  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoiceNumber",
    },
    {
      title: "Created On",
      dataIndex: "invoiceDate",
      render: (text, record) => {
        const formattedDate = new Date(record.invoiceDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Invoice Type",
      dataIndex: "invoiceName",
    },
    {
      title: "Total Amount / Balance",
      dataIndex: "totalAndBalance",
      render: (_, record) => (
        <>
          <span className="pe-2">{record.paymentAmount ? record.paymentAmount : record.grandTotal}</span>
          {record.balance ? <span>Unpaid({record.balance})</span> : ""}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span style={{
          backgroundColor: getStatusColor(text),
          color: getTextColor(text),
          padding: "5px 10px",
          borderRadius: "5px",
        }}
        >
          <span  className="dot-line">.</span>{text}
        </span>
      ),
    },

  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "#DAFED1";
      case "UNPAID":
        return "#FBE7E7";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };
  const getTextColor = (text) => {
    switch (text) {
      case "PAID":
        return "#59904B";
      case "UNPAID":
        return "#C95C5C";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };

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
      value: "invoiceDate",
    },
  ]
  const searchSelectDrop = [
    {
      title: "ID",
      value: "invoiceNumber",
    },
    {
      title: "Invoice Type",
      value: "invoiceName",
    },
  ];
  return (
    <div className="row customer-transction-data-change">
      <div className="col-md-12">
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

export default Transactions;
