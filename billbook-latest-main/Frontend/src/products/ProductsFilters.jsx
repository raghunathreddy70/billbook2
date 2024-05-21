import React from 'react';
import { Typography } from "antd";
import SelectAnt from '../invoices/filters/SelectAnt';
import DateRange from '../invoices/filters/DateRange';
import SearchBox from '../invoices/filters/SearchBox';
import useFiltersSales from '../invoices/customeHooks/useFiltersSales';
const { Text } = Typography;

const ProductsFilters = ({ dateSelectDrop, setSelectedDateVar, datasource, setFilteredDatasource, setIsFiltered, selectedDateVar, searchSelectDrop, selectedSearchVar, setSelectedSearchVar, searchContent, setSearchContent, reversedDataSource }) => {
    const { SearchData } = useFiltersSales();

    return (
        <div className="col-md-12 mt-2 mb-3">
            <div className="align-items-center flex flex-wrap 700:gap-6 300:gap-2 filter-sales">
                {dateSelectDrop &&
                    <div className="dashbord-chart-month-select space-x-2 flex">
                        <SelectAnt dropList={dateSelectDrop} state={selectedDateVar} setState={setSelectedDateVar} />
                        <DateRange dataSource={datasource} setDatasource={setFilteredDatasource} setIsFiltered={setIsFiltered} dateVar={selectedDateVar} />
                    </div>
                }
                <div className="dashbord-chart-month-select space-x-2 flex">
                    <SelectAnt dropList={searchSelectDrop} state={selectedSearchVar} setState={setSelectedSearchVar} />
                    <SearchBox state={searchContent} setState={setSearchContent} selectedVar={selectedSearchVar} dataSource={reversedDataSource} setIsFiltered={setIsFiltered} setDataState={setFilteredDatasource} />
                </div>
                <div>
                    {SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent })?.length > 0 && (
                        <>
                            <Text className='700:text-[14px] 300:text-[13px]'>
                                Total Invoices For the selected filter: {SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent }).length}
                            </Text>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductsFilters