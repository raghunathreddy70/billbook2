import { Button } from 'antd'
import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import React from 'react'

const AntButton = ({ type, text, hideOutFilter, setHideOutFilter }) => {
    return (
        <Button className='flex text-[#d9d9d9] border-[#d9d9d9] bg-[#ffffff]' onClick={() => setHideOutFilter(!hideOutFilter)}>{text} <FeatherIcon icon={type} className={"ml-2"} /></Button>
    )
}

export default AntButton