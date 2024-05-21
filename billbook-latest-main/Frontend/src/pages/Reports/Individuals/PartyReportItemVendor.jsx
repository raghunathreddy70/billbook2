import React, { useState } from 'react'
import Header from '../../../layouts/Header';
import Sidebar from '../../../layouts/Sidebar';
import PartyReportVendors from '../../../_components/Reports/IndividualReports/PartyReportVendors';

const PartyReportItemVendor = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            <Header onMenuClick={(value) => setMenu(!menu)} />
            <Sidebar active={8} />
            <PartyReportVendors />
        </div>
    )
}

export default PartyReportItemVendor;