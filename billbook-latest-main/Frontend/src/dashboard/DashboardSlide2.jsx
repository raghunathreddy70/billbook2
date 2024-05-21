import React, { useState } from 'react'
import SalesOverviewChart from './Charts/SalesOverviewChart';
import PurchasesOverviewChart from './Charts/PurchasesOverviewChart';
import { Input } from 'antd';
import useDashboardHooks from './hooks/useDashboardHooks';
import SelectInput from './component/SelectInput';
export const DashboardSlide2 = () => {
    const { handleChartMonthsChange } = useDashboardHooks();
    const [monthSelect, setMonthsSelect] = useState({
        purchases: 12,
        sales: 6,
    })
    const [errorState, setErrorState] = useState(false);

    //   ---first chart
    return (
        <div className="Dashboard-slide-parent !p-0">
            <div className='Main-dashboardFilters'>
                <select name="" id="">
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="This Week">This Week</option>
                    <option value="Last Week">Last Week</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="This Month">This Month</option>
                    <option value="Previous Month">Previous Month</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="This Quarter">This Quarter</option>
                    <option value="Previous Quarter">Previous Quarter</option>
                    <option value="Current Fiscal Year">Current Fiscal Year</option>
                    <option value="Previous Fiscal Year">Previous Fiscal Year</option>
                    <option value="Last 365 Days">Last 365 Days</option>
                    <option value="Custom Date Range">Custom Date Range</option>
                </select>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header flex flex-wrap justify-between items-center">
                            <h5 className="card-title">Purchases Overview</h5>
                            <SelectInput handleChartMonthsChange={handleChartMonthsChange} setState={setMonthsSelect} setErrorState={setErrorState} state={monthSelect} value={monthSelect?.purchases} name='purchases' />
                            {/* <Input placeholder="Prev Months" name='purchases' className={`w-[100px] hover:border-[#d9d9d9] focus:border-[#d9d9d9] focus:shadow-none ${errorState && "!border-red-500"}`} value={monthSelect?.purchases} onChange={(e) => handleChartMonthsChange({ e, setState: setMonthsSelect, setErrorState, state: monthSelect })} /> */}
                        </div>
                        <div className="card-body">
                            <div id="chart">
                                <PurchasesOverviewChart monthSelect={monthSelect?.purchases} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mixed Chart */}

                <div className="col-md-6">
                    <div className='Dashboardbackup2Chart1-sub-chart'>
                        <div className="card">
                            <div className="card-header flex flex-wrap justify-between items-center">
                                <h5 className="card-title">Sales Overview</h5>
                                <SelectInput handleChartMonthsChange={handleChartMonthsChange} setState={setMonthsSelect} setErrorState={setErrorState} state={monthSelect} value={monthSelect?.sales} name='sales' />
                                {/* <Input placeholder="Prev Months" name='sales' className={`w-[100px] hover:border-[#d9d9d9] focus:border-[#d9d9d9] focus:shadow-none ${errorState && "!border-red-500"}`} value={monthSelect?.sales} onChange={(e) => handleChartMonthsChange({ e, setState: setMonthsSelect, setErrorState, state: monthSelect })} /> */}
                            </div>
                            <div className="card-body">
                                <div className="chart-container">
                                    <SalesOverviewChart monthSelect={monthSelect?.sales} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
