import React, { useState } from 'react'
import ReportsDashBoard from '../../_components/Reports/ReportsDashBoard'

const ReportsDashBoardPage = () => {
    const [menu, setMenu] = useState(false);

    return (
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
            <ReportsDashBoard />
        </div>
    )
}

export default ReportsDashBoardPage