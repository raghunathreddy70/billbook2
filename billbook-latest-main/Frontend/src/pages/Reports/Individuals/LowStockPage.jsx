import React, { useState } from 'react'

import LowStock from '../../../_components/Reports/IndividualReports/LowStock';

const LowStockPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          
            <LowStock />
        </div>
    )
}

export default LowStockPage