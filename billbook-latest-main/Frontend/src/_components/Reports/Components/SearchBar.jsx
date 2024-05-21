import { Input, Space } from 'antd'
import React from 'react'

const SearchBar = ({ searchText, setSearchText }) => {
    return (
        <div className='flex justify-between w-[36%] '>
            <Input
                className="searh-input"
                placeholder="Search by name or phone number"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                    width: 300,
                    marginBottom: 0,
                    padding: "6px 12px",
                    border: "none",
                    boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px",
                }}
            />
            <Space>
                <button
                    onClick={(e) => { e.preventDefault; setSearchText("") }}
                    size="small"
                    style={{
                        width: 90,
                        padding: 7,
                        background: "#ed2020",
                        border: "none",
                        boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
                        borderRadius: 7,
                        color: "#fff",
                        position: "relative",
                        left: "-58px",
                    }}
                >
                    Reset
                </button>
            </Space>
        </div>
    )
}

export default SearchBar