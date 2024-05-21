import React, { useState } from 'react'

import PartyOutstanding from '../../../_components/Reports/IndividualReports/PartyOutstanding';

const PartyOutstandingPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          
            <PartyOutstanding />
        </div>
    )
}

export default PartyOutstandingPage