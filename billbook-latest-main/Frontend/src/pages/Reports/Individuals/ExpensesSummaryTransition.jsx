import React, { useEffect, useState } from 'react'
import axios from "axios"
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import useHandleDownload from '../../../Hooks/useHandleDownload';
import SalesFilters from '../../../invoices/filters/SalesFilters';
import useFiltersSales from '../../../invoices/customeHooks/useFiltersSales';
import BackButton from '../../../invoices/Cards/BackButton';
import AntTable from '../../../_components/Reports/Components/AntTable';
import { useSelector } from 'react-redux';
import { backendUrl } from '../../../backendUrl';
const ExpensesSummaryTransition = () => {

    const userData = useSelector((state) => state?.user?.userData)
    const { SearchData } = useFiltersSales();
    const [datasource, setDatasource] = useState([]);
    const [hideOutFilter, setHideOutFilter] = useState(false);
    const [backupData, setBackupData] = useState([]);
    const [downloadData, setDownloadData] = useState([]);
    const [selectedDateVar, setSelectedDateVar] = useState("expenseDate");
    const [toggleTabsState, setToggleTabsState] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredDatasource, setFilteredDatasource] = useState([]);
    const [selectedSearchVar, setSelectedSearchVar] = useState("expenseCategory");
    const [searchContent, setSearchContent] = useState(null);
    const dateSelectDrop = [
        {
            title: 'Date',
            value: "expenseDate",
        },
    ]
    const searchSelectDrop = [
        {
            title: 'EXPENSE NUMBER',
            value: "expenseNumber",
        },
        {
            title: 'CATEGORY',
            value: "expenseCategory",
        },
        {
            title: 'PAYMENT MODE',
            value: "paymentMode",
        },
        {
            title: 'TOTAL AMOUNT',
            value: "grandTotal",
        },
    ]


   
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1); 
    useEffect(() => {
        fetchData(1);
      }, []); 
    async function fetchData(page) {
        try {
            setLoading(true)
          const response = await axios.get(`${backendUrl}/api/Expense/expense/${userData?.data?._id}`);
          setLoading(false);
          setTotalPages(response.data?.length);
          setDatasource(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }finally {
            setLoading(false)
        }
      }
      
    useEffect(() => {
        fetchData();
      }, [userData]);

    const columns = [
        {
            title: "DATE",
            dataIndex: "expenseDate",
            sorter: (a, b) => a.expenseDate.length - b.expenseDate.length,
            render: (text, record) => {
                const formattedDate = new Date(record.expenseDate).toLocaleDateString(
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
            title: "EXPENSE NUMBER",
            dataIndex: "expenseNumber",
            sorter: (a, b) => a.expenseNumber.length - b.expenseNumber.length,
        },
        {
            title: 'CATEGORY',
            dataIndex: 'expenseCategory',
            sorter: (a, b) => (a.expenseCategory?.expensecategoryName || '').localeCompare(b.expenseCategory?.expensecategoryName || ''),
            render: (expenseCategory) => expenseCategory ? expenseCategory.expensecategoryName : '-'
        },
        {
            title: "PAYMENT MODE",
            dataIndex: "paymentMode",
            sorter: (a, b) => a.paymentMode.length - b.paymentMode.length,
        },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "grandTotal",
            sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
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
            "DATE": item?.expenseDate ,
            "EXPENSE NUMBER": item?.expenseNumber,
            "CATEGORY": item?.expenseCategory,
            "PAYMENT MODE": item?.paymentMode,
            "TOTAL AMOUNT": item?.grandTotal,
            // Add more fields as needed
        }));

        // Define CSV headers
        const headers = [
            { label: 'DATE', key: 'expenseDate' },
            { label: 'EXPENSE NUMBER', key: 'expenseNumber' },
            { label: 'CATEGORY', key: 'expenseCategory' },
            { label: 'PAYMENT MODE', key: 'paymentMode' },
            { label: 'TOTAL AMOUNT', key: 'grandTotal' },
            // Add more headers as needed
        ];

        handleCSVDownload({ csvData, headers })
    };
    // download data in csv format code goes here 



    // download data in pdf format code goes here 
    const handlePDFDownloadSet = () => {
        // Set up table columns
        const columns = ['DATE', 'EXPENSE NUMBER', 'CATEGORY', 'PAYMENT MODE', 'TOTAL AMOUNT'];

        // Set up table rows
        const rows = downloadData.map(item => [
            item?.expenseDate && format(new Date(item?.expenseDate), 'MM/dd/yyyy'),
            item?.expenseNumber,
            item?.expenseCategory,
            item?.paymentMode,
            item?.grandTotal,
            // Add more fields as needed
        ]);
        let heading = toggleTabsState === 0 ? "Expenses Summary Transition Report" : (toggleTabsState === 1 ? "Paid Credit Notes" : (toggleTabsState === 2 ? "Overdue Credit Notes" : "Outstanding Credit Notes"))
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
                            <h5 className='reports-h5'>Expense Transition Report</h5>
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
                                     loading={loading}
                                     fetchData={fetchData}
                                     totalPages={totalPages}
                                        //  DataSourceFilter={DataSourceFilter} 
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

export default ExpensesSummaryTransition