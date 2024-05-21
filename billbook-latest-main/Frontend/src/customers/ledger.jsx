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

const Ledger = ({ id, showContent, setDownloadData, toggleTabsState }) => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerPaymentDetails, setCustomerPaymentDetails] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchContent, setSearchContent] = useState(null);
  const { SearchData } = useFiltersSales();
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
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  console.log("fcustomerDetailsirst", customerDetails)

  useEffect(() => {
    const fetchCustomerInvoiceDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addInvoice/ledgers/${customerDetails?.customerId}`
        );

        const newLedgerData = await response.data.filter(
          (item) => !item.isDeleted
        );

        const updatedLedgerData = [...newLedgerData];
        let previousBalance = 0;

        updatedLedgerData.forEach((ledger) => {
          const { debit = 0, credit = 0 } = ledger;

          previousBalance = ledger.customerBalance =
            previousBalance + debit - credit;
        });

        console.log("newLedgerData", updatedLedgerData);
        setDatasource(updatedLedgerData);
        setFilteredDatasource(updatedLedgerData);
        console.log("datayghnh", response);
      } catch (error) {
        console.error("Error fetching customer invoice details:", error);
      }
    };

    if (customerDetails) {
      fetchCustomerInvoiceDetails();
    }
  }, [customerDetails]);

  useEffect(() => {
    const fetchCustomerPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/paymentDetails/paymentbycustomerid/${customerDetails?.customerId}`
        );
        setCustomerPaymentDetails(response.data);
      } catch (error) {
        console.error("Error fetching customer payment details:", error);
      }
    };

    if (customerDetails) {
      fetchCustomerPaymentDetails();
    }
  }, [customerDetails]);

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
      title: "Credit",
      dataIndex: "credit",
    },
    {
      title: "Debit",
      dataIndex: "debit",
    },
    {
      title: "Balance",
      dataIndex: "customerBalance",
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
      value: "invoiceDate",
    },
  ];
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
    <div className="row customer-transction-data-change">
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

export default Ledger;
