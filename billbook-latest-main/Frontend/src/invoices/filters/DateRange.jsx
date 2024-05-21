import React from 'react'
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const DateRange = ({ dataSource, setDatasource, setIsFiltered, dateVar }) => {

    const handleChange = (dates) => {
        setIsFiltered(false)
        if (dates) {
            const [startDate, endDate] = dates;
            let startDateData = startDate?.$d;
            let endDateData = endDate?.$d;
            let returnedData = filterDataByDateRange({ data: dataSource, startDate: startDateData, endDate: endDateData, dateVar });
            setIsFiltered(true);
            setDatasource(returnedData)
        } else {
            setIsFiltered(false);
        }
    }

    function filterDataByDateRange({ data, startDate, endDate, dateVar }) {
        return data.filter(item => {
            console.log(item?.[dateVar])
            const itemDate = new Date(item?.[dateVar]);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    }


    return (
        <>
            <RangePicker onChange={handleChange} className='300:w-[180px] 1200:w-[250px] 300:text-[13px] 300:h-[30px]' />
        </>
    )
}

export default DateRange