import React from 'react'
import { DashboardSlide2 } from './DashboardSlide2'
import { Dashboard3one } from './Dashboard3one'
import Dashboard3two from './Dashboard3two'
import DashboardTransactions from './DashboardTransactions'
import NewSalseOverviewChart from './NewSalseOverviewChart'
import "./Dashboard3.css"
const Dashboard3 = () => {
  return (
    <>
    <div className="main-wrapper">
    <div className='page-wrapper'>
    <Dashboard3one />
    <Dashboard3two/>
    <NewSalseOverviewChart/>
    <DashboardTransactions/>
    </div>
    </div>
    </>
  )
}

export default Dashboard3