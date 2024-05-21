import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
const Dashboard3two = () => {
    return (
        <>
            <div className="main-wrapper">
            <div className='Dashboard3two-parent'>
                        <div className="row row1">
                            <div className="col-md-7">
                                <div className="row row2">
                                    <div className="col-md-7">
                                        <div className='Adds-content'>
                                            <div className='Adds-content-sub'>
                                                <h5>Place for Your Ads</h5>
                                                <h2>Ads For Your Business</h2>
                                                <p>Best place to reach direct customers dashboard for Brand Awareness, Lead Generation, Engagement and many more..,</p>
                                            </div>
                                            <div className='readMore-content text-black'>
                                                <Link to=""><p>Read more...</p></Link>
                                                <div className='arroeicon'>
                                                <FaArrowRightLong />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='radialbars-bg' style={{backgroundImage:`url('./newdashboard/radiallines.png') `}}>
                                    </div>
                                    <div className="col-md-5">
                                        <div className='ads-image'>
                                            <img src="./newdashboard/advt.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                              <div className='Adds-content-sub-bg-2'>
                              <div className="advt-banner-bg" style={{backgroundImage:`url('./newdashboard/dashboardadvtbg.png') `}}>
                                    <div className='advt-banner-content'>
                                        <div className='advt-banner-content-sub'>
                                        <h2 className='text-white'>Work with the Rockets</h2>
                                        <p className='text-white'>Wealth creation is an evolutionarily recent positive-sum game.</p>
                                        <p className='text-white'>It is all about who take the opportunity first.</p>
                                        </div>
                                        <div className='readmore'>
                                            <Link to=""><p className='text-white'>Read More..,</p></Link>
                                        </div>

                                    </div>
                                </div>
                              </div>
                            </div>
                        </div>
            </div>
            </div>
        </>
    )
}

export default Dashboard3two