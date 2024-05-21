import { Input } from 'antd'
import React from 'react'

const SearchBox = ({ state, setState, selectedVar, dataSource, setDataState, setIsFiltered }) => {

    const handleSearch = (e) => {
        const { value } = e.target;
        setState(value)
    }


    return (
        <Input placeholder="Search in selected column" value={state} onChange={handleSearch} className='300:w-[180px] 1200:w-[250px] 300:text-[13px] 300:h-[30px]' />
    )
}

export default SearchBox