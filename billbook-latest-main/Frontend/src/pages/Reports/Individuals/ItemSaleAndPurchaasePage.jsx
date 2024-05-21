import React, { useState } from 'react'

import ItemSalesAndPurchse from '../../../_components/Reports/IndividualReports/ItemSalesAndPurchse';

const ItemSaleAndPurchaasePage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            
            <ItemSalesAndPurchse />
        </div>
    )
}

export default ItemSaleAndPurchaasePage