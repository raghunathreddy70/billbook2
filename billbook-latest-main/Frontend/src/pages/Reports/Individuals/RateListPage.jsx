import React, { useState } from 'react'

import RateList from '../../../_components/Reports/IndividualReports/RateList';

const RateListPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
           
            <RateList />
        </div>
    )
}

export default RateListPage