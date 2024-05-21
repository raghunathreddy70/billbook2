import React, { useEffect, useState } from 'react'
import AntTable from '../Components/AntTable'
import FilterBar from '../Components/FilterBar'
import DateRangeFilter from '../Components/DateRangeFilter'
// import { SalesSummaryData } from '../Data/SalesSummaryData'
import useReportFilters from '../hooks/useReportsFilters'
import axios from "axios"
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from '../../../Hooks/useHandleDownload';
import SalesFilters from '../../../invoices/filters/SalesFilters';
import useFiltersSales from '../../../invoices/customeHooks/useFiltersSales';
import BackButton from '../../../invoices/Cards/BackButton';
import { backendUrl } from '../../../backendUrl'
import { useSelector } from 'react-redux'

const SalesSummary = () => {

    const { SearchData } = useFiltersSales();
    const [datasource, setDatasource] = useState([]);
    const [showTotalSales, setShowTotalSales] = useState(false);
    const [totalAmt, setTotalAmt] = useState(0);
    const [filterVars, setFilterVars] = useState({});
    const [filters, setFilters] = useState({});
    const [filteredDataState, setFilteredDataState] = useState(false);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);

    const { filterDataByDateRange, addFilters, filteredData, DataSourceFilter, GetTotalAmt, getFiltersState } = useReportFilters({ filters, setFilteredDataState, filterVars, setFilterVars, setTotalAmt })


    const [selectedSearchVar, setSelectedSearchVar] = useState("customerName?.name");
    const [searchContent, setSearchContent] = useState(null);
    const dateSelectDrop = [
        {
            title: 'Invoice Date',
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

    const userData = useSelector((state) => state?.user?.userData)
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        fetchData(1);
      }, []);
        const fetchData = async (page) => {
            try {
                setLoading(true)
                const response = await axios.get(`${backendUrl}/api/addInvoice/invoices/${userData?.data?._id}?page=${page}&pageSize=10`);
                setLoading(false);
                setTotalPages(response.data?.length);
                setDatasource(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }finally{
                setLoading(false)
            }
        };
    
    useEffect(() => {
        fetchData();
    }, [userData]); 
    



    const columns = [
        {
            title: "Invoice Date",
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
            title: "Invoice No.",
            dataIndex: "invoiceNumber",
            // sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
        },
        {
            title: "Customer Name",
            dataIndex: "customerName",
            render: (customerName) => (
                <h2 className="table-avatar">
                    {/* <Link to="#" className="avatar avatar-sm me-2">
                  {customerName && customerName.image && (
                    <img
                      className="avatar-img rounded-circle"
                      src={`${customerName.image.url}`}
                      alt="User"
                    />
                  )}
                </Link> */}
                    <ul>
                        <li>{customerName ? customerName?.name : ""}</li>
                    </ul>
                </h2>
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
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: "Total Amount",
            dataIndex: "grandTotal",
        },
        {
            title: "Balance",
            dataIndex: "balance",
        },
        {
            title: "Invoice Type",
            dataIndex: "invoiceName",
        },
        {
            title: 'Status',
            dataIndex: 'invoiceStatus',
            render: (text) => (
                <span style={{ backgroundColor: getStatusColor(text), color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
                    {text}
                </span>
            ),
        },
    ];

    const filterItemFun = (e, name) => {
        if (e.key !== "1" && name === "partyName") {
            setShowTotalSales(true)
        } else {
            setShowTotalSales(false)
        }
        let newFilter = filterVars[name]?.find((party) => party?.key === parseInt(e.key))?.label
        addFilters(filters, newFilter, name, setFilters)
    }

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
    const columns = ['Invoice Number', 'Name', 'Invoice Date', 'Due Date', 'Total', 'Balance', 'Status'];

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
                            <h5 className='reports-h5'>Sales Summary</h5>
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
                        {/* <div className='flex w-[70%] gap-3'>
                            <FilterBar items={filterVars["partyName"]} filterItemFun={filterItemFun} title={"Search party by name or number"} name={"partyName"} />
                            <DateRangeFilter DataSourceFilter={DataSourceFilter} datasource={datasource} filterDataByDateRange={filterDataByDateRange} setDatasource={setDatasource} setFilteredDataState={setFilteredDataState} />
                            <FilterBar items={filterVars["invoiceStatus"]} filterItemFun={filterItemFun} title={"Invoice Status"} name={"invoiceStatus"} />
                            <FilterBar items={filterVars["invoiceType"]} filterItemFun={filterItemFun} title={"Invoice type"} name={"invoiceType"} />
                        </div> */}
                    </div>
                </div>
                {showTotalSales && <div className='mb-3'>
                    <p>Total Sales: ₹ {totalAmt}</p>
                </div>}
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
                                        loading={loading}
                                        fetchData={fetchData}
                                        totalPages={totalPages}
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

export default SalesSummary