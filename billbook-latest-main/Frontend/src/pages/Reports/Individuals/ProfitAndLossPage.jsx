import React, { useState } from 'react'

import ProfitAndLoss from '../../../_components/Reports/IndividualReports/ProfitAndLoss';

const ProfitAndLossPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            
            <ProfitAndLoss />
        </div>
    )
}

export default ProfitAndLossPage