import { DatePicker } from 'antd'
import React from 'react'

const DatePickerReport = ({ handleDateChange }) => {


    return (
        <DatePicker onChange={handleDateChange} placeholder='Items expiring in' />
    )
}

export default DatePickerReport