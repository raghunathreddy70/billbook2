import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import "../_components/antd.css";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
// import InvoiceHead from "./invoiceHead";
import axios from "axios";

const Purchases = () => {

  const [menu, setMenu] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [datasource, setDatasource] = useState([]);

  const [deletedPurchase, setDeletedPurchase] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  console.log("deletedpurchases data", deletedPurchase);

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

    // axios
    //   .get("http://localhost:8000/api/addPurchases/newDeletedPurchase/purchase")
    //   .then((response) => {
    //     console.log("deletedpurchases", response.data);
    //     setDeletedPurchase(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching deleted purchase:", error);
    //   });
  }, []);

  // const deletedPurchasesColumns = [
  //   {
  //     title: "Purchase ID",
  //     dataIndex: "purchaseNumber",
  //     sorter: (a, b) => a.purchaseNumber.length - b.purchaseNumber.length,
  //   },
  //   {
  //     title: "Purchase To",
  //     dataIndex: "customerName",
  //     render: (customerName, jjh) => (
  //       <h2 className="table-avatar">
  //         <Link to="#" className="avatar avatar-sm me-2">
  //           {customerName && customerName.image && (
  //             <img
  //               className="avatar-img rounded-circle"
  //               src={`${customerName.image.url}`}
  //               alt="User"
  //             />
  //           )}
  //         </Link>
  //         <ul>
  //           <li>{customerName ? customerName?.name : ""}</li>
  //         </ul>
  //       </h2>
  //     ),
  //     sorter: (a, b) => a.customerName.length - b.customerName.length,
  //   },


  //   {
  //     title: "Created On",
  //     dataIndex: "purchasesDate",
  //     sorter: (a, b) => a.purchasesDate.length - b.purchasesDate.length,
  //     render: (text, record) => {
  //       const formattedDate = new Date(record.purchasesDate).toLocaleDateString(
  //         "en-GB",
  //         {
  //           year: "numeric",
  //           month: "2-digit",
  //           day: "2-digit",
  //         }
  //       );
  //       return <span>{formattedDate}</span>;
  //     },
  //   },

  //   {
  //     title: "Total Amount",
  //     dataIndex: ["grandTotal"],
  //     sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
  //   },
  //   {
  //     title: "Balance",
  //     dataIndex: "payments",
  //     render: (payments, record) => {
  //       if (payments.length > 0) {
  //         const lastPayment = payments[payments.length - 1];
  //         const lastPaymentBalance = lastPayment ? lastPayment.balance : 0;
  //         return <span>{lastPaymentBalance}</span>;
  //       } else {
  //         return <span>{record.grandTotal}</span>;
  //       }
  //     },
  //     sorter: (a, b) => {
  //       const lastBalanceA =
  //         a.payments.length > 0 ? a.payments[a.payments.length - 1].balance : 0;
  //       const lastBalanceB =
  //         b.payments.length > 0 ? b.payments[b.payments.length - 1].balance : 0;

  //       return lastBalanceA - lastBalanceB;
  //     },
  //   },

  //   {
  //     title: "Due Date",
  //     dataIndex: "dueDate",
  //     sorter: (a, b) => a.dueDate.length - b.dueDate.length,
  //     render: (text, record) => {
  //       const formattedDate = new Date(record.dueDate).toLocaleDateString(
  //         "en-GB",
  //         {
  //           year: "numeric",
  //           month: "2-digit",
  //           day: "2-digit",
  //         }
  //       );
  //       return <span>{formattedDate}</span>;
  //     },
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "payments",
  //     render: (payments, record) => {

  //       if (payments.length > 0) {

  //         const lastPayment = payments[payments.length - 1];
  //         const purchasesDate = new Date(record.purchasesDate);
  //         const dueDate = new Date(record.dueDate);


  //         if (lastPayment.balance === 0) {
  //           return <span className={`badge bg-success-light`}>Paid</span>;
  //         } else if (purchasesDate > dueDate) {

  //           const overdueDays = Math.floor(
  //             (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
  //           );
  //           return (
  //             <span className={`badge bg-danger-light`}>
  //               Overdue by {overdueDays} days
  //             </span>
  //           );
  //         } else {

  //           return (
  //             <span className={`badge bg-warning-light text-warning`}>Partially Paid</span>
  //           );
  //         }
  //       } else {

  //         return <span className={`badge bg-success-light`}>Unpaid</span>;
  //       }
  //     },
  //   },

  //   {
  //     title: "Action",
  //     dataIndex: "action",
  //     render: (text, record) => (
  //       <>
  //         <div className="text-end">
  //           <div className="dropdown dropdown-action">
  //             <Link
  //               to="#"
  //               className="btn-action-icon"
  //               data-bs-toggle="dropdown"
  //               aria-expanded="false"
  //             >
  //               <i className="fas fa-ellipsis-v" />
  //             </Link>
  //             <div className="dropdown-menu dropdown-menu-end">
  //               <Link
  //                 className="dropdown-item"
  //                 to={`/edit-purchases/${record._id}`}
  //               >
  //                 <i className="far fa-edit me-2" />
  //                 Edit
  //               </Link>
  //               <Link
  //                 className="dropdown-item"
  //                 to={`/purchases-details/${record._id}`}
  //               >
  //                 <i className="far fa-eye me-2" />
  //                 View
  //               </Link>
  //               <button
  //                 className="dropdown-item"
  //                 onClick={() => confirmDeletePurchase(record._id)}
  //               >
  //                 <i className="far fa-trash-alt me-2" />
  //                 Delete
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </>
  //     ),
  //     sorter: (a, b) => a.action.length - b.action.length,
  //   },
  // ];

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
      dataIndex: "vendorName",
      sorter: (a, b) => a.vendorName.length - b.vendorName.length,
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
        <Sidebar active={6} />
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* <InvoiceHead setShow={setShow} show={show} /> */}

            <div className="card invoices-tabs-card">
              <div className="invoices-main-tabs">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="invoices-tabs">
                      <ul>
                        <li>
                          <Link to="/all-purchases" className="active">
                            All Purchases
                          </Link>
                        </li>
                        <li>
                          <Link to="/paid-purchases">Paid</Link>
                        </li>
                        <li>
                          <Link to="/overdue-purchases">Overdue</Link>
                        </li>
                        <li>
                          <Link to="/outstanding-purchases">Outstanding</Link>
                        </li>
                        <li>
                          <Link to="/draft-purchases">Draft</Link>
                        </li>
                        <li>
                          <Link to="/recurring-purchases">Recurring</Link>
                        </li>
                        <li>
                          <Link to="/cancelled-purchases">Cancelled</Link>
                        </li>
                        <li>
                          <Link to="/deleted-purchases">Deleted</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body invoiceList">
                    <div className="table-responsive table-hover">
                      <Table
                        pagination={{
                          total: datasource ? datasource.length : 0,

                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        // dataSource={datasource.filter((record) =>
                        //   record?.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
                        //   record?.invoiceNumber?.includes(searchText)
                        // )}
                        dataSource={datasource}
                        rowKey={(record) => record.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Table */}

            {/* Deleted Invoices Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body invoiceList">
                    <h3>Deleted Purchases</h3>
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

        <AddVendor setShow={setShow} show={show} />

        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Purchases</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
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
      </div>
    </>
  );
};

export default Purchases;
