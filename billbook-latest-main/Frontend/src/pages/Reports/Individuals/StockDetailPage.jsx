import React, { useState } from 'react'

import StockDetails from '../../../_components/Reports/IndividualReports/StockDetails';

const StockDetailPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
           
            <StockDetails />
        </div>
    )
}

export default StockDetailPage