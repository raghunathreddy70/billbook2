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
import { useSelector } from 'react-redux';

const PurchasesSummaryCategory = () => {
    const userData = useSelector((state) => state?.user?.userData)
    const { SearchData } = useFiltersSales();
    const [datasource, setDatasource] = useState([]);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("purchasesDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);
    // const [selectedDateVar, setSelectedDateVar] = useState("creditnotesDate");
    const [selectedSearchVar, setSelectedSearchVar] = useState("vendorName");
    const [searchContent, setSearchContent] = useState(null);
    const dateSelectDrop = [
        {
            title: 'Purchase Date',
            value: "purchasesDate",
        }
    ];
    const searchSelectDrop = [
        {
            title: 'Purchase ID',
            value: "purchaseNumber",
        },
        {
            title: 'Party Saley',
            value: "vendorName",
        },
        {
            title: 'Amount',
            value: "grandTotal",
        },
      
        {
            title: "Invoice Type",
            value: "purchaseName",
        },
       
    ];

    function DataSourceFilter({ data }) {
        return SalesSummaryCategoryData.filter(
            (record) =>
                record.partySale
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
        )
    }
    useEffect(() => {
        fetchData(1);
    }, []);
   
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${backendUrl}/api/addPurchases/purchases/${userData?.data?._id}`);
                setLoading(false);
                setDatasource(response.data);
                setTotalPages(response.data?.length);
                // setFilteredDatasource(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }finally{
                setLoading(false)
            }
        };
    useEffect(() => {
        fetchData();
    }, [userData]); 
    

    console.log("datasource,dd", datasource);

    const columns = [
        {
            title: "Purchase ID",
            dataIndex: "purchaseNumber",
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
                    <Link to={`/invoice-details/${record._id}`}>
                        <span>{formattedDate}</span>
                    </Link>
                );
            },
        },
        {
            title: "Party Saley",
            dataIndex: "vendorName",
           
        },
        {
            title: "Amount",
            dataIndex: "grandTotal",
        },
        {
            title: "Invoice Type",
            dataIndex: "purchaseName",
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
            "Purchase Date": item?.purchasesDate,
            "Purchase ID": item?.purchaseNumber,
            "Party Saley": item?.vendorName, // Format vendorName
            "Amount ": item?.grandTotal,
            "Balance ": item?.balance,
            "Invoice Type": item?.purchaseName,
            "Purchases Status ": item?.purchaseStatus,
            // Add more fields as needed
        }));

        // Define CSV headers
        const headers = [
            { label: 'Purchase Date', key: 'purchasesDate' },
            { label: 'Purchase ID', key: 'purchaseNumber' },
            { label: 'Party Saley', key: 'vendorName' },
            { label: 'Due Date', key: 'dueDate' },
            { label: 'Amount', key: 'grandTotal' },
            { label: 'Balance', key: 'balance' },
            { label: 'Invoice Type', key: 'purchaseName' },
            { label: 'Purchases Status', key: 'purchaseStatus' },
            // Add more headers as needed
        ];

        handleCSVDownload({ csvData, headers });
    };
    // download data in csv format code goes here

    // download data in pdf format code goes here
    const handlePDFDownloadSet = () => {
        // Set up table columns
        const columns = ['Purchase Date', 'Purchase ID', 'Party Saley', 'Due Date', 'Amount', 'Balance', 'Purchases Status'];

        // Set up table rows
        const rows = downloadData.map((item) => [
            item?.purchasesDate,
            item?.purchaseNumber,
            item?.vendorName, // Format invoiceDate
            item?.dueDate, // Format dueDate
            item?.grandTotal,
            item?.balance,
            item?.purchaseStatus
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
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    // download data in pdf format code goes here
    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <div className="d-flex align-items-start">
                            <BackButton />
                            <h5 className="reports-h5">Purchases Summary - Category Wise</h5>
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

export default PurchasesSummaryCategory