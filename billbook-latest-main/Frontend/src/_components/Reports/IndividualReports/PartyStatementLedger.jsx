import React, { useState } from 'react'
import FilterBar from '../Components/FilterBar';
import DateRangeFilter from '../Components/DateRangeFilter';
import AntTable from '../Components/AntTable';
import { PartyStatementLedgerData } from '../Data/PartyStatementLedgerData';

const PartyStatementLedger = () => {
    const [searchText, setSearchText] = useState("");
    const [datasource, setDatasource] = useState([]);
    const [showTotalSales, setShowTotalSales] = useState(false);

    function DataSourceFilter({ data }) {
        return PartyStatementLedgerData.filter(
            (record) =>
                record.transactionType
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
        )
    }

    const item1 = [
        {
            label: 'Cash Sale',
            key: 1
        }
    ];

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            sorter: (a, b) => a.date.length - b.date.length,
        },
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            sorter: (a, b) => a.transactionType.length - b.transactionType.length,
        },
        {
            title: "Transaction No.",
            dataIndex: "transactionNum",
            sorter: (a, b) => a.transactionNum.length - b.transactionNum.length,
        },
        {
            title: "Original Invoice No.",
            dataIndex: "originalInvoiceNo",
            sorter: (a, b) => a.originalInvoiceNo.length - b.originalInvoiceNo.length,
        },
        {
            title: "Credit",
            dataIndex: "credit",
            sorter: (a, b) => a.credit.length - b.credit.length,
        },
        {
            title: "Debit",
            dataIndex: "debit",
            sorter: (a, b) => a.debit.length - b.debit.length,
        },
        {
            title: "TDS By Party",
            dataIndex: "tdsParty",
            sorter: (a, b) => a.tdsParty.length - b.tdsParty.length,
        },
        {
            title: "TDS By Self",
            dataIndex: "tdsSelf",
            sorter: (a, b) => a.tdsSelf.length - b.tdsSelf.length,
        },
        {
            title: "Payment Mode",
            dataIndex: "paymentMode",
            sorter: (a, b) => a.paymentMode.length - b.paymentMode.length,
        },
    ];

    const filterItemFun = (e) => {
        if (e.key === "1") {
            setShowTotalSales(true)
        } else {
            setShowTotalSales(false)
        }
    }

    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <h5 className='reports-h5'>Party Statement (Ledger)</h5>
                        <div className='reports-filter-parent'>
                            <FilterBar items={item1} filterItemFun={filterItemFun} title={"Select party by name or number"} />
                            <DateRangeFilter />
                        </div>
                    </div>
                </div>
                {showTotalSales && <div className='mb-3 flex space-x-5'>
                    <p>Party Name: <b>Cash Sale</b></p>
                    <p>Opening Balance: <b>0</b></p>
                    <p>Closing Balance: <b>0</b></p>
                </div>}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card customers">
                            <div className="card-body">
                                <div className="table-responsive table-hover">
                                    <AntTable DataSourceFilter={DataSourceFilter} datasource={PartyStatementLedgerData} columns={columns} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartyStatementLedger