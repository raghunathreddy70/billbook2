import React, { useState, useEffect } from 'react'
import AntTable from '../Components/AntTable';
// import { LowStockData } from '../Data/lowStockData';
import axios from "axios"
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from '../../../Hooks/useHandleDownload';
import SalesFilters from '../../../invoices/filters/SalesFilters';
import useFiltersSales from '../../../invoices/customeHooks/useFiltersSales';
import BackButton from '../../../invoices/Cards/BackButton';
import { backendUrl } from '../../../backendUrl';
import { useSelector } from 'react-redux';

const LowStock = () => {
    const { SearchData } = useFiltersSales();
    const [datasource, setDatasource] = useState([]);
    const [totalStock, setTotalStock] = useState(0);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("addingDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);
    const [selectedSearchVar, setSelectedSearchVar] = useState("itemName");
    const [searchContent, setSearchContent] = useState(null);

    function TotalStock(data) {
        return data.reduce((stock, num) => {
            return stock + num?.stockValue
        }, 0)
    }

    const searchSelectDrop = [
        {
            title: 'Item Name',
            value: "itemName",
        },
        {
            title: 'Item Code',
            value: "itemCode",
        },
        // {
        //     title: 'Stock Quantity',
        //     value: "openingStock",
        // },
        // {
        //     title: 'Low Stock Level',
        //     value: "lowStockQuantity",
        // },
        {
            title: 'Stock Value',
            value: "stockValue",
        },
    ]

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

    const userData = useSelector((state) => state?.user?.userData)
    const [productdata, setProductData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData(1);
      }, []);
    const fetchData = async (page) => {
      try {
        
        setLoading(true)
        const response = await axios.get(`${backendUrl}/api/addProduct/products/${userData?.data?._id}`);
        setDatasource(response.data);
        setLoading(false);
        setTotalPages(response.data?.length);
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setLoading(false)
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [userData]);

    console.log("productdata", productdata)

    const columns = [
        {
            title: "Item Name",
            dataIndex: "itemName",
            sorter: (a, b) => a.itemName.length - b.itemName.length,
        },
        {
            title: "Item Code",
            dataIndex: "itemCode",
            sorter: (a, b) => a.itemCode.length - b.itemCode.length,
        },
        {
            title: "Stock Quantity",
            dataIndex: "openingStock",
            sorter: (a, b) => a.openingStock.length - b.openingStock.length,
        },
        {
            title: "Low Stock Level",
            dataIndex: "lowStockQuantity",
            sorter: (a, b) => a.lowStockQuantity.length - b.lowStockQuantity.length,
        },
        {
            title: "Stock Value",
            dataIndex: "stockValue",
            sorter: (a, b) => a.stockValue.length - b.stockValue.length,
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
            "Item Code": item?.itemCode,
            "Stock Quantity": item?.openingStock,
            "Low Stock Level": item?.lowStockQuantity,
            "Stock Value": item?.stockValue,
            // Add more fields as needed
        }));

        // Define CSV headers
        const headers = [
            { label: 'Item Name', key: 'itemName' },
            { label: 'Item Code', key: 'itemCode' },
            { label: 'Stock Quantity', key: 'openingStock' },
            { label: 'Low Stock Level', key: 'lowStockQuantity' },
            { label: 'Stock Value', key: 'stockValue' },
            // Add more headers as needed
        ];

        handleCSVDownload({ csvData, headers })
    };
    // download data in csv format code goes here 



    // download data in pdf format code goes here 
    const handlePDFDownloadSet = () => {
        // Set up table columns
        const columns = ['Item Name', 'Item Code', 'Stock Quantity', 'Low Stock Level', 'Stock Value'];

        // Set up table rows
        const rows = downloadData.map(item => [
            item?.itemName,
            item?.itemCode,
            item?.openingStock,
            item?.lowStockQuantity,
            item?.stockValue,
            // Add more fields as needed
        ]);
        let heading = toggleTabsState === 0 ? "Low Stock Report" : (toggleTabsState === 1 ? "Paid Credit Notes" : (toggleTabsState === 2 ? "Overdue Credit Notes" : "Outstanding Credit Notes"))
        handlePDFDownload({ columns, rows, heading })
    };

    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <div className='d-flex align-items-start'>
                            <BackButton />
                            <h5 className='reports-h5'>Low Stock Summary</h5>
                        </div>
                        <div className='reports-filter-parent'>
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
                <div className='mb-3'>
                    <p>Total Stock Value: ₹ {totalStock}</p>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card customers">
                            <div className="card-body">
                                <div className="table-responsive table-hover">
                                    {showContent && (
                                        <SalesFilters datasource={datasource} reversedDataSource={reversedDataSource}
                                            selectedDateVar={selectedDateVar}
                                            setSelectedDateVar={setSelectedDateVar} searchContent={searchContent}
                                            searchSelectDrop={searchSelectDrop} selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource} setIsFiltered={setIsFiltered} setSearchContent={setSearchContent} setSelectedSearchVar={setSelectedSearchVar} />
                                    )}
                                    <AntTable SearchData={SearchData}
                                    loading={loading}
                                    fetchData={fetchData}
                                    totalPages={totalPages}
                                        datasource={datasource} columns={columns} reversedDataSource={reversedDataSource}
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

export default LowStock