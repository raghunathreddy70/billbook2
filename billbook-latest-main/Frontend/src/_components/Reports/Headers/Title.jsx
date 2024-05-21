import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import React from 'react'

const Title = () => {
    return (
        <div className='h-[60px] rounded-md shadow-md flex items-center p-4 bg-white'>
            <h3 className='text-[18px] font-semibold flex '><FeatherIcon icon="file-minus" className={"mr-2 text-[#feb019]"} />Reports</h3>
        </div>
    )
}

export default Title
