import React, { useState } from 'react'

import ItemReportParty from '../../../_components/Reports/IndividualReports/ItemReportParty';

const ItemReportPartyPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            
            <ItemReportParty />
        </div>
    )
}

export default ItemReportPartyPage