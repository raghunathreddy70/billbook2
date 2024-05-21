import React from 'react'
import { useState } from 'react';

import CustomerStatementLedger from '../../../_components/Reports/IndividualReports/CustomerStatementLedger';

const CustomerStatementPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          
            <CustomerStatementLedger />
        </div>
    )
}

export default CustomerStatementPage