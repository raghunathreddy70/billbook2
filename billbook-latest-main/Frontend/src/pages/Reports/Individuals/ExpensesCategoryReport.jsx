import React, { useState } from 'react'

import ExpenseSummaryCategory from './ExpenseSummaryCategory';
export const ExpensesCategoryReport = () => {
     const [menu, setMenu] = useState(false);
    const toggleMobileMenu = () => {
        setMenu(!menu);
    };
  return (
    
    <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
   
    <ExpenseSummaryCategory/>
</div>
  )
}
