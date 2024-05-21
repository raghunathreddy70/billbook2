import React, { useState, useEffect } from 'react'
import './Dashboardbackup2.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios';
const Dashboardbackup2 = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalVendors, setTotalVendors] = useState(0);

    // const [todaysMoney, setTodaysMoney] = useState(18000);
    const [todaySales, setTodaysSales] = useState(0)
    const [todayBalance, setTodayBalance] = useState(0)
    const[month,setMonth]=useState('')
    // const [todaysUsers, setTodaysUsers] = useState(1900);
     const [newClients, setNewClients] = useState(2500);
    const [sales, setSales] = useState(103430);


   

    const fetchRevenue = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/getTotalRevenue",{params: {businessId: userData?.data?._id}});
        setTotalRevenue(response.data.revenue);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
    fetchRevenue();
      
    }, [userData]);


    const fetchCustomers = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/admin/customerCount/${userData?.data?._id}`,
        );
          setTotalCustomers(response.data.count);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchCustomers();
      }, [userData]);
    
    const fetchBalance = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/admin/totalBalance");
          setTotalBalance(response.data.balance);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchBalance();
      }, []);
      const fetchVendors = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/admin/vendorCount");
          setTotalVendors(response.data.counts);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchVendors();
      }, []);
  
    const fetchSales = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/admin/totalSalesPerMonth");
          setTodaysSales(response.data.currentMonth.totalBalance);
          setMonth(response.data.currentMonth.month);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchSales();
      }, []);
    const fetchTodayBalance = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/admin/totalBalancePerMonth");
          setTodayBalance(response.data.currentMonth.totalBalance);
          setMonth(response.data.currentMonth.month);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchTodayBalance();
      }, []);
    
    
      useEffect(() => {
        //setTodaysMoney(prevMoney => prevMoney + Math.floor(Math.random() * 1000));
        //setTodaysUsers(prevUsers => prevUsers + Math.floor(Math.random() * 10));
            setNewClients(prevClients => prevClients + Math.floor(Math.random() * 100));
            setSales(prevSales => prevSales + Math.floor(Math.random() * 1000));
            
            // const interval = setInterval(() => {
            //     return () => clearInterval(interval);
            // }, 100);
    }, []);

    // Function to format counts
    const formatCount2 = (count, threshold) => {
        return count >= threshold ? `${threshold}` : count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    

    const formatCount = (count) => {
        return count === 2500 ? '2500+' : count;
    };


    return (
        <>
            <div className='Dashboardbackup2-parent'>
                <div className='Dashboardbackup2-sub1'>
                    <div className="row">
                        <div className="col-sm-6 col-md-6">
                            <div className='Dashboardbackup2-sub1-subparent'>
                                <div className='Dashboardbackup2-sub1-subparent-image'>
                                    <img src="/images/dashboardimage1.png" alt="" />
                                </div>
                                <div className='Dashboardbackup2-sub1-subparent-content'>
                                    <p className='dashboard-text1'>Discover The Full Range of Dashboard Features.</p>
                                    <Link to="/register">
                                        <div className='Dashboardbackup2-sub1-subparent-button'>
                                            <button className='text-black'>Register Now</button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6">
                            <div className='Dashboardbackup2-sub1-subparent'>
                                <div className='Dashboardbackup2-sub1-subparent-content'>
                                    <p>Learn more about our services.</p>
                                    <Link to="/documentation">
                                        <div className='Dashboardbackup2-sub1-subparent-button-2'>
                                            <button className='text-black'>Discover More</button>
                                        </div>
                                    </Link>
                                </div>
                                <div className='Dashboardbackup2-sub1-subparent-image'>
                                    <img src="/images/dashboardimage2.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='Dashboardbackup2-sub2'>
                    <div className="row">
                        <div className="col-6 col-sm-4 col-md-3">
                            <div className='Dashboardbackup2-sub2-subparent'>
                                <div className='Dashboardbackup2-sub2-subparent-sub1'>
                                    <div className='Dashboardbackup2-sub2-subparent-image'>
                                        <img src="/images/arrowimage.png" alt="" />
                                    </div>
                                    <p>Total Revenue</p>
                                </div>
                                <div className='Dashboardbackup2-sub2-subparent-sub2'>
                                    <p>{formatCount(totalRevenue)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 col-md-3">
                            <div className='Dashboardbackup2-sub2-subparent'>
                                <div className='Dashboardbackup2-sub2-subparent-sub1'>
                                    <div className='Dashboardbackup2-sub2-subparent-image'>
                                        <img src="/images/arrowimage.png" alt="" />
                                    </div>
                                    <p>Total Customers</p>
                                </div>
                                <div className='Dashboardbackup2-sub2-subparent-sub2'>
                                    <p>{formatCount(totalCustomers)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 col-md-3">
                            <div className='Dashboardbackup2-sub2-subparent'>
                                <div className='Dashboardbackup2-sub2-subparent-sub1'>
                                    <div className='Dashboardbackup2-sub2-subparent-image'>
                                        <img src="/images/arrowimage.png" alt="" />
                                    </div>
                                    <p>Total Balance</p>
                                </div>
                                <div className='Dashboardbackup2-sub2-subparent-sub2'>
                                    <p>{formatCount(totalBalance)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 col-md-3">
                            <div className='Dashboardbackup2-sub2-subparent'>
                                <div className='Dashboardbackup2-sub2-subparent-sub1'>
                                    <div className='Dashboardbackup2-sub2-subparent-image'>
                                        <img src="/images/arrowimage.png" alt="" />
                                    </div>
                                    <p>Total Vendors</p>
                                </div>
                                <div className='Dashboardbackup2-sub2-subparent-sub2'>
                                    <p>{formatCount(totalVendors)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='Dashboardbackup2-sub3'>
                    <div className="row">
                        <div className="col-6 col-sm-3 col-md-3">
                            <div className='Dashboardbackup2-sub3-content'>
                                <div className='Dashboardbackup2-sub3-content-sub-parent'>
                                    <div className='Dashboardbackup2-sub3-content-text'>
                                        <p>SALES IN <span>{month}</span> </p>
                                        <h6>  {formatCount2(todaySales)}</h6>
                                    </div>
                                    <div className='Dashboardbackup2-sub3-content-image'>
                                        <img src="/images/dashboardicon1.png" alt="" />
                                    </div>
                                </div>
                                <div className='Dashboardbackup2-sub3-content-sub'>
                                    {/* <p className='Dashboardbackup2-sub3-content-sub-price'>+55%</p>
                                    <p className='Dashboardbackup2-sub3-content-sub-day'>since yesterday</p> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-3 col-md-3">
                            <div className='Dashboardbackup2-sub3-content'>
                                <div className='Dashboardbackup2-sub3-content-sub-parent'>
                                    <div className='Dashboardbackup2-sub3-content-text'>
                                        <p>BALANCE IN <span>{month}</span></p>
                                        <h6>{formatCount2(todayBalance)}</h6>
                                    </div>
                                    <div className='Dashboardbackup2-sub3-content-image2'>
                                        <img src="/images/dashboardicon4.png" alt="" />
                                    </div>
                                </div>
                                <div className='Dashboardbackup2-sub3-content-sub'>
                                    {/* <p className='Dashboardbackup2-sub3-content-sub-price'>+3%</p>
                                    <p className='Dashboardbackup2-sub3-content-sub-day'>since last week</p> */}
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-6 col-sm-3 col-md-3">
                            <div className='Dashboardbackup2-sub3-content'>
                                <div className='Dashboardbackup2-sub3-content-sub-parent'>
                                    <div className='Dashboardbackup2-sub3-content-text'>
                                        <p>NEW CLIENTS</p>
                                        <h6>{formatCount2(newClients, 4000)}</h6>
                                    </div>
                                    <div className='Dashboardbackup2-sub3-content-image3'>
                                        <img src="/images/dashboardicon2.png" alt="" />
                                    </div>
                                </div>
                                <div className='Dashboardbackup2-sub3-content-sub'>
                                    <p className='Dashboardbackup2-sub3-content-sub-price-reduced'>-2%</p>
                                    <p className='Dashboardbackup2-sub3-content-sub-day'>since last quarter</p>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className="col-6 col-sm-3 col-md-3">
                            <div className='Dashboardbackup2-sub3-content'>
                                <div className='Dashboardbackup2-sub3-content-sub-parent'>
                                    <div className='Dashboardbackup2-sub3-content-text'>
                                        <p>TOTAL SALES</p>
                                        <h6>{formatCount2(sales, 120000)}</h6>
                                    </div>
                                    <div className='Dashboardbackup2-sub3-content-image4'>
                                        <img src="/images/dashboardicon3.png" alt="" />
                                    </div>
                                </div>
                                <div className='Dashboardbackup2-sub3-content-sub'>
                                    <p className='Dashboardbackup2-sub3-content-sub-price'>+5%</p>
                                    <p className='Dashboardbackup2-sub3-content-sub-day'>than last month</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>

    )
}

export default Dashboardbackup2