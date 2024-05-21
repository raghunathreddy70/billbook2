import React, { useEffect, useState } from 'react'
import { ItemBatchReportData } from '../Data/ItemBatchReportData';
import AntTable from '../Components/AntTable';
import DatePickerReport from '../Components/DatePicker';
import AntButton from '../Components/AntButton';
import axios from "axios"
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from '../../../Hooks/useHandleDownload';
import SalesFilters from '../../../invoices/filters/SalesFilters';
import useFiltersSales from '../../../invoices/customeHooks/useFiltersSales';
import BackButton from '../../../invoices/Cards/BackButton';
import { backendUrl } from '../../../backendUrl';


const ItemBatchReport = () => {
    const { SearchData } = useFiltersSales();
    const [datasource, setDatasource] = useState([]);
    const [hideOutFilter, setHideOutFilter] = useState(false);
    const [backupData, setBackupData] = useState([]);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("addingDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);
    const [selectedSearchVar, setSelectedSearchVar] = useState("itemName");
    const [searchContent, setSearchContent] = useState(null);
    const dateSelectDrop = [
        {
            title: 'Manufacturing Date',
            value: "addingDate",
        },
    ]
    const searchSelectDrop = [
        {
            title: 'Item Name',
            value: "itemName",
        },
        {
            title: 'Manufacturing Date',
            value: "addingDate",
        },
        {
            title: 'Purchase Pice',
            value: "purchasePrice",
        },
        {
            title: 'Selling Price',
            value: "salesPrice",
        },
    ]

    const [productData, setProductData] = useState([])

    const fetchProductData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/addProduct/products`);
            setDatasource(response.data);
            setProductData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        fetchProductData();
    }, []);

    console.log("productData", productData)



    const columns = [
        {
            title: "Item Name",
            dataIndex: "itemName",
            sorter: (a, b) => a.itemName.length - b.itemName.length,
        },
        // {
        //     title: "Batch Number",
        //     dataIndex: "batchNum",
        //     sorter: (a, b) => a.batchNum.length - b.batchNum.length,
        // },
        // {
        //     title: "Expiry Date",
        //     dataIndex: "expiryDate",
        //     sorter: (a, b) => a.expiryDate.length - b.expiryDate.length,
        // },
        {
            title: "Manufacturing Date",
            dataIndex: "addingDate",
            render: (text, record) => {
                const formattedDate = new Date(record.addingDate).toLocaleDateString(
                    "en-GB",
                    {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }
                );
                return (
                    <Link to={`/item-details/${record._id}`}>
                        <h2 className="table-avatar">{formattedDate}</h2>
                    </Link>
                )
            },
            sorter: (a, b) => a.addingDate.length - b.addingDate.length,
        },
        // {
        //     title: "MRP",
        //     dataIndex: "mrp",
        //     sorter: (a, b) => a.mrp.length - b.mrp.length,
        // },

        {
            title: "Purchase Pice",
            dataIndex: "purchasePrice",
            sorter: (a, b) => a.purchasePrice.length - b.purchasePrice.length,
        },
        {
            title: "Selling Price",
            dataIndex: "salesPrice",
            sorter: (a, b) => a.salesPrice.length - b.salesPrice.length,
        },
        {
            title: "Current Stock",
            dataIndex: "openingStock",
            sorter: (a, b) => a.openingStock.length - b.openingStock.length,
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
            "Item Name": item?.itemName,
            "Manufacturing Date": item?.addingDate,
            "Purchase Pice": item?.purchasePrice,
            "Selling Price": item?.salesPrice,
            "Current Stock": item?.openingStock,
            // Add more fields as needed
        }));

        // Define CSV headers
        const headers = [
            { label: 'Item Name', key: 'itemName' },
            { label: 'Manufacturing Date', key: 'addingDate' },
            { label: 'Purchase Pice', key: 'purchasePrice' },
            { label: 'Selling Price', key: 'salesPrice' },
            { label: 'Current Stock', key: 'openingStock' },
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
            item?.itemName,
            item?.addingDate,
            item?.purchasePrice,
            item?.salesPrice,
            item?.openingStock,
            item?.balance,
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
                    <div className="content-page-header ">
                        <div className='d-flex align-items-start'>
                            <BackButton />
                            <h5 className='reports-h5'>Item Batch Report</h5>
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
                                <div className="table-responsive table-hover ">
                                    {showContent && (
                                        <SalesFilters datasource={datasource} dateSelectDrop={dateSelectDrop} reversedDataSource={reversedDataSource}
                                            selectedDateVar={selectedDateVar}
                                            setSelectedDateVar={setSelectedDateVar}
                                            searchContent={searchContent} searchSelectDrop={searchSelectDrop} selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource} setIsFiltered={setIsFiltered} setSearchContent={setSearchContent} setSelectedSearchVar={setSelectedSearchVar} />
                                    )}
                                    <AntTable
                                        //  DataSourceFilter={DataSourceFilter} 
                                        dateSelectDrop={dateSelectDrop}
                                        datasource={productData} columns={columns} SearchData={SearchData} reversedDataSource={reversedDataSource}
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

export default ItemBatchReport