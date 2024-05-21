import React, { useState } from 'react'
import { TiTick } from "react-icons/ti";

const PricingPlan1 = () => {
    const [activeButton, setActiveButton] = useState('monthly');
    const [activeCard, setActiveCard] = useState('third');
    return (
        <>
            <div className={`main-wrapper`}>
                <div className="page-wrapper row pricing-paragraph-parent-clas">
                    <div className="content container-fluid row">
                        <div className="page-header mt-3">
                            <div className="content-page-header col-md-11 mx-auto">
                                <h2>Plans & Pricing</h2>
                            </div>
                        </div>
                        <div className='col-md-11 pricing-paragrap-col-md'>
                        <div className='col-md-11 mx-auto'>
                            <div className='row'>
                                <div className='col-md-12 d-flex justify-content-between align-items-center mt-8'>
                                    <div className='pricing-paragraph-text'>
                                        <p>Whether your time-saving Billing Solution needs are large or small. <br />
                                            We're here to help your scale.</p>
                                    </div>
                                    <div className='MONTHLY-Sales-pricing d-flex justify-content-between gap-2'>
                                        <button
                                            className={activeButton === 'monthly' ? 'active' : ''}
                                            onClick={() => setActiveButton('monthly')}
                                        >
                                            MONTHLY
                                        </button>
                                        <button
                                            className={activeButton === 'yearly' ? 'active' : ''}
                                            onClick={() => setActiveButton('yearly')}
                                        >
                                            YEARLY
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='row pricing-row '>
                                <div className='pricing-row12'>
                                    <h5>Our Plans</h5>
                                </div>
                                <div className="col-md-4">
                                    <div
                                        className={`pricing-card-details ${activeCard === 'first' ? 'active' : ''}`}
                                        onClick={() => setActiveCard('first')}
                                    >
                                        <div>
                                            <div className='d-flex align-items-baseline gap-2 heading mt-8'>
                                                <h3>Free</h3>
                                                <p>/14days</p>
                                            </div>
                                            <div className='pricing-theme-data'>
                                                <h4>Pilot</h4>
                                                <p>Unleash the Power of automation</p>
                                            </div>
                                            <div className='premium-data-details'>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Multi-steps Zaps
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    3 Premium Apps
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    2 Users Team
                                                </div>
                                            </div>
                                        </div>
                                        <div className='choose-plan-date'>
                                            <h2>Choose Plan</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div
                                        className={`pricing-card-details ${activeCard === 'second' ? 'active' : ''}`}
                                        onClick={() => setActiveCard('second')}
                                    >
                                        <div>
                                            <div className='d-flex align-items-baseline gap-2 heading mt-8'>
                                                <h3>INR</h3>
                                                <p>/month</p>
                                            </div>
                                            <div className='pricing-theme-data'>
                                                <h4>Professional</h4>
                                                <p>Advanced tools to take your work to the next level.</p>
                                            </div>
                                            <div className='premium-data-details'>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Multi-steps Zaps
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Unlimited Premium
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    50 Users Team
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Shared Workspace
                                                </div>
                                            </div>
                                        </div>
                                        <div className='choose-plan-date'>
                                            <h2>Choose Plan</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div
                                        className={`pricing-card-details ${activeCard === 'third' ? 'active' : ''}`}
                                        onClick={() => setActiveCard('third')}
                                    >
                                        <div>
                                            <div className='most-popular-PREMIUM'>
                                                <p>MOST POPULAR</p>
                                            </div>
                                            <div className='d-flex align-items-baseline gap-2 heading'>
                                                <h3>INR 299</h3>
                                                <p>/6 months</p>
                                            </div>
                                            <div className='pricing-theme-data'>
                                                <h4>Company</h4>
                                                <p>Advanced tools to take your work to the next level.</p>
                                            </div>
                                            <div className='premium-data-details'>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Multi-steps Zaps
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Unlimited Premium
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Unlimited Users Team
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Advanced Admin
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <TiTick />
                                                    Custom Data Retention
                                                </div>
                                            </div>
                                        </div>
                                        <div className='choose-plan-date'>
                                            <h2>Choose Plan</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-start align-items-center gap-3 Exculsions-of-Plans'>
                                    <p>For Detailed Inculsions and Exculsions of Plans</p>
                                    <button>Click Here</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default PricingPlan1