import React, { useState } from 'react'

import ItemReportVendor from '../../../_components/Reports/IndividualReports/ItemReportVendor';
const ItemReportPartyVendor = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
           
            <ItemReportVendor />
        </div>
    )
}

export default ItemReportPartyVendor;
