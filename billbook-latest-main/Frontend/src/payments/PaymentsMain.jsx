import React, { useState } from 'react'
import PaymentsHead from './Heades/PaymentsHead'
import SalesPayments from './ToggleComponents/SalesPayments'
import PurchasesPayments from './ToggleComponents/PurchasesPayments'
import ExpensesPayments from './ToggleComponents/ExpensesPayments'

const PaymentsMain = () => {

    const [active, setActive] = useState(0);

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <PaymentsHead setActive={setActive} active={active} />
                {active === 0 && <SalesPayments />}
                {active === 1 && <PurchasesPayments />}
                {active === 2 && <ExpensesPayments />}
            </div>
        </div>
    )
}

export default PaymentsMain