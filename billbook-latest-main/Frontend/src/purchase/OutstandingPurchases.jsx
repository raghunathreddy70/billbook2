import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import Data from "../assets/jsons/invoiceRecurring";
import "../_components/antd.css";
import { Pagination, Table, Typography, Button } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import PurchaseListHeader from "./PurchaseListHeader";
import { DatePicker } from 'antd';
import axios from "axios";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
const { RangePicker } = DatePicker;
const { Text } = Typography;

const OutstandingPurchases = ({ setDownloadData, toggleTabsState, showContent }) => {
  const { SearchData } = useFiltersSales();
  const { handleDeletePurchase } = useDeleteSales();
  const [datasource, setDatasource] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);

  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: 'Purchase Date',
      value: "purchasesDate",
    },
    {
      title: 'Due Date',
      value: "dueDate",
    }
  ];
  const searchSelectDrop = [
    {
      title: 'Purchase ID',
      value: "purchaseNumber",
    },
    {
      title: 'Purchase To',
      value: "name?.name",
    },
    {
      title: 'Total Amount',
      value: "grandTotal",
    },
    {
      title: 'Balance',
      value: "balance",
    },
  ]
  const [selectedDateVar, setSelectedDateVar] = useState("purchasesDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("name?.name");
  const [searchContent, setSearchContent] = useState(null);

  // filter function with customer name 
  const reversedDataSource = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();

  useEffect(() => {
    if (toggleTabsState === 3) {
      const fetchDownloadData = async () => {
        const data = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();
        let downloadableData = SearchData({ data: data, selectedVar: selectedSearchVar, searchValue: searchContent });
        setDownloadData(downloadableData)
      }
      fetchDownloadData();
    }
  }, [toggleTabsState, isFiltered, filteredDatasource, searchContent])

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/addPurchases/purchases")
      .then((response) => {
        const purchaseOutstanding = response.data.filter(
          (invoice) => invoice.purchaseStatus === "UNPAID"
        );
        setDatasource(purchaseOutstanding);
        setFilteredDatasource(purchaseOutstanding);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [purchaseListid, setPurchaseListid] = useState("");

  const handlePurchaseListidDelete = (value) => {
    setPurchaseListid(value);
  }


  const columns = [
    {
      title: "Purchase ID",
      dataIndex: "purchaseNumber",
      render: (purchaseNumber, record) => (
        <Link to={`/purchases-details/${record._id}`}>{purchaseNumber}</Link>
      ),
    },
    {
      title: "Purchase To",
      dataIndex: "name",
      render: (name, record) => (
        <Link to={`/purchases-details/${record._id}`}>{name?.name || "N/A"}</Link>
      ),
    },
    {
      title: "Purchase Date",
      dataIndex: "purchasesDate",
      render: (text, record) => {
        const formattedDate = new Date(record.purchasesDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return (
          <Link to={`/purchases-details/${record._id}`}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      render: (purchaseNumber, record) => (
        <Link to={`/purchases-details/${record._id}`}>{record.grandTotal}</Link>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (purchaseNumber, record) => (
        <Link to={`/purchases-details/${record._id}`}>{record.balance}</Link>
      ),
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
        return (
          <Link to={`/purchases-details/${record._id}`}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'purchaseStatus',
      render: (text) => (
        <span style={{ backgroundColor: getStatusColor(text), color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              className="btn-action-icon me-2"
              to={`/edit-purchases/${record._id}`}
            >
              <EditButton/>
            </Link>
            <Link
              className="btn-action-icon"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal3"
              onClick={() => handlePurchaseListidDelete(record._id)}
            >
              <DeleteButton/>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return '#33B469';
      case 'UNPAID':
        return '#ed2020';
      case 'PARTIALLY PAID':
        return '#f9dc0b';
      default:
        return 'white'; // Default background color
    }
  };


  return (
    <>
      {/* Table */}
      <div className="row my-3 mt-0">
        <div className="col-sm-12">
          <div className="card-table">
            <div className="card-body invoiceList">
              <div className="table-responsive table-hover">

                <div className="table-filter p-0">

                  {showContent && (
                    <SalesFilters datasource={datasource} dateSelectDrop={dateSelectDrop} reversedDataSource={reversedDataSource} searchContent={searchContent} searchSelectDrop={searchSelectDrop} selectedDateVar={selectedDateVar} selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource} setIsFiltered={setIsFiltered} setSearchContent={setSearchContent} setSelectedDateVar={setSelectedDateVar} setSelectedSearchVar={setSelectedSearchVar} />
                  )}
                </div>
                <Table
                  pagination={{
                    total: SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent }).length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    itemRender: itemRender,
                  }}
                  columns={columns}
                  dataSource={SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent })}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Table */}

      <div className="modal custom-modal fade" id="delete_modal3" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Invoice</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal" onClick={() => handleDeletePurchase({ purchasesId: purchaseListid, setDatasource: setDatasource, datasource: datasource, setFilteredDatasource: setFilteredDatasource })}
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default OutstandingPurchases;
