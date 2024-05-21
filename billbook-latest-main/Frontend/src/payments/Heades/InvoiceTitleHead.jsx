import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import React from 'react';
import { Link } from "react-router-dom";
import useHandleDownload from '../../Hooks/useHandleDownload';
import { format } from 'date-fns';



const InvoiceTitleHead = ({ handleDownloadAllData, toggleContent, showContent, downloadData }) => {

    const { handleCSVDownload, handlePDFDownload } = useHandleDownload();


    // download data in csv format code goes here 
    const handleCSVDownloadSet = () => {
        // Create a CSV-ready data array
        const csvData = downloadData.map(item => ({
            "Invoice Number": item.invoiceNumber,
            "Name": item.customerName,
            "Invoice Date": format(new Date(item.invoiceDate), 'MM/dd/yyyy'), // Format invoiceDate
            "Due Date": format(new Date(item.dueDate), 'MM/dd/yyyy'), // Format dueDate
            "Total ": item.grandTotal,
            "Balance ": item.balance,
            "Status ": item.invoiceStatus,
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
        console.log(downloadData)
        // Set up table columns
        const columns = ['Invoice Number', 'Name', 'Invoice Date', 'Due Date', 'Total', 'Balance', 'Status'];
        // Set up table rows
        const rows = downloadData.map(item => [
            item.invoiceNumber,
            item.customerName,
            format(new Date(item.invoiceDate), 'MM/dd/yyyy'), // Format invoiceDate
            format(new Date(item.dueDate), 'MM/dd/yyyy'), // Format dueDate
            item.grandTotal,
            item.balance,
            item.invoiceStatus
            // Add more fields as needed
        ]);
        handlePDFDownload({ columns, rows })
    };

    // download data in pdf format code goes here 



    return (
        <div className="page-header">
            <div className="content-page-header">
                <h5>Invoices</h5>
                <div className="list-btn">
                    <ul className="filter-list">

                        <li className="">
                            <div className="dropdown dropdown-action">
                                <Link onClick={handleDownloadAllData}
                                    to="#"
                                    className="btn-filters me-2"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span>
                                        <i className="fe fe-download" />
                                        <FeatherIcon icon="download" />
                                    </span>
                                </Link>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <ul className="d-block">
                                        <li>
                                            <Link
                                                className="d-flex align-items-center download-item"
                                                to="#"
                                                download="" onClick={handlePDFDownloadSet}
                                            >
                                                <i className="far fa-file-pdf me-2" />
                                                PDF
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="d-flex align-items-center download-item"
                                                to="#"
                                                download="" onClick={handleCSVDownloadSet}
                                            >
                                                <i className="far fa-file-text me-2" />
                                                CVS
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li>
                            <button className="hide-filters-button"
                                onClick={toggleContent}>
                                {showContent ? 'Hide' : 'Filters'}
                            </button>
                        </li>
                        <li>
                            <Link className="btn btn-primary" to="/add-invoice">
                                <i className="fa fa-plus-circle me-2" aria-hidden="true" />
                                {/* New Invoice */}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default InvoiceTitleHead