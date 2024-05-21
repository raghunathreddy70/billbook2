import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Data from "../assets/jsons/recurringInvoice";
import "../_components/antd.css";
import { Pagination, Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import RecurringHead from "./recurringHead";

const RecurringInvoice = () => {
  
  const [menu, setMenu] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [show, setShow] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [showContent,setShowContent]=useState(false)

  const toggleContent = ()=>{
    setShowContent(!showContent)
  }
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const handleCustomerNameFilterChange = (e) => {
    const value = e.target.value;
    setCustomerNameFilter(value);

    const filteredData = filterData(datasource, dateRange, value, customerNameFilter);
    setFilteredDatasource(filteredData);
  };

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
useEffect=()=>{
  console.log(datasource, 'hhhhhhhhhhh')
,[]}
  const datasource = Data?.Data;
  console.log(datasource);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "Invoice",
      render: (text, record) => (
        <Link to="/invoice-details" className="invoice-link">
          {record.Invoice}
        </Link>
      ),
      sorter: (a, b) => a.Invoice.length - b.Invoice.length,
    },
    {
      title: "Category",
      dataIndex: "Category",
      sorter: (a, b) => a.Category.length - b.Category.length,
    },
    {
      title: "Created On",
      dataIndex: "Created",
      sorter: (a, b) => a.Created.length - b.Created.length,
    },
    {
      title: "Invoice To",
      dataIndex: "Name",
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to="/profile" className="avatar avatar-sm me-2">
            <img
              className="avatar-img rounded-circle"
              src={record.img}
              alt="User Image"
            />
          </Link>
          <Link to="/profile">
            {record.Name} <span>{record.Email}</span>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.Name.length - b.Name.length,
    },
    {
      title: "Total Amount",
      dataIndex: "Total",
      sorter: (a, b) => a.Total.length - b.Total.length,
    },
    {
      title: "Paid Amount",
      dataIndex: "Paid",
      sorter: (a, b) => a.Paid.length - b.Paid.length,
    },
    {
      title: "Payment Mode",
      dataIndex: "Payment",
      sorter: (a, b) => a.Payment.length - b.Payment.length,
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      sorter: (a, b) => a.Balance.length - b.Balance.length,
    },
    {
      title: "Due Date",
      dataIndex: "Due",
      sorter: (a, b) => a.Due.length - b.Due.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text, record) => (
        <span className="badge bg-success-light">{text}</span>
      ),
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="text-end">
            <Link
              to="/edit-invoice"
              className="btn btn-sm btn-white text-success me-2"
            >
              <i className="far fa-edit me-1" /> Edit
            </Link>
            <Link
              className="btn btn-sm btn-white text-danger"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_paid"
            >
              <i className="far fa-trash-alt me-1" />
              Delete
            </Link>
          </div>
        </>
      ),
      sorter: (a, b) => a.Action.length - b.Action.length,
    },
  ];

  return (
    <>
     
    </>
  );
};

export default RecurringInvoice;
