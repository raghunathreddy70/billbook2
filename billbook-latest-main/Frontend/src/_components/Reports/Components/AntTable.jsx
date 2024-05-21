import React from 'react';
import { Input, Pagination, Space, Table } from "antd";
import { itemRender, onShowSizeChange } from '../../paginationfunction';

const AntTable = ({ datasource, DataSourceFilter, columns,SearchData,reversedDataSource,selectedSearchVar,searchContent ,totalPages,loading ,fetchData}) => {
    
    return (
        <Table
            // pagination={datasource && datasource.length}
            pagination={{
               
                    pageSize:10,
                    total:totalPages,
                    onChange:(page)=>{
                      fetchData(page)
                    },
                // total: SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent }).length,
                // showTotal: (total, range) =>
                //     `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                // showSizeChanger: true,
                // onShowSizeChange: onShowSizeChange,
                // itemRender: itemRender,
            }}
            columns={columns}
            loading={loading}
            // dataSource={datasource}

            dataSource={SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent })}
            rowKey={(record) => record.id}
        />
    )
}

export default AntTable