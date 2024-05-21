import React from 'react'

const IndividualSectionTitle = ({ title }) => {
    return (
        <div className='h-[60px] rounded-md shadow-md flex items-center p-4 bg-white'>
            <h3 className='text-[18px] font-semibold flex '>{title}</h3>
        </div>
    )
}

export default IndividualSectionTitle