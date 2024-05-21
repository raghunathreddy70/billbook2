import React, { useState } from 'react'
import Header from '../../../layouts/Header';
import Sidebar from '../../../layouts/Sidebar';
import PaymentOutCBReportSummary from './PaymentOutCBReportSummary';

const CashAndBankPaymentOut = () => {
    const [menu, setMenu] = useState(false);
    const toggleMobileMenu = () => {
        setMenu(!menu);
    };
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            <Header onMenuClick={(value) => setMenu(!menu)} />
            <Sidebar active={8} />
            <PaymentOutCBReportSummary/>
        </div>
    )
}
export default CashAndBankPaymentOut
