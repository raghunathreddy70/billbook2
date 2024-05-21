import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import Data from "../assets/jsons/inventory";
import "../_components/antd.css";
// import { Table } from "antd";
import { Input, Pagination, Space, Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import Select2 from "react-select2-wrapper";
import InventorySideBar from "../layouts/InventorySideBar";
import axios from "axios";

const DeletedInvoice = () => {

  const [isEnabled, setIsEnabled] = useState(false);

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [datasource, setDatasource] = useState([]);

  const [deletedPurchase, setDeletedPurchase] = useState([]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  const [currencyOptions, setcurrencyOptions] = useState([
    { id: 1, text: "0" },
    { id: 2, text: "1" },
    { id: 3, text: "2" },
    { id: 4, text: "3" },
  ]);
  const [menu, setMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };



  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };



  const handleDeletePurchase = async (purchaseId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/addPurchases/purchases/delete/${purchaseId}`
      );

      if (response.status === 200) {
        console.log("Purchases deleted successfully");
        const deletedPurchase = datasource.find(
          (item) => item._id === purchaseId
        );
        setDeletedPurchase((prevDeletedPurchase) => [
          ...prevDeletedPurchase,
          deletedPurchase,
        ]);
        setDatasource((prevData) =>
          prevData.filter((item) => item._id !== purchaseId)
        );
      } else {
        console.error("Failed to delete purchase:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const confirmDeletePurchase = (purchaseId) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      handleDeletePurchase(purchaseId);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/addPurchases/purchases")
      .then((response) => {
        console.log("Purchase", response.data);
        setDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get("http://localhost:8000/api/addPurchases/newDeletedPurchase/purchase")
      .then((response) => {
        console.log("deletedpurchases", response.data);
        setDeletedPurchase(response.data);
      })
      .catch((error) => {
        console.error("Error fetching deleted purchase:", error);
      });
  }, []);

  const deletedPurchasesColumns = [
    {
      title: "Purchase ID",
      dataIndex: "purchaseNumber",
      sorter: (a, b) => a.purchaseNumber.length - b.purchaseNumber.length,
    },
    {
      title: "Purchase To",
      dataIndex: "customerName",
      render: (customerName, jjh) => (
        <h2 className="table-avatar">
          <Link to="#" className="avatar avatar-sm me-2">
            {customerName && customerName.image && (
              <img
                className="avatar-img rounded-circle"
                src={`${customerName.image.url}`}
                alt="User"
              />
            )}
          </Link>
          <ul>
            <li>{customerName ? customerName?.name : ""}</li>
          </ul>
        </h2>
      ),
      sorter: (a, b) => a.customerName.length - b.customerName.length,
    },
    {
      title: "Created On",
      dataIndex: "purchasesDate",
      sorter: (a, b) => a.purchasesDate.length - b.purchasesDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.purchasesDate).toLocaleDateString(
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
      title: "Total Amount",
      dataIndex: ["grandTotal"],
      sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
    },
    {
      title: "Balance",
      dataIndex: "payments",
      render: (payments, record) => {
        if (payments.length > 0) {
          const lastPayment = payments[payments.length - 1];
          const lastPaymentBalance = lastPayment ? lastPayment.balance : 0;
          return <span>{lastPaymentBalance}</span>;
        } else {
          return <span>{record.grandTotal}</span>;
        }
      },
      sorter: (a, b) => {
        const lastBalanceA =
          a.payments.length > 0 ? a.payments[a.payments.length - 1].balance : 0;
        const lastBalanceB =
          b.payments.length > 0 ? b.payments[b.payments.length - 1].balance : 0;

        return lastBalanceA - lastBalanceB;
      },
    },

    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => a.dueDate.length - b.dueDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.dueDate).toLocaleDateString(
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
      title: "Status",
      dataIndex: "payments",
      render: (payments, record) => {

        if (payments.length > 0) {

          const lastPayment = payments[payments.length - 1];
          const purchasesDate = new Date(record.purchasesDate);
          const dueDate = new Date(record.dueDate);


          if (lastPayment.balance === 0) {
            return <span className={`badge bg-success-light`}>Paid</span>;
          } else if (purchasesDate > dueDate) {

            const overdueDays = Math.floor(
              (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
            );
            return (
              <span className={`badge bg-danger-light`}>
                Overdue by {overdueDays} days
              </span>
            );
          } else {

            return (
              <span className={`badge bg-warning-light text-warning`}>Partially Paid</span>
            );
          }
        } else {

          return <span className={`badge bg-success-light`}>Unpaid</span>;
        }
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <Link
                  className="dropdown-item"
                  to={`/edit-purchases/${record._id}`}
                >
                  <i className="far fa-edit me-2" />
                  Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to={`/purchases-details/${record._id}`}
                >
                  <i className="far fa-eye me-2" />
                  View
                </Link>
                <button
                  className="dropdown-item"
                  onClick={() => confirmDeletePurchase(record._id)}
                >
                  <i className="far fa-trash-alt me-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      ),
      sorter: (a, b) => a.action.length - b.action.length,
    },
  ];

  console.log("datasource", datasource);
  console.log("customerId", datasource.customerName)

  const columns = [
    {
      title: "Purchase ID",
      dataIndex: "purchaseNumber",

      sorter: (a, b) => a.purchaseNumber.length - b.purchaseNumber.length,
    },

    {
      title: "Purchase To",
      dataIndex: "customerName",
      render: (customerName, jjh) => (
        <h2 className="table-avatar">
          <Link to="#" className="avatar avatar-sm me-2">
            <img
              className="avatar-img rounded-circle"
              src={`${customerName?.image?.url}`}
              alt="User"
            />
          </Link>
          <ul>
            <li>{customerName?.name}</li>
          </ul>

          {/* <Link to="/profile">
            {record.customerName} <span>{record.email}</span>
          </Link> */}
        </h2>
      ),
      sorter: (a, b) => a.customerName.length - b.customerName.length,
    },
    {
      title: "Purchases Date",
      dataIndex: "purchasesDate",
      sorter: (a, b) => a.purchasesDate.length - b.purchasesDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.purchasesDate).toLocaleDateString(
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
      title: "Total Amount",
      dataIndex: ["grandTotal"],
      sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
    },

    {
      title: "Balance",
      dataIndex: "payments",

      render: (payments, record) => {
        if (payments.length > 0) {
          const lastPayment = payments[payments.length - 1];
          const lastPaymentBalance = lastPayment ? lastPayment.balance : 0;
          return <span>{lastPaymentBalance}</span>;
        } else {
          return <span>{record.grandTotal}</span>;
        }
      },
      sorter: (a, b) => {
        const lastBalanceA =
          a.payments.length > 0 ? a.payments[a.payments.length - 1].balance : 0;
        const lastBalanceB =
          b.payments.length > 0 ? b.payments[b.payments.length - 1].balance : 0;

        return lastBalanceA - lastBalanceB;
      },
    },

    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => a.dueDate.length - b.dueDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.dueDate).toLocaleDateString(
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
      title: "Status",
      dataIndex: "payments",
      render: (payments, record) => {

        if (payments.length > 0) {

          const lastPayment = payments[payments.length - 1];


          const purchasesDate = new Date(record.purchasesDate);
          const dueDate = new Date(record.dueDate);


          if (lastPayment.balance === 0) {
            return <span className={`badge bg-success-light`}>Paid</span>;
          } else if (purchasesDate > dueDate) {

            const overdueDays = Math.floor(
              (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
            );
            return (
              <span className={`badge bg-danger-light`}>
                Overdue by {overdueDays} days
              </span>
            );
          } else {

            return (
              <span className={`badge text-warning bg-light`}>Partially Paid</span>
            );
          }
        } else {
          return <span className={`badge bg-danger-light`}>Unpaid</span>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <Link
                  className="dropdown-item"
                  to={`/edit-purchases/${record._id}`}
                >
                  <i className="far fa-edit me-2" />
                  Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to={`/purchases-details/${record._id}`}
                >
                  <i className="far fa-eye me-2" />
                  View
                </Link>
                <button
                  className="dropdown-item"
                  onClick={() => confirmDeletePurchase(record._id)}
                >
                  <i className="far fa-trash-alt me-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      ),
      sorter: (a, b) => a.action.length - b.action.length,
    },
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        {/* <InventorySideBar /> */}
        <Sidebar active={20} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            {/* <div className="page-header">
              <div className="content-page-header">
                <h5>Deleted Invoices</h5>
                <div className="row">
                  <div className="list-btn">
                    <ul className="filter-list">
                      <li>
                        <Link className="btn btn-filters w-auto popup-toggle me-2" to='#' data-bs-toggle="modal" data-bs-target="#con-close-modal" >
                          <FeatherIcon icon="settings" />
                        </Link>
                      </li>
                      <div
                        id="con-close-modal"
                        className="modal fade"
                        tabIndex={-1}
                        role="dialog"
                        aria-hidden="true"
                        style={{ display: "none" }}
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h4 className="modal-title">Quick Payment In Settings</h4>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <div className="modal-body p-4">
                              <div className="row">
                                <div className="col-lg-12 col-md-6 col-sm-12">
                                  <div className="form-group manage-business-enable-tds">
                                    <p>Payment In Prefix & Sequence Number</p>
                                    <span>
                                      <label className="switch">
                                        <input type="checkbox" checked={isEnabled} onChange={handleCheckboxChange} />
                                        <span className="slider round"></span>
                                      </label>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {isEnabled && (
                                <div>
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                      <div className="form-group">
                                        <label>Prefix</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Prefix"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                      <div className="form-group">
                                        <label>Sequence Number</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Sequence No"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="form-group">
                                      <p>Payment In Number:&nbsp;</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary waves-effect me-2"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                className="btn btn-info waves-effect waves-light"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="form-group">
                    <Select2
                      className="w-100"
                      data={currencyOptions}
                      options={{
                        placeholder: "Last 365 Days",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div> */}
            {/* /Page Header */}

            {/* <InvoiceHead setShow={setShow} show={show} /> */}


            {/* Deleted Invoices Table */}

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body invoiceList">
                    <h3>Deleted Invoices</h3>
                    <div className="table-responsive table-hover">
                      {/* <Table
                        pagination={false}
                        columns={columns}
                        dataSource={deletedInvoices}
                        rowKey={(record) => record.id}
                      /> */}
                      <Table
                        pagination={false}
                        columns={deletedPurchasesColumns}
                        dataSource={deletedPurchase}
                        rowKey={(record) => record.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Deleted Invoices Table */}

          </div>
        </div>
      </div>
    </>
  );
};

export default DeletedInvoice;
