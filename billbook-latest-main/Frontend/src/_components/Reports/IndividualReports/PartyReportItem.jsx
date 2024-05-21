import React, { useState } from 'react'
import FilterBar from '../Components/FilterBar';
import DateRangeFilter from '../Components/DateRangeFilter';
import AntTable from '../Components/AntTable';
import { PartyReportByItem } from '../Data/PartyReportByItemData';

const PartyReportItem = () => {

    const [searchText, setSearchText] = useState("");
    const [datasource, setDatasource] = useState([]);

    function DataSourceFilter({ data }) {
        return PartyReportByItem.filter(
            (record) =>
                record.partyName
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
        )
    }

    const item1 = [
    ];

    const columns = [
        {
            title: "Party Name",
            dataIndex: "partyName",
            sorter: (a, b) => a.partyName.length - b.partyName.length,
        },
        {
            title: "Sales Quantity",
            dataIndex: "salesQty",
            sorter: (a, b) => a.salesQty.length - b.salesQty.length,
        },
        {
            title: "Sales Amount",
            dataIndex: "salesAmt",
            sorter: (a, b) => a.salesAmt.length - b.salesAmt.length,
        },
        {
            title: "Purchase Quantity",
            dataIndex: "purchaseQty",
            sorter: (a, b) => a.purchaseQty.length - b.purchaseQty.length,
        },
        {
            title: "Purchase Amount",
            dataIndex: "purchaseAmt",
            sorter: (a, b) => a.purchaseAmt.length - b.purchaseAmt.length,
        },
    ];

    const filterItemFun = (e) => {
        console.log(e.key)
    }


    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <h5 className='reports-h5'>Party Report By Item</h5>
                        <div className='reports-filter-parent'>
                            <FilterBar items={item1} filterItemFun={filterItemFun} title={"Select Item"} />
                            <DateRangeFilter />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card customers">
                            <div className="card-body">
                                <div className="table-responsive table-hover">
                                    <AntTable DataSourceFilter={DataSourceFilter} datasource={PartyReportByItem} columns={columns} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartyReportItem