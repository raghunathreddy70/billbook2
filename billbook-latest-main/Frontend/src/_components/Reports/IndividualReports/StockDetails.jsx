import React, { useState, useEffect } from 'react';
import FilterBar from '../Components/FilterBar';
import DateRangeFilter from '../Components/DateRangeFilter';
import AntTable from '../Components/AntTable';
import Select2 from "react-select2-wrapper";
import useReportFilters from '../hooks/useReportsFilters'
import axios from "axios"
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from '../../../Hooks/useHandleDownload';
import SalesFilters from '../../../invoices/filters/SalesFilters';
import useFiltersSales from '../../../invoices/customeHooks/useFiltersSales';
import BackButton from '../../../invoices/Cards/BackButton';
import { backendUrl } from '../../../backendUrl';
import { useSelector } from 'react-redux';

const StockDetails = () => {
    const [datasource, setDatasource] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); 
  console.log("selectedProduct", selectedProduct)
  const { SearchData } = useFiltersSales();
const [filteredDataState, setFilteredDataState] = useState(false);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);

    const userData = useSelector((state) => state?.user?.userData)
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        fetchData(1);
    }, []);

        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${backendUrl}/api/addProduct/products/${userData?.data?._id}`);
                setLoading(false);
                setTotalPages(response.data?.length);
                setProductData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }finally {
                setLoading(false)
            }
        };
    useEffect(() => {
        fetchData();
    }, [userData]);


    useEffect(() => {
        const fetchProductReportDetails = async (selectedProduct) => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/addProduct/productReport/${selectedProduct}`
                );
                setDatasource(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        if (selectedProduct) {
            fetchProductReportDetails(selectedProduct);
        }
    }, [selectedProduct]);

    const handleProductChange = (productId) => {
        setSelectedProduct(productId);
    };

    const productOptions = productData.map((product) => ({
        id: product.productId,
        text: product.itemName,
    }));

    const columns = [
        {
            title: "Date",
            dataIndex: "invoiceDate",
            sorter: (a, b) => a.invoiceDate.length - b.invoiceDate.length,
        },
        {
            title: "Transaction Type",
            dataIndex: "invoiceName",
            sorter: (a, b) => a.invoiceName.length - b.invoiceName.length,
        },
        {
            title: "Qty",
            dataIndex: "quantity",
            sorter: (a, b) => a.quantity.length - b.quantity.length,
        },
        {
            title: "Closing Stock",
            dataIndex: "closingStock",
            sorter: (a, b) => a.closingStock.length - b.closingStock.length,
        },

    ];

    const filterItemFun = (e) => {
        console.log(e.key)
    };

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
                            <h5 className='reports-h5'>Stock Detail Report</h5>
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
                <div className="col-lg-12 col-md-6 col-sm-12">
                    <div className="form-group">
                        <label>Products</label>
                        <Select2
                            className="w-100"
                            data={productOptions}
                            value={selectedProduct} 
                            options={{
                                placeholder: "None",
                            }}
                            onSelect={(event) => handleProductChange(event.target.value)} 
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card customers">
                            <div className="card-body">
                                <div className="table-responsive table-hover">
                                    <AntTable 
                                    loading={loading}
                                    fetchData={fetchData}
                                    totalPages={totalPages}
                          
                                    dateSelectDrop={dateSelectDrop}
                                        datasource={datasource} columns={columns} SearchData={SearchData} reversedDataSource={reversedDataSource}
                                        selectedSearchVar={selectedSearchVar} setSelectedSearchVar={setSelectedSearchVar}
                                        searchContent={searchContent}/> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockDetails;
