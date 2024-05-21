import React, { useState } from 'react'

import BalanceSheet from '../../../_components/Reports/IndividualReports/BalanceSheet';

const BalanceSheetPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
           
            <BalanceSheet />
        </div>
    )
}

export default BalanceSheetPage