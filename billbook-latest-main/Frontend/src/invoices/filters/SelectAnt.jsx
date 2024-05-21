import { Select } from 'antd'
import React from 'react'

const SelectAnt = ({ dropList, state, setState }) => {
    return (
        <div className='w-[116px]'>
            <Select
                value={state}
                placeholder="Select"
                // style={{ width: 120 }}
                onChange={(val) => setState(val)}
                options={dropList?.map((item) => {
                    return { value: item?.value, label: item?.title }
                })}
                className='text-[13px] 700:w-[120px] 300:w-[80px]'
            />
        </div>
    )
}

export default SelectAnt