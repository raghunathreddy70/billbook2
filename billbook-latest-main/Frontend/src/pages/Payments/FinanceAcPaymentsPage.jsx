import React, { useState } from 'react'
import PaymentsMain from '../../payments/PaymentsMain';

const FinanceAcPaymentsPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            <PaymentsMain />
        </div>
    )
}

export default FinanceAcPaymentsPage