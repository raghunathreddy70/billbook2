import React, { useState } from 'react'

import PurchasesSummaryCategory from '../../../_components/Reports/IndividualReports/PurchasesSummaryCategory';

const PurchasesSummaryCategoryPage = () => {
    const [menu, setMenu] = useState(false);
    const toggleMobileMenu = () => {
        setMenu(!menu);
    };
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            
            <PurchasesSummaryCategory />
        </div>
    )
}

export default PurchasesSummaryCategoryPage;
