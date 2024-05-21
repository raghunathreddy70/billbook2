import { Select } from 'antd'
import React from 'react'

const SelectInput = ({ handleChartMonthsChange, setState, setErrorState, state, value, name }) => {

    let monthsOptions = [6, 12, 18, 24, 30, 36]

    return (
        <div className='dashbord-chart-month-select'>
            <Select
                // defaultValue={value}
                value={value}
                style={{
                    width: 100,
                }}
                name={name}
                onChange={(e) => handleChartMonthsChange({ e, setState, setErrorState, state, name })}
                options={monthsOptions?.map((item) => {
                    return {
                        value: item,
                        label: item,
                    }
                })
                }
            />
        </div>
    )
}

export default SelectInput