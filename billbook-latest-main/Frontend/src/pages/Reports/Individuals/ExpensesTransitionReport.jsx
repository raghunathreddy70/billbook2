import React, { useState } from 'react'

import ExpensesSummaryTransition from './ExpensesSummaryTransition';
const ExpensesTransitionReport = () => {
    const [menu, setMenu] = useState(false);
    return (

        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          
            <ExpensesSummaryTransition />
        </div>
    )
}

export default ExpensesTransitionReport;
