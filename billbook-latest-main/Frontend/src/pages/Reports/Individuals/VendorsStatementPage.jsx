import React from 'react'
import { useState } from 'react';
import Header from '../../../layouts/Header';
import Sidebar from '../../../layouts/Sidebar';
import VendorStatementLedger from '../../../_components/Reports/IndividualReports/VendorStatementLedger';

const VendorsStatementPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            <Header onMenuClick={(value) => setMenu(!menu)} />
            <Sidebar active={8} />
            <VendorStatementLedger />
        </div>
    )
}

export default VendorsStatementPage