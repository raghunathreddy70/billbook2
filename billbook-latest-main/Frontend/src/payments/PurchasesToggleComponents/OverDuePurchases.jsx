import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import "../../_components/antd.css";
import { Table } from "antd";
import {
    onShowSizeChange,
    itemRender,
} from "../../_components/paginationfunction";

import axios from "axios";
import PurchasesTitleHead from "../Heades/PurchasesTitleHead";
import PurchasesToggle from "../Heades/PurchasesToggle";

const OverDuePurchases = ({ active, setActive }) => {
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
            <div className="w-full">
                <div className="page-wrapper ml-0">
                    <div className="content container-fluid p-0">
                        {/* Page Header */}
                        <PurchasesTitleHead currencyOptions={currencyOptions} handleCheckboxChange={handleCheckboxChange} isEnabled={isEnabled} />
                        {/* /Page Header */}

                        {/* <InvoiceHead setShow={setShow} show={show} /> */}

                        <PurchasesToggle active={active} setActive={setActive} />

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

                    </div>
                </div>
            </div>
        </>
    );
}

export default OverDuePurchases