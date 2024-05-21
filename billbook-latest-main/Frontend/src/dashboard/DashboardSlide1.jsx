import React from 'react'

export const DashboardSlide1 = () => {
    return (
        <div className="Dashboard-slide-parent">
            <div className="row">

                {/* Column Chart */}

                <div className="col-md-7">
                    <div className='dashboard-outdoor-Revenue-Analysis'>
                        <div className="card ">
                            <div className="card-header ">
                                <div className='row'>
                                <div className='col-md-7 dashboard-card-body-changes'>
                                    <h3>Developed By Hirola Team</h3>
                                    
                                    <p className='card-p'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis ipsa sit doloribus ex, aliquam ut sapiente ad. Laudantium rerum error maxime! Itaque a maxime tempore dolor</p>
                                    <div className='dashboard-read-more'>
                                        <button> Read More
                                
                                        </button>
                                        {/* <img src="/forwardarrow.png" alt="" width={25} height={17}/> */}
                                    </div>
                                </div>
                                <div className=" col-md-5 dashboard-hirola-logo-text">
                                {/* <img src="/hirolalogo.png" alt="" width={25} height={25}/> */}
                                    
                                   <div className='dashboard-hirola-logo-text-content'>
                                   <div className='dashboard-hirola-logo'>
                                        <img src="/hirolalogo.png" alt=""/>
                                    </div>
                                    <h4 className='hirola-text'>Hirola Infotech Solutions</h4>
                                   </div>
                                </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mixed Chart */}

                <div className="col-md-5">
                    <div className='dashboard-Lorem-ipsum'>
                        <div className="card">
                            <div className="card-header ">
                                <div className='dashboard-image-width'>
                                    <img src="backgrounddashboard.png" alt="" />
                                </div>
                                <div className='dashboard-image-dunder-text'>
                                    <h4>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum, iure, praesentium praesentium</h4>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
