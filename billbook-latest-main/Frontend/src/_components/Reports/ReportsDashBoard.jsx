import React from 'react'
import Title from './Headers/Title'
import ReportsBlockSection from './Sections/ReportsBlockSection'
import { reportsData } from './reportsData';

const ReportsDashBoard = () => {

    return (
        <div className="page-wrapper customers">
            <div className="content container-fluid">
                <Title />
                <div className=' h-[75vh] bg-white my-4 rounded-md shadow-md overflow-scroll no-scrollbar flex flex-wrap justify-start gap-4 p-6'>
                    {reportsData?.length > 0 ?
                        reportsData?.map((report, i) => (
                            <React.Fragment key={i}>
                                <ReportsBlockSection data={report?.data} heading={report?.heading} icon={report?.icon} />
                            </React.Fragment>
                        ))
                        : <p>No Reports Found</p>}
                </div>
            </div>
        </div>
    )
}

export default ReportsDashBoard