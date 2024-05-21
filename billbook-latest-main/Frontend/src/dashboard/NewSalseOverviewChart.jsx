import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import NewDashboardBarchart from './NewDashboardBarchart';
import { useSelector } from 'react-redux';
import axios from 'axios';

const NewSalesOverviewChart = () => {
    const userData = useSelector((state) => state?.user?.userData);
    const businessId = userData?.data?._id;
    const [showContent, setshowContent] = useState(false)
    const [invoiceCount, setInvoiceCount] = useState(null)

    const [formValues, setFormValues] = useState({
        startDate: '',
        endDate: ''
    });
    const toggleContent = () => {
        setshowContent(!showContent)
    }
    const [monthlyData, setMonthlyData] = useState({
        monthlyBalances: [],
        monthlyPaidAmounts: []
    });

    const [chartOptions, setChartOptions] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('1 Year');

    const fetchMonthly = async () => {
        if (!businessId) {
            console.log("User data not available");
            return;
        }
        try {
            const response = await axios.get("http://localhost:8000/api/admin/getMonthlySales", { params: { businessId } });
            setMonthlyData({
                monthlyBalances: response.data.monthlyBalances,
                monthlyPaidAmounts: response.data.monthlyPaidAmounts,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchMonthly();
    }, [userData]);

    useEffect(() => {
        const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const getFilteredData = () => {
            const now = new Date();
            const currentMonth = now.getMonth();
            const periods = {
                '3 Months': 3,
                '6 Months': 6,
                '1 Year': 12
            };
            const monthsToShow = periods[selectedPeriod];

            const startMonth = (currentMonth - monthsToShow + 1 + 12) % 12;
            const endMonth = currentMonth;

            let filteredBalances = [];
            let filteredPaidAmounts = [];
            let filteredCategories = [];

            for (let i = 0; i < monthsToShow; i++) {
                const monthIndex = (startMonth + i) % 12;
                filteredBalances.push(monthlyData.monthlyBalances[monthIndex] || 0);
                filteredPaidAmounts.push(monthlyData.monthlyPaidAmounts[monthIndex] || 0);
                filteredCategories.push(categories[monthIndex]);
            }

            return {
                monthlyBalances: filteredBalances,
                monthlyPaidAmounts: filteredPaidAmounts,
                categories: filteredCategories
            };
        };

        const filteredData = getFilteredData();

        const series = [
            {
                name: 'UnPaid Sales',
                data: filteredData.monthlyBalances
            },
            {
                name: 'Paid Sales',
                data: filteredData.monthlyPaidAmounts
            }
        ];

        const options = {
            chart: {
                type: 'area',
                toolbar: { show: false }
            },
            xaxis: {
                categories: filteredData.categories
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            title: {
                text: 'Sales Overview',
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold'
                }
            },
            colors: ['#C6C7F8', '#2D3748'],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.8,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.1,
                    stops: [0, 100]
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            }
        };

        setChartOptions({
            options: options,
            series: series,
            type: 'area',
            width: '100%',
            height: '340px'
        });
    }, [monthlyData, selectedPeriod]);

    if (!chartOptions) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { startDate, endDate } = formValues;
        
        if (!businessId || !startDate || !endDate) {
            console.log("Invalid input");
            return;
        }
        
        try {
            const response = await axios.get("http://localhost:8000/api/admin/getSalesByDateRange", {
                params: { businessId, startDate, endDate }
            });
    
            const response1 = await axios.get("http://localhost:8000/api/admin/getInvoiceCountByRange", {
                params: { businessId, startDate, endDate }
            });
            console.log("response1",response1)
            setInvoiceCount({...response1.data, startDate: startDate, endDate: endDate})
            const { months, monthlyBalances, monthlyPaidAmounts, years, yearlyBalances, yearlyPaidAmounts, weeks, weeklyBalances, weeklyPaidAmounts, days, dailyBalances, dailyPaidAmounts } = response.data;
    
            const dateDifference = Math.abs(new Date(endDate) - new Date(startDate));
            const daysDifference = Math.ceil(dateDifference / (1000 * 60 * 60 * 24));
    
            if (daysDifference <= 7) {
                setChartOptions(prevOptions => ({
                    ...prevOptions,
                    options: {
                        ...prevOptions.options,
                        xaxis: {
                            categories: days
                        }
                    },
                    series: [
                        { name: 'UnPaid Sales', data: dailyBalances },
                        { name: 'Paid Sales', data: dailyPaidAmounts }
                    ]
                }));
            } else if (daysDifference <= 31) {
                setChartOptions(prevOptions => ({
                    ...prevOptions,
                    options: {
                        ...prevOptions.options,
                        xaxis: {
                            categories: weeks
                        }
                    },
                    series: [
                        { name: 'UnPaid Sales', data: weeklyBalances },
                        { name: 'Paid Sales', data: weeklyPaidAmounts }
                    ]
                }));
            } else if (daysDifference <= 365) {
                setChartOptions(prevOptions => ({
                    ...prevOptions,
                    options: {
                        ...prevOptions.options,
                        xaxis: {
                            categories: months
                        }
                    },
                    series: [
                        { name: 'UnPaid Sales', data: monthlyBalances },
                        { name: 'Paid Sales', data: monthlyPaidAmounts }
                    ]
                }));
            } else {
                setChartOptions(prevOptions => ({
                    ...prevOptions,
                    options: {
                        ...prevOptions.options,
                        xaxis: {
                            categories: years
                        }
                    },
                    series: [
                        { name: 'UnPaid Sales', data: yearlyBalances },
                        { name: 'Paid Sales', data: yearlyPaidAmounts }
                    ]
                }));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    
    return (
        <div className='NewSalesOverviewChart-parent'>
            <div className="row">
                <div className="col-md-5">
                    <div className='NewSalesOverviewChart'>
                        <div className='NewSalesOverviewChart-filterData'>
                            <div className='NewSalesOverviewChart-filterData-sub1'>
                                <p onClick={() => setSelectedPeriod('3 Months')}>3 Months</p>
                                <p onClick={() => setSelectedPeriod('6 Months')}>6 Months</p>
                                <p onClick={() => setSelectedPeriod('1 Year')}>1 Year</p>
                            </div>
                            {showContent ? (
                                <form onSubmit={(e)=>handleSubmit(e)}>
                                    <div className="form-row row">
                                        <div className="form-group col-md-6 DashboardFilterbutton-input-col">
                                            <label htmlFor="startDate">Start Date</label>
                                            <input
                                                type="date"
                                                className="form-control DashboardFilterbutton-input"
                                                id="startDate"
                                                name="startDate"
                                                value={formValues.startDate}
                                                onChange={(e)=>handleInputChange(e)}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 d-flex gap-2 items-center DashboardFilterbutton-input-col" style={{paddingLeft:"3px"}}>
                                            <div>
                                                <label htmlFor="endDate">End Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control DashboardFilterbutton-input"
                                                    id="endDate"
                                                    name="endDate"
                                                    value={formValues.endDate}
                                                    onChange={(e)=>handleInputChange(e)}
                                                />
                                            </div>
                                            <button type="submit" className="DashboardFilterbutton">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className='NewSalesOverviewChart-filterData-sub2 cursor-pointer' onClick={toggleContent}>
                                    <p>Customize</p>
                                </div>
                            )}
                        </div>
                        <NewDashboardBarchart invoiceCount={invoiceCount}  selectedPeriod={selectedPeriod}/>
                        <div className='MonthlyInvoices'>
                            <h5>Monthly Invoices</h5>
                            <div className='MonthlyInvoices-mainparent'>
                                <div className='MonthlyInvoices-sub1'>
                                    <div className='MonthlyInvoices-sub2'>
                                        <div className='MonthlyInvoices-sub-icon'>
                                            <img src="./newdashboard/fileicon.png" alt="Invoices Icon" />
                                        </div>
                                        <p>Invoices</p>
                                    </div>
                                    <h4>184</h4>
                                    <div className='MonthlyInvoices-progress'>
                                        <div className="progress">
                                            <div className="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='MonthlyInvoices-sub1'>
                                    <div className='MonthlyInvoices-sub2'>
                                        <div className='MonthlyInvoices-sub-icon'>
                                            <img src="./newdashboard/cart.png" alt="Products Sales Icon" />
                                        </div>
                                        <p>Products sales</p>
                                    </div>
                                    <h4>2,400 INR</h4>
                                    <div className='MonthlyInvoices-progress'>
                                        <div className="progress">
                                            <div className="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className='NewSalesOverviewChart'>
                        <Chart
                            options={chartOptions.options}
                            series={chartOptions.series}
                            type={chartOptions.type}
                            width={chartOptions.width}
                            height={chartOptions.height}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewSalesOverviewChart;
