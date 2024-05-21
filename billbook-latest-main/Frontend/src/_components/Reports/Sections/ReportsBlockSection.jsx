import React from 'react';
import { List } from 'antd';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const ReportsBlockSection = ({ data, heading, icon }) => {

    return (
        <div className='900:w-[31%] 300:w-full 700:w-[48%] '>
            <List
                size="large" className='border-none shadow-xl h-[400px] overflow-y-scroll tailwind-scroll-bar relative overflow-x-hidden'
                header={<p className='font-semibold flex flex-wrap items-center'>
                    <div className='mr-2 bg-[#f6f7f8] flex justify-center items-center border-1 border-[#6885ed] h-[30px] w-[30px] rounded-full'>
                        <FeatherIcon icon={icon} className={"text-[#6885ed]"} />
                    </div>{heading}</p>}
                bordered
                dataSource={data}
                renderItem={(item) => <List.Item>
                    <Link to={`${item?.route}`} className='w-full justify-between !flex text-sm cursor-pointer hover:text-[#6885ed] hover:translate-x-2 transition-transform'>
                        {item?.title}
                        <FeatherIcon icon={"chevron-right"} className={"text-[#6885ed]"} />
                    </Link>
                </List.Item>}
            />
        </div>
    )
}

export default ReportsBlockSection