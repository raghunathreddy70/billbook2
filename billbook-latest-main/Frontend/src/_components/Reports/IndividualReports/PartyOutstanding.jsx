import React, { useState, useEffect  } from 'react'
import FilterBar from '../Components/FilterBar';
import DateRangeFilter from '../Components/DateRangeFilter';
import AntTable from '../Components/AntTable';
import RadioToggle from '../Components/RadioToggle';
// import { PayWiseOutstandingData } from '../Data/PayWiseOutstanding';
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

const PartyOutstanding = () => {
    const { SearchData } = useFiltersSales();
    const [datasource, setDatasource] = useState([]);
    const [filteredDataState, setFilteredDataState] = useState(false);
    const [downloadData, setDownloadData] = useState([]);
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);

    const [placement, SetPlacement] = useState('All');
    const placementChange = (e) => {
        SetPlacement(e.target.value);
    };

    // function DataSourceFilter({ data }) {
    //     return PayWiseOutstandingData.filter(
    //         (record) =>
    //             record.name
    //                 .toLowerCase()
    //                 .includes(searchText.toLowerCase())
    //     )
    // }

    const item1 = [
        {
            label: 'All Categories',
            key: 1
        }
    ];
    const userData = useSelector((state) => state?.user?.userData)
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData(1);
      }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${backendUrl}/api/addCustomer/customers/${userData?.data?._id}`
            ); 
            setCustomers(response.data);
            setLoading(false);
            setTotalPages(response.data?.length);
            setDatasource(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }finally{
            setLoading(false)
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [userData]);
    
    console.log("customers", customers);
    
    const [selectedSearchVar, setSelectedSearchVar] = useState("name");
    const [searchContent, setSearchContent] = useState(null);
    const searchSelectDrop = [
        {
            title: "Name",
            value: "name",
        },
        {
            title: "Contact Number",
            value: "phoneNumber",
        },
        {
            title: "Closing Balance",
            value: "openingBalance",
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
            "Name": item?.name,
            "Contact Number": item?.phoneNumber,
            "Closing Balance": item?.openingBalance, // Format invoiceDate
            // Add more fields as needed
        }));

        // Define CSV headers
        const headers = [
            { label: 'Name', key: 'name' },
            { label: 'Contact Number', key: 'phoneNumber' },
            { label: 'Closing Balance', key: 'openingBalance' },
            // Add more headers as needed
        ];

        handleCSVDownload({ csvData, headers })
    };
    // download data in csv format code goes here 



    // download data in pdf format code goes here 
    const handlePDFDownloadSet = () => {
        // Set up table columns
        const columns = ['Name', 'Contact Number', 'Closing Balance', 'Due Date', 'Total', 'Balance', 'Status'];

        // Set up table rows
        const rows = downloadData.map(item => [
            item?.name,
            item?.phone,
            item?.openingBalance, // Format invoiceDate
            // Add more fields as needed
        ]);
        let heading = toggleTabsState === 0 ? "Party Outstanding Report" : (toggleTabsState === 1 ? "Paid Credit Notes" : (toggleTabsState === 2 ? "Overdue Credit Notes" : "Outstanding Credit Notes"))
        handlePDFDownload({ columns, rows, heading })
    };

    // download data in pdf format code goes here 
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: "Contact Number",
            dataIndex: "phoneNumber",
            sorter: (a, b) => a.phone.length - b.phone.length,
        },
        {
            title: "Closing Balance",
            dataIndex: "openingBalance",
            sorter: (a, b) => a.openingBalance.length - b.openingBalance.length,
        },
    ];

    const filterItemFun = (e) => {
        console.log(e.key)
    }

    const radioData = [
        {
            item: "All"
        },
        {
            item: "To Collect ₹0"
        },
        {
            item: "To Pay ₹0"
        },
    ]

    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <div className='d-flex align-items-start'>
                            <BackButton />
                            <h5 className='reports-h5'>Party Wise Outstanding</h5>
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
                <div className='mb-3'>
                    <RadioToggle radioData={radioData} placement={placement} placementChange={placementChange} />
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card customers">
                            <div className="card-body">
                                <div className="table-responsive table-hover">
                                {showContent && (
                                        <SalesFilters datasource={datasource} 
                                            reversedDataSource={reversedDataSource} searchContent={searchContent}
                                            searchSelectDrop={searchSelectDrop} 
                                            selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource}
                                            setIsFiltered={setIsFiltered} setSearchContent={setSearchContent}
                                            setSelectedSearchVar={setSelectedSearchVar} />
                                    )}
                                    <AntTable 
                                    loading={loading}
                                    fetchData={fetchData}
                                    totalPages={totalPages}
                                    datasource={customers} columns={columns} SearchData={SearchData} reversedDataSource={reversedDataSource}
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

export default PartyOutstanding