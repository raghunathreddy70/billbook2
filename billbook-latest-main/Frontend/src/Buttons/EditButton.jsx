import React from 'react'
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const EditButton = () => {
    return (
        <>
            <div className="bg-[#e1ffed] p-2 rounded">
                <FeatherIcon icon="edit" className="text-[#1edd6a] " />
            </div>
        </>
    )
}

export default EditButton