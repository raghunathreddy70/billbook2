import React from 'react';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const DateRangeFilter = ({ DataSourceFilter, filterDataByDateRange, datasource, setDatasource, setFilteredDataState }) => {

    const handleChange = (dates) => {
        let data = DataSourceFilter({ data: datasource })
        if (dates) {
            const [startDate, endDate] = dates;
            let startDateData = startDate?.$d;
            let endDateData = endDate?.$d;
            let returnedData = filterDataByDateRange(data, startDateData, endDateData);
            setFilteredDataState(true)
            setDatasource(returnedData)
        } else {
            setFilteredDataState(false)
        }
    }

    return (
        <RangePicker onChange={handleChange} />
    )
}

export default DateRangeFilter