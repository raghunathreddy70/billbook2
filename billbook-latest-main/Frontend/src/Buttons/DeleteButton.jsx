import React from 'react'
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const DeleteButton = () => {
    return (
        <>
            <div className=" bg-[#ffeded] p-2 rounded">
                <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
            </div>
        </>
    )
}

export default DeleteButton