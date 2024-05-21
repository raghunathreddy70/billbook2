import React, { useState } from 'react'

import SalesSummary from '../../../_components/Reports/IndividualReports/SalesSummary';

const SalesSummaryPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
           
            <SalesSummary />
        </div>
    )
}

export default SalesSummaryPage