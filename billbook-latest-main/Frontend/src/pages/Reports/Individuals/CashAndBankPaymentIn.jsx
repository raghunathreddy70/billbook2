import React, { useState } from 'react'
import PaymentInCBReportSummary from './PaymentInCBReportSummary';

const CashAndBankPaymentIn = () => {
    const [menu, setMenu] = useState(false);
    const toggleMobileMenu = () => {
        setMenu(!menu);
    };
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            <PaymentInCBReportSummary/>
        </div>
    )
}

export default CashAndBankPaymentIn
