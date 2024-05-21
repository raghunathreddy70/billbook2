import React, { useState, useEffect } from 'react'
import DateRangeFilter from '../Components/DateRangeFilter';
import AntTable from '../Components/AntTable';
import { SalesSummaryCategoryData } from '../Data/SalesSummaryCategoryData';
import axios from "axios"
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from '../../../Hooks/useHandleDownload';
import SalesFilters from '../../../invoices/filters/SalesFilters';
import useFiltersSales from '../../../invoices/customeHooks/useFiltersSales';
import BackButton from '../../../invoices/Cards/BackButton';
import { backendUrl } from '../../../backendUrl';

const SalesSummaryCategory = () => {
    const { SearchData } = useFiltersSales();
    const [datasource, setDatasource] = useState([]);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);
    // const [selectedDateVar, setSelectedDateVar] = useState("creditnotesDate");
    const [selectedSearchVar, setSelectedSearchVar] = useState("customerName?.name");    const [searchContent, setSearchContent] = useState(null);
    const dateSelectDrop = [
        {
            title: 'Created On',
            value: "invoiceDate",
        },
        {
            title: 'Due Date',
            value: "dueDate",
        }
    ];
    const searchSelectDrop = [
        {
            title: 'Invoice No.',
            value: "invoiceNumber",
        },
        {
            title: 'Invoice To',
            value: "customerName?.name",
        },
        {
            title: 'Total Amount',
            value: "grandTotal",
        },
        {
            title: 'Balance',
            value: "balance",
        },
    ];
    
    useEffect(() => {
        axios
            .get(`${backendUrl}/api/addInvoice/invoices`)
            .then((response) => {
                setDatasource(response.data);
                // setFilteredDatasource(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    });


    const columns = [
        {
            title: "Invoice Date",
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
                return (
                    <Link to={`/invoice-details/${record._id}`}>
                        <span>{formattedDate}</span>
                    </Link>
                );
            },
        },
        {
            title: "Invoice No.",
            dataIndex: "invoiceNumber",
            sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
        },
        // {
        //     title: "Party Sale",
        //     dataIndex: "partySale",
        //     sorter: (a, b) => a.partySale.length - b.partySale.length,
        // },
        {
            title: "Party Saley",
            dataIndex: "customerName",
            render: (customerName, record) => (
                <span>{customerName?.name || "N/A"}</span>
            ),
            sorter: (a, b) => (a.customerName?.name || "").localeCompare(b.customerName?.name || ""),
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
                return (
                    <Link to={`/invoice-details/${record._id}`}>
                        <span>{formattedDate}</span>
                    </Link>
                );
            },
        },
        {
            title: "Amount",
            dataIndex: "grandTotal",
            sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
        },
        {
            title: "Balance",
            dataIndex: "balance",
            sorter: (a, b) => a.balance.length - b.balance.length,
        },
        {
            title: "Invoice Type",
            dataIndex: "invoiceName",
            sorter: (a, b) => a.invoiceName.length - b.invoiceName.length,
        },
        {
            title: "Invoice Status",
            dataIndex: "invoiceStatus",
            sorter: (a, b) => a.invoiceStatus.length - b.invoiceStatus.length,
        },
    ];

    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    // filter function with customer name
    const reversedDataSource = isFiltered
        ? [...filteredDatasource].reverse()
        : [...datasource].reverse();

    useEffect(() => {
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
    }, [isFiltered, filteredDatasource, searchContent, datasource]);

    const { handlePDFDownload, handleCSVDownload } = useHandleDownload();

    // download data in csv format code goes here
    const handleCSVDownloadSet = () => {
        // Create a CSV-ready data array
        const csvData = downloadData.map((item) => ({
            "Invoice Number": item?.invoiceNumber,
            "Name": item?.customerName?.name,
            "Invoice Date": item?.invoiceDate, // Format invoiceDate
            "Due Date": item?.dueDate, // Format dueDate
            "Total ": item?.grandTotal,
            "Balance ": item?.balance,
            "Status ": item?.invoiceStatus,
            // Add more fields as needed
        }));

        // Define CSV headers
        const headers = [
            { label: 'Invoice Number', key: 'invoiceNumber' },
            { label: 'Name', key: 'customerName' },
            { label: 'Invoice Date', key: 'invoiceDate' },
            { label: 'Due Date', key: 'dueDate' },
            { label: 'Total', key: 'grandTotal' },
            { label: 'Balance', key: 'balance' },
            { label: 'Status', key: 'invoiceStatus' },
            // Add more headers as needed
        ];

        handleCSVDownload({ csvData, headers });
    };
    // download data in csv format code goes here

    // download data in pdf format code goes here
    const handlePDFDownloadSet = () => {
        // Set up table columns
        const columns = ['Invoice Number', 'Name', 'Invoice Date', 'Due Date', 'Total', 'Balance', 'Status'];
        
        // Set up table rows
        const rows = downloadData.map((item) => [
            item?.invoiceNumber,
            item?.customerName?.name,
            item?.invoiceDate, // Format invoiceDate
            item?.dueDate, // Format dueDate
            item?.grandTotal,
            item?.balance,
            item?.invoiceStatus
            // Add more fields as needed
        ]);
        let heading =
            toggleTabsState === 0
                ? "Item Batch Report"
                : toggleTabsState === 1
                    ? "Paid Credit Notes"
                    : toggleTabsState === 2
                        ? "Overdue Credit Notes"
                        : "Outstanding Credit Notes";
        handlePDFDownload({ columns, rows, heading });
    };

    // download data in pdf format code goes here
    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <div className="d-flex align-items-start">
                            <BackButton />
                            <h5 className="reports-h5">Sales Summary - Category Wise</h5>
                        </div>
                        <div className="reports-filter-parent">
                            <div className="list-btn">
                                <ul className="filter-list flex space-x-0">
                                    <li>
                                        <button
                                            className="btn btn-primary 700:me-2 300:me-0"
                                            onClick={toggleContent}
                                        >
                                            <span className="me-2 flex-a">
                                                <FeatherIcon icon="filter" />
                                                {showContent ? "Hide" : "Filters"}
                                            </span>
                                        </button>
                                    </li>
                                    <li className="">
                                        <div className="dropdown dropdown-action">
                                            <Link
                                                to="#"
                                                className="btn-filters 700:me-2 300:me-0"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <span>
                                                    <FeatherIcon icon="download" />
                                                </span>
                                            </Link>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <ul className="d-block">
                                                    <li>
                                                        <Link
                                                            className="d-flex align-items-center download-item"
                                                            to="#"
                                                            download=""
                                                            onClick={handlePDFDownloadSet}
                                                        >
                                                            <i className="far fa-file-pdf me-2" />
                                                            PDF
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            className="d-flex align-items-center download-item"
                                                            to="#"
                                                            download=""
                                                            onClick={handleCSVDownloadSet}
                                                        >
                                                            <i className="far fa-file-text me-2" />
                                                            CSV
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card customers">
                            <div className="card-body">
                                <div className="table-responsive table-hover">
                                    {showContent && (
                                        <SalesFilters datasource={datasource} dateSelectDrop={dateSelectDrop}
                                            reversedDataSource={reversedDataSource} searchContent={searchContent}
                                            searchSelectDrop={searchSelectDrop} selectedDateVar={selectedDateVar}
                                            selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource}
                                            setIsFiltered={setIsFiltered} setSearchContent={setSearchContent}
                                            setSelectedDateVar={setSelectedDateVar} setSelectedSearchVar={setSelectedSearchVar} />
                                    )}
                                    <AntTable
                                        dateSelectDrop={dateSelectDrop}
                                        datasource={datasource} columns={columns} SearchData={SearchData} reversedDataSource={reversedDataSource}
                                        selectedSearchVar={selectedSearchVar} setSelectedSearchVar={setSelectedSearchVar}
                                        searchContent={searchContent} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesSummaryCategory