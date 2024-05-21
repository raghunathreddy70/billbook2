import React, { useEffect, useState } from "react";
import "./Dashboard3.css";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import axios from "axios";
import { useSelector } from "react-redux";
export const Dashboard3one = () => {
  const userData = useSelector((state) => state?.user?.userData);
  const [customerData, setCustomerData] = useState({
    totalCustomers: 0,
    percentageChange: 0,
  });

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [todaySales, setTodaysSales] = useState(0);
  const [totalSales, setTotalSales] = useState({
    currentMonthTotalSales: 0,
    percentageChange: 0,
  });
  //const businessId = '66449e6d2470fba75fd53923'
  const businessId = userData?.data?._id;

  // const fetchCustomers = async () => {
  //     if (!userData) {
  //         console.log("User data not available");
  //         return;
  //     }

  //     try {
  //         const response = await axios.get('http://localhost:8000/api/admin/customerCount', {
  //             params: { businessId }
  //         });
  //         console.log("response", response);
  //         setTotalCustomers(response.data.count);
  //     } catch (error) {
  //         console.error("Error fetching data:", error);
  //     }
  // };

  // useEffect(() => {
  //     fetchCustomers();
  // }, [userData]);

  const fetchCustomers1 = async () => {
    if (!userData) {
      console.log("User data not available");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/customerCount1`,
        {
          params: { businessId },
        }
      );
      console.log("response", response);
      setCustomerData({
        totalCustomers: response.data.customers.length,
        percentageChange: response.data.percentageChange,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCustomers1();
}, [userData]);
      const fetchRevenue = async () => {
        if (!userData) {
            console.log("User data not available");
            return;
        }
        try {
          const response = await axios.get("http://localhost:8000/api/admin/getTotalRevenue",
          {params: {businessId: userData?.data?._id}});
          setTotalRevenue(response.data.revenue);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
      fetchRevenue();
        
      }, [userData]);
     
        const fetchTotalSales = async () => {
            if (!userData) {
                console.log("User data not available");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/api/admin/totalSalesPerMonth`,
                {params: {businessId: userData?.data?._id}});
                setTotalSales({
                    currentMonthTotalSales: response.data.currentMonthTotalSales,
                    percentageChange: response.data.percentageChange
                });
            } catch (error) {
                console.error("Error fetching total sales:", error);
            }
        };
    useEffect(() => {
        fetchTotalSales();
    }, [userData]);
    const fetchProducts = async () => {
        if (!userData) {
            console.log("User data not available");
            return;
        }
        
        try {
            const response = await axios.get('http://localhost:8000/api/admin/productCount', 
                {params: {businessId: userData?.data?._id}}
            );
            console.log("response", response);
            setTotalProducts(response.data.count1);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, [userData]);
    return (
        <>
            <div className='Dashboard3one-parent'>
               

                <div className="row">
                    <div className="col-md-3">
                        <div className='Dashboard3one-sub d-flex'>
                            <div className='Dashboard3one-sub1'>
                                <h5>Monthly Sales</h5>
                                <div className='Dashboard3one-sub2'>
                                    <h5>₹ {totalSales.currentMonthTotalSales}</h5>
                                    <p className='text-success'>{totalSales.percentageChange}%</p>
                                </div>
                            </div>
                            <div className='Dashboard3one-sub3  trounded-l'>
                                <img src="./newdashboard/fileicon.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='Dashboard3one-sub d-flex'>
                            <div className='Dashboard3one-sub1'>
                                <h5>Total Customers</h5>
                                <div className='Dashboard3one-sub2'>
                                    <h5>{customerData.totalCustomers}</h5>
                                    <p className='text-success'>{customerData.percentageChange}%</p>
                                </div>
                            </div>
                            <div className='Dashboard3one-sub3  trounded-l'>
                                <img src="./newdashboard/globe.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='Dashboard3one-sub d-flex'>
                            <div className='Dashboard3one-sub1'>
                                <h5>Total Product / Services</h5>
                                <div className='Dashboard3one-sub2'>
                                    <h5>{totalProducts}</h5>
                                    <p className='text-danger'></p>
                                </div>
                            </div>
                            <div className='Dashboard3one-sub3  trounded-l'>
                                <img src="./newdashboard/text.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='Dashboard3one-sub d-flex'>
                            <div className='Dashboard3one-sub1'>
                                <h5>Total Sales</h5>
                                <div className='Dashboard3one-sub2'>
                                    <h5>₹ {totalRevenue}</h5>
                                    <p className='text-success'></p>
                                </div>
                            </div>
                            <div className='Dashboard3one-sub3  trounded-l'>
                                <img src="./newdashboard/cart.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// export default Dashboard3one
