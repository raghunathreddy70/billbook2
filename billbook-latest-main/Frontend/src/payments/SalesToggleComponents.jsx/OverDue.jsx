import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Table from "../_components/Datatable/datatable";
import "../../_components/antd.css";
import { Button, Modal } from "antd";
import { Table, DatePicker, Typography } from "antd";
import {
    onShowSizeChange,
    itemRender,
} from "../../_components/paginationfunction";
import axios from "axios";
import * as XLSX from "xlsx";
import InvoiceTitleHead from "../Heades/InvoiceTitleHead";
import InvoiceToggle from "../Heades/InvoiceToggle";
const { RangePicker } = DatePicker;
const { Text } = Typography;

const OverDue = ({ active, setActive }) => {

    const [menu, setMenu] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false);
    const [datasource, setDatasource] = useState([])
    const [filteredDatasource, setFilteredDatasource] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [downloadData, setDownloadData] = useState([]);
    const [toggleTabsState, setToggleTabsState] = useState(0);


    useEffect(() => {
        if (toggleTabsState !== 1 && toggleTabsState !== 2 && toggleTabsState !== 3) {
            setToggleTabsState(0)
        }
    }, [toggleTabsState])

    useEffect(() => {
        let downloadableData = filteredDatasource ? [...filteredDatasource].reverse() : [];
        setDownloadData(downloadableData)
    }, [filteredDatasource])



    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleReset = () => {
        setSearchText("");
    };
    const [customerNameFilter, setCustomerNameFilter] = useState("");
    const handleCustomerNameFilterChange = (e) => {
        const value = e.target.value;
        setCustomerNameFilter(value);

        const filteredData = filterData(datasource, dateRange, value, customerNameFilter);
        setFilteredDatasource(filteredData);
    };
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
    const toggleMobileMenu = () => {
        setMenu(!menu);
    };
    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log("selectedRowKeys changed: ", selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // const datasource = Data?.Data;
    // console.log(datasource);

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // useEffect(() => {
    //   axios
    //     .get("http://localhost:8000/api/addInvoice/invoices")
    //     .then((response) => {
    //       const paidInvoices = response.data.filter(
    //         (invoice) => invoice.invoiceStatus === 'PAID'
    //       );
    //       setDatasource(paidInvoices);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching data:", error);
    //     });
    // }, []);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/addInvoice/invoices")
            .then((response) => {
                const paidInvoices = response.data.filter(
                    (invoice) => invoice.invoiceStatus === "PARTIALLY PAID"
                );
                setDatasource(paidInvoices);
                setFilteredDatasource(paidInvoices); // Initialize filteredDatasource with all paid invoices
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);

        // Filter invoices based on the selected date range
        const filteredData = datasource.filter((record) => {
            const invoiceDate = new Date(record.invoiceDate);
            return invoiceDate >= dates[0] && invoiceDate <= dates[1];
        });

        setFilteredDatasource(filteredData);
    };

    const handleDownloadFilteredData = () => {
        const filteredDataWorkbook = XLSX.utils.book_new();
        const filteredDataWorksheet = XLSX.utils.json_to_sheet(filteredDatasource);
        XLSX.utils.book_append_sheet(
            filteredDataWorkbook,
            filteredDataWorksheet,
            "FilteredData"
        );
        XLSX.writeFile(filteredDataWorkbook, "filtered_data.xlsx");
    };

    const handleDownloadAllData = () => {
        const allDataWorkbook = XLSX.utils.book_new();
        const allDataWorksheet = XLSX.utils.json_to_sheet(datasource);
        XLSX.utils.book_append_sheet(allDataWorkbook, allDataWorksheet, "AllData");
        XLSX.writeFile(allDataWorkbook, "all_data.xlsx");
    };
    console.log("paidinvioces", datasource)
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

    const columns = [
        {
            title: "Invoice ID",
            dataIndex: "invoiceNumber",
            // render: (text, record) => (
            //   // <Link to="/invoice-details" className="invoice-link">
            //   //   {record.Invoice}
            //   // </Link>
            // ),
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

                    {/* <Link to="/profile">
              {record.customerName} <span>{record.email}</span>
            </Link> */}
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
            dataIndex: "payments",
            // render: (payments) => {
            //   const lastPayment = payments[payments.length - 1];
            //   const lastPaymentBalance = lastPayment ? lastPayment.balance : 0;

            //   return <span>{lastPaymentBalance}</span>;
            // },
            // render: (payments, record) => {
            //   if (payments.length > 0) {
            //     const lastPayment = payments[payments.length - 1];
            //     const lastPaymentBalance = lastPayment ? lastPayment.balance : 0;
            //     return <span>{lastPaymentBalance}</span>;
            //   } else {
            //     return <span>{record.grandTotal}</span>; 
            //   }
            // },
            // sorter: (a, b) => {
            //   const lastBalanceA =
            //     a.payments.length > 0 ? a.payments[a.payments.length - 1].balance : 0;
            //   const lastBalanceB =
            //     b.payments.length > 0 ? b.payments[b.payments.length - 1].balance : 0;

            //   return lastBalanceA - lastBalanceB;
            // },
        },
        // {
        //   title: "Due Date",
        //   dataIndex: "dueDate",
        //   sorter: (a, b) => a.dueDate.length - b.dueDate.length,
        //   render: (text, record) => {
        //     const formattedDate = new Date(record.dueDate).toLocaleDateString(
        //       "en-GB",
        //       {
        //         year: "numeric",
        //         month: "2-digit",
        //         day: "2-digit",
        //       }
        //     );
        //     return <span>{formattedDate}</span>;
        //   },
        // },
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
    const handleDownloadSingleData = (record) => {
        const singleDataWorkbook = XLSX.utils.book_new();
        const singleDataWorksheet = XLSX.utils.json_to_sheet([record]);
        XLSX.utils.book_append_sheet(
            singleDataWorkbook,
            singleDataWorksheet,
            "SingleData"
        );
        XLSX.writeFile(singleDataWorkbook, "single_data.xlsx");
    };
    return (
        <>

            <div className="page-wrapper ml-0">
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
                                                                <Button onClick={toggleContent} classNames="ResetButton" style={{ marginLeft: 10, background: "rgb(237, 32, 32)" }} className="my-2" >
                                                                    {showContent ? 'Reset' : 'Filters'}
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Table
                                            pagination={{
                                                total: filteredDatasource ? filteredDatasource.length : 0,
                                                showTotal: (total, range) =>
                                                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                                showSizeChanger: true,
                                                itemRender: itemRender,
                                            }}
                                            rowSelection={rowSelection}
                                            columns={columns}
                                            dataSource={filteredDatasource}
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

            <div className="modal custom-modal fade" id="delete_modal" role="dialog">
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

        </>
    );
}

export default OverDue