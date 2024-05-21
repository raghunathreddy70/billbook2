import React, { useState } from 'react'
import StockSummary from '../../../_components/Reports/IndividualReports/StockSummary';

const StockSummaryPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
           
            <StockSummary />
        </div>
    )
}

export default StockSummaryPage