import React, { useState } from 'react'

import PartyReportItem from '../../../_components/Reports/IndividualReports/PartyReportCustomer';

const PartyReportItemPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
           
            <PartyReportItem />
        </div>
    )
}

export default PartyReportItemPage