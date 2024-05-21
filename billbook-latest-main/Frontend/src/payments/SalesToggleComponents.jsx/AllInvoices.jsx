import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";
import "../../_components/antd.css";
import { Button, Table, Typography } from "antd";
import {
    itemRender,
} from "../../_components/paginationfunction";
import axios from "axios";
import { DatePicker } from 'antd';
import InvoiceTitleHead from "../Heades/InvoiceTitleHead";
import InvoiceToggle from "../Heades/InvoiceToggle";
const { RangePicker } = DatePicker;
const { Text } = Typography;

const AllInvoices = ({ active, setActive }) => {



    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [deletedInvoices, setDeletedInvoices] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [amount, setAmount] = useState("");
    const [searchText, setSearchText] = useState("");
    const [customerNameFilter, setCustomerNameFilter] = useState(""); // New state for customer name filter
    const handleSearch = (value) => {
        setSearchText(value);
    };
    const [downloadData, setDownloadData] = useState([]);
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [dateRange, setDateRange] = useState([]);
    const [filteredDatasource, setFilteredDatasource] = useState([]);

    useEffect(() => {
        if (toggleTabsState !== 1 && toggleTabsState !== 2 && toggleTabsState !== 3) {
            setToggleTabsState(0)
        }
    }, [toggleTabsState])

    useEffect(() => {
        let downloadableData = filteredDatasource ? [...filteredDatasource].reverse() : [];
        setDownloadData(downloadableData)
    }, [filteredDatasource])

    const handleReset = () => {
        setSearchText("");
    };
    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

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

    const handleDeleteInvoice = async (invoiceId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/addInvoice/invoices/delete/${invoiceId}`
            );

            if (response.status === 200) {
                console.log("Invoice deleted successfully");
                const deletedInvoice = datasource.find(
                    (item) => item._id === invoiceId
                );
                setDeletedInvoices((prevDeletedInvoices) => [
                    ...prevDeletedInvoices,
                    deletedInvoice,
                ]);
                setDatasource((prevData) =>
                    prevData.filter((item) => item._id !== invoiceId)
                );
                setFilteredDatasource((prevData) =>
                    prevData.filter((item) => item._id !== invoiceId)
                );
            } else {
                console.error("Failed to delete invoice:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/addInvoice/invoices")
            .then((response) => {
                console.log("invoices", response.data);
                setDatasource(response.data);
                setFilteredDatasource(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);


    // filter function with customer name 
    const handleCustomerNameFilterChange = (e) => {
        const value = e.target.value;
        setCustomerNameFilter(value);

        const filteredData = filterData(datasource, dateRange, value, customerNameFilter);
        setFilteredDatasource(filteredData);
    };
    // Function to filter data based on date range and customer name
    const filterData = (data, dateRange, customerNameFilter) => {
        return data.filter((record) => {
            const invoiceDate = new Date(record.invoiceDate);
            const dateInRange =
                (!dateRange[0] || invoiceDate >= dateRange[0]) &&
                (!dateRange[1] || invoiceDate <= dateRange[1]);

            const customerNameMatch =
                typeof record.customerName.name === 'string' &&
                record.customerName.name.toLowerCase().includes(customerNameFilter.toLowerCase());

            return dateInRange && customerNameMatch;
        });
    };
    // filter function with customer name 

    const reversedDataSource = filteredDatasource ? [...filteredDatasource].reverse() : [];


    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        // Filter invoices based on the selected date range
        const filteredData = datasource.filter((record) => {
            const invoiceDate = new Date(record.invoiceDate);
            return invoiceDate >= dates[0] && invoiceDate <= dates[1];
        });
        setFilteredDatasource(filteredData);
    };

    const confirmDeleteInvoice = (invoiceId) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            handleDeleteInvoice(invoiceId);
        }
    };

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/addInvoice/invoices")
            .then((response) => {
                console.log("invoices", response.data);
                setDatasource(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        axios
            .get("http://localhost:8000/api/addInvoice/newDeletedInvoice/invoices")
            .then((response) => {
                console.log("deletedinvoice", response.data);
                setDeletedInvoices(response.data);
            })
            .catch((error) => {
                console.error("Error fetching deleted invoices:", error);
            });
    }, []);

    // Functions for the download excel
    const handleDownloadFilteredData = () => {
        const filteredDataWorkbook = XLSX.utils.book_new();
        const filteredDataWorksheet = XLSX.utils.json_to_sheet(filteredDatasource);
        XLSX.utils.book_append_sheet(filteredDataWorkbook, filteredDataWorksheet, 'FilteredData');
        XLSX.writeFile(filteredDataWorkbook, 'filtered_data.xlsx');
    };

    const handleDownloadAllData = () => {
        const allDataWorkbook = XLSX.utils.book_new();
        const allDataWorksheet = XLSX.utils.json_to_sheet(datasource);
        XLSX.utils.book_append_sheet(allDataWorkbook, allDataWorksheet, 'AllData');
        XLSX.writeFile(allDataWorkbook, 'all_data.xlsx');
    };
    // Functions for the download excel

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
    const deletedInvoicesColumns = [
        {
            title: "Invoice ID",
            dataIndex: "invoiceNumber",
            sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
        },
        {
            title: "Invoice To",
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
            dataIndex: "invoiceDate",
            sorter: (a, b) => a.invoiceDate.length - b.invoiceDate.length,
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
            title: "Total Amount",
            dataIndex: ["grandTotal"],
            sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
        },
        {
            title: "Balance",
            dataIndex: "balance",
            sorter: (a, b) => a.balance.length - b.balance.length,
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
            title: 'Status',
            dataIndex: 'invoiceStatus',
            sorter: (a, b) => a.invoiceStatus.length - b.invoiceStatus.length,
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
                                    to={`/edit-invoice/${record._id}`}
                                >
                                    <i className="far fa-edit me-2" />
                                    Edit
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to={`/invoice-details/${record._id}`}
                                >
                                    <i className="far fa-eye me-2" />
                                    View
                                </Link>
                                <button
                                    className="dropdown-item"
                                    onClick={() => confirmDeleteInvoice(record._id)}
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
            title: "Invoice ID",
            dataIndex: "invoiceNumber",
            sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
        },
        {
            title: "Invoice To",
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
                </h2>
            ),
            sorter: (a, b) => a.customerName.length - b.customerName.length,
        },
        {
            title: "Created On",
            dataIndex: "invoiceDate",
            sorter: (a, b) => a.invoiceDate.length - b.invoiceDate.length,
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
            title: "Total Amount",
            dataIndex: ["grandTotal"],
            sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
        },
        {
            title: "Balance",
            dataIndex: "balance",
            sorter: (a, b) => a.balance.length - b.balance.length,
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
            title: 'Status',
            dataIndex: 'invoiceStatus',
            sorter: (a, b) => a.invoiceStatus.length - b.invoiceStatus.length,
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
                                    to={`/edit-invoice/${record._id}`}
                                >
                                    <i className="far fa-edit me-2" />
                                    Edit
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to={`/invoice-details/${record._id}`}
                                >
                                    <i className="far fa-eye me-2" />
                                    View
                                </Link>
                                <button
                                    className="dropdown-item"
                                    onClick={() => confirmDeleteInvoice(record._id)}
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
        <div className="page-wrapper ml-0 pt-[20px]">
            <div className="content container-fluid p-0">
                <InvoiceTitleHead setShow={setShow} show={show} showContent={showContent} toggleContent={toggleContent} downloadData={downloadData} />

                <InvoiceToggle active={active} setActive={setActive} />
                {/* Table */}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card-table">
                            <div className="card-body invoiceList">
                                <div className="table-responsive table-hover">
                                    <div className="table-filter">
                                        {showContent && (
                                            <div className="row">
                                                <div className="col-md-6 my-2">
                                                    <RangePicker onChange={handleDateRangeChange} />
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Customer Name"
                                                        value={customerNameFilter}
                                                        onChange={handleCustomerNameFilterChange}
                                                    />
                                                    {dateRange.length > 0 && (
                                                        <>
                                                            <Text>
                                                                Total Invoices after filter: {filteredDatasource.length}
                                                            </Text>
                                                            <Button onClick={handleDownloadFilteredData} style={{ marginLeft: 10 }} className="my-2">
                                                                Download Filtered Data
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Table
                                        pagination={{
                                            total: reversedDataSource.length,
                                            showTotal: (total, range) =>
                                                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                            showSizeChanger: true,
                                            itemRender: itemRender,
                                        }}
                                        columns={columns}
                                        dataSource={reversedDataSource}
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
    )
}

export default AllInvoices