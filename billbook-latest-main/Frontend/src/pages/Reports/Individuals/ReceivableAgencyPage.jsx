import React, { useState } from 'react'
import ReceivableAgeing from '../../../_components/Reports/IndividualReports/ReceivableAgeing';

const ReceivableAgencyPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            
            <ReceivableAgeing />
        </div>
    )
}

export default ReceivableAgencyPage