import React, { useState } from 'react'
import ItemBatchReport from '../../../_components/Reports/IndividualReports/ItemBatchReport';


const ItemBatchReportPage = () => {
    const [menu, setMenu] = useState(false);
    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          
            <ItemBatchReport />
        </div>
    )
}

export default ItemBatchReportPage