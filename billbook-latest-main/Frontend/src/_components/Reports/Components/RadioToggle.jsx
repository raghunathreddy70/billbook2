import React from 'react';
import { Radio, Select } from 'antd';

const RadioToggle = ({ placement, placementChange, radioData }) => {
    return (
        <Radio.Group value={placement} onChange={placementChange}>
            {radioData?.map((radioItem, i) => (
                <Radio.Button key={i} value={radioItem.item} className='text-[#d9d9d9]'>
                    {radioItem.item}
                </Radio.Button>
            ))}
        </Radio.Group>
    )
}

export default RadioToggle
