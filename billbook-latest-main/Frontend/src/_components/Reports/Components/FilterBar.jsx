import { Button, Dropdown, Space } from 'antd'
import React from 'react';
import { DownOutlined } from '@ant-design/icons';

const FilterBar = ({ items, filterItemFun, title, name }) => {
    return (
        <Dropdown menu={{ items, onClick: (e) => filterItemFun(e, name) }} className='w-[24%] text-[#d9d9d9] border-[#d9d9d9] bg-[#ffffff]'>
            <Button>
                <Space className='justify-between w-full overflow-hidden'>
                    {title}
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    )
}

export default FilterBar