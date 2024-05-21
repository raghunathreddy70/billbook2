import React, { useState,useEffect } from 'react'
import AntTable from '../Components/AntTable';
import { ReceivableAgingData } from '../Data/ReceivableAgingData';
import FeatherIcon from "feather-icons-react";
import useReportFilters from '../hooks/useReportsFilters'
import axios from "axios"
import { Link } from "react-router-dom";
import useHandleDownload from '../../../Hooks/useHandleDownload';
import SalesFilters from '../../../invoices/filters/SalesFilters';
import useFiltersSales from '../../../invoices/customeHooks/useFiltersSales';
import BackButton from '../../../invoices/Cards/BackButton';

const ReceivableAgeing = () => {
    const [searchText, setSearchText] = useState("");
    const [datasource, setDatasource] = useState([]);
    const { SearchData } = useFiltersSales();
    const [filters, setFilters] = useState({});
    const [filteredDataState, setFilteredDataState] = useState(false);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [filteredDatasource, setFilteredDatasource] = useState([]);

    const [selectedSearchVar, setSelectedSearchVar] = useState("customerName?.name");
    const [searchContent, setSearchContent] = useState(null);

    const searchSelectDrop = [
        {
            title: 'Customer Name',
            value: "customerName",
        },
        {
            title: '1-15 Days',
            value: "1-15",
        },
        {
            title: "16-30 Days",
            value: "16-30",
        },
        {
            title: "31-45 Days",
            value: "31-45",
        },
        {
            title: "More Than 45 Days",
            value: "45+",
        },
        {
            title: 'Total Amount',
            value: "grandTotal",
        },
        {
            title: "Total",
            value: "total",
        },
    ];
    const item1 = [
        {
            label: 'All Categories',
            key: '1',
        },
    ];

    const item2 = [
        {
            label: 'Cash Sale',
            key: '1',
        },
    ];

    const columns = [
        {
            title: "Customer Name",
            dataIndex: "customerName",
            sorter: (a, b) => a.customerName.length - b.customerName.length,
        },
        {
            title: "1-15 Days",
            dataIndex: "1-15",
        },
        {
            title: "16-30 Days",
            dataIndex: "16-30",
        },
        {
            title: "31-45 Days",
            dataIndex: "31-45",
        },
        {
            title: "More Than 45 Days",
            dataIndex: "45+",
        },
        {
            title: "Total",
            dataIndex: "total",
            sorter: (a, b) => a.total.length - b.total.length,
        },
    ];

    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    // filter function with customer name 
    const reversedDataSource = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();

    useEffect(() => {
        const fetchDownloadData = async () => {
            const data = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();
            let downloadableData = SearchData({ data: data, selectedVar: selectedSearchVar, searchValue: searchContent });
            setDownloadData(downloadableData)
        }
        fetchDownloadData();
    }, [isFiltered, filteredDatasource, searchContent, datasource])

    const { handlePDFDownload, handleCSVDownload } = useHandleDownload()

    // download data in csv format code goes here 
    const handleCSVDownloadSet = () => {

        // Create a CSV-ready data array
        const csvData = downloadData.map(item => ({
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

        handleCSVDownload({ csvData, headers })
    };
    // download data in csv format code goes here 



    // download data in pdf format code goes here 
    const handlePDFDownloadSet = () => {
        // Set up table columns
        const columns = ['Item Name', 'Manufacturing Date', 'Purchase Pice', 'Selling Price', 'Current Stock'];

        // Set up table rows
        const rows = downloadData.map(item => [
            item?.invoiceNumber,
            item?.customerName?.name,
            item?.invoiceDate, // Format invoiceDate
            item?.dueDate, // Format dueDate
            item?.grandTotal,
            item?.balance,
            item?.invoiceStatus
            // Add more fields as needed
        ]);
        let heading = toggleTabsState === 0 ? "Item Batch Report" : (toggleTabsState === 1 ? "Paid Credit Notes" : (toggleTabsState === 2 ? "Overdue Credit Notes" : "Outstanding Credit Notes"))
        handlePDFDownload({ columns, rows, heading })
    };

    // download data in pdf format code goes here 
    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <div className='d-flex align-items-start'>
                            <BackButton />
                            <h5 className='reports-h5'>Receivable Ageing Report</h5>
                        </div>
                        <div className='reports-filter-parent'>
                            {/* <AntButton type={"box"} text={"Hide out of stock batches"} hideOutFilter={hideOutFilter} setHideOutFilter={setHideOutFilter} /> */}
                            {/* <DatePickerReport handleDateChange={handleDateChange} /> */}
                            <div className="list-btn">
                                <ul className="filter-list flex space-x-0">
                                    <li>
                                        <button className="btn btn-primary 700:me-2 300:me-0"
                                            onClick={toggleContent}>
                                            <span className="me-2 flex-a">
                                                <FeatherIcon icon="filter" />
                                                {showContent ? 'Hide' : 'Filters'}
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
                                        <SalesFilters datasource={datasource} 
                                            reversedDataSource={reversedDataSource} searchContent={searchContent}
                                            searchSelectDrop={searchSelectDrop} selectedDateVar={selectedDateVar}
                                            selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource}
                                            setIsFiltered={setIsFiltered} setSearchContent={setSearchContent}
                                            setSelectedDateVar={setSelectedDateVar} setSelectedSearchVar={setSelectedSearchVar} />
                                    )}
                                    <AntTable SearchData={SearchData} reversedDataSource={reversedDataSource}
                                    datasource={ReceivableAgingData} columns={columns} 
                                    selectedSearchVar={selectedSearchVar} setSelectedSearchVar={setSelectedSearchVar}
                                    searchContent={searchContent}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReceivableAgeing