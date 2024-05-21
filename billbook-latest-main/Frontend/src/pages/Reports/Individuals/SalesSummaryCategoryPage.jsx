import React, { useState } from 'react'

import SalesSummaryCategory from '../../../_components/Reports/IndividualReports/SalesSummaryCategory';

const SalesSummaryCategoryPage = () => {
    const [menu, setMenu] = useState(false);
    const toggleMobileMenu = () => {
        setMenu(!menu);
    };
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          
            <SalesSummaryCategory />
        </div>
    )
}

export default SalesSummaryCategoryPage
