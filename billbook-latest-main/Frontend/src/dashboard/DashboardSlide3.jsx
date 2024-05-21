import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ExpensesOverviewChart from './Charts/ExpensesOverviewChart';
import SalesCardPercent from './cards/SalesCardPercent';
import PurchasesCard from './cards/PurchasesCard';
import ExpensesCard from './cards/ExpensesCard';
import useGetApis from '../ApiHooks/useGetApi';
import { Input } from 'antd';
import useDashboardHooks from './hooks/useDashboardHooks';
import SelectInput from './component/SelectInput';

const DashboardSlide3 = () => {
    const { fetchInvoices, fetchPurchases, fetchExpenses } = useGetApis();
    const { handleChartMonthsChange } = useDashboardHooks();
    const [monthSelect, setMonthsSelect] = useState({
        expenses: 6,
    })
    const [errorState, setErrorState] = useState(false);

    const [totalValues, setTotalValues] = useState({
        invoicesGrandTotal: 0,
        purchsesGrandTotal: 0,
        expensesGrandTotal: 0,
    })


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                let { invoicesGrandTotal } = await fetchInvoices();
                let { purchsesGrandTotal } = await fetchPurchases();
                let { expensesGrandTotal } = await fetchExpenses();
                setTotalValues({ ...totalValues, invoicesGrandTotal, purchsesGrandTotal, expensesGrandTotal })
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchDetails();

    }, []);



    const options123 = {
        series: [{
            name: 'Servings',
            data: [44, 55, 41, 67, 22, 43, 26, 45, 34, 67, 56, 36]
        }],
        annotations: {
            points: [{
                x: 'Bananas',
                seriesIndex: 0,
                label: {
                    borderColor: '#775DD0',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#775DD0',
                    },
                    text: 'Bananas are good',
                }
            }]
        },
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: '50%',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 2
        },
        grid: {
            row: {
                colors: ['#fff', '#f2f2f2']
            }
        },
        xaxis: {
            labels: {
                rotate: -45
            },
            categories: ['Apples', 'Oranges', 'Strawberries', 'Pineapples', 'Mangoes', 'Bananas',
                'Blackberries', 'Pears', 'Watermelons', 'Cherries', 'Pomegranates', 'Tangerines', 'Papayas'
            ],
            tickPlacement: 'on'
        },
        yaxis: {
            title: {
                text: 'Servings',
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: "horizontal",
                shadeIntensity: 0.25,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [50, 0, 100]
            },
        }
    };


    const option3 = {
        series: [35],
        chart: {
            height: 200, // Reduced height
            width: 100, // Reduced width
            type: 'radialBar',

        },
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 15,
                    size: '50%',
                    background: '#fff', // Adjust the size of the hollow circle
                },
                dataLabels: {
                    showOn: 'always',
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '13px',
                    },
                    value: {
                        color: '#111',
                        fontSize: '20px', // Adjust font size of the value
                        show: true,
                    }
                }
            },
        },
        labels: ['Expenses'],
        colors: ['#FF3A29'],
    };
    const option4 = {
        series: [0],
        chart: {
            height: 200, // Reduced height
            width: 100, // Reduced width
            type: 'radialBar',

        },
        plotOptions: {
            radialBar: {
                stroke: {
                    lineCap: "round",
                },
                hollow: {
                    margin: 15,
                    size: '60%',
                    background: '#fff', // Adjust the size of the hollow circle
                },
                dataLabels: {
                    showOn: 'always',
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '13px',
                    },
                    value: {
                        color: '#111',
                        fontSize: '20px', // Adjust font size of the value
                        show: true,
                    }
                }
            },
        },
        labels: ['Customers'],
        colors: ['#02A0FC'],
    };




    return (
        <div className="Dashboard-slide-parent">
            <div className="row">

                {/* Column Chart */}

                <div className="col-md-8 range-bar-charts-parent">
                    <div className='dashboard-outdoor-creative-design '>
                        <div className='card'>
                            <div className='card-body row'>
                                <div className='cord-body-div1 col-md-2'>
                                    <div className='dashboard-outdoor-creative-design-image'>
                                        <img src="/dashboardwritten.png" alt="" />
                                    </div>
                                </div>
                                <div className='cord-body-div2 col-md-7'>
                                    <h2>Creative Outdoor Adds</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste, doloremque distinctio minus</p>
                                </div>
                                <div className='cord-body-div3 col-md-3'>
                                    <button>See More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>


                <div className="col-md-5 Expenses-Overview">
                    <div className='Dashboardbackup2Chart1-sub-chart'>
                        <div className="card">
                            <div className="card-header flex flex-wrap justify-between items-center">
                                <h5 className="card-title">Expenses Overview</h5>
                                <SelectInput handleChartMonthsChange={handleChartMonthsChange} setState={setMonthsSelect} setErrorState={setErrorState} state={monthSelect} value={monthSelect?.expenses} name='expenses' />
                                {/* <Input name='expenses' placeholder="Basic usage" className={`w-[100px] hover:border-[#d9d9d9] focus:border-[#d9d9d9] focus:shadow-none ${errorState && "!border-red-500"}`} value={monthSelect?.expenses} onChange={(e) => handleChartMonthsChange({ e, setState: setMonthsSelect, setErrorState, state: monthSelect })} /> */}
                            </div>
                            <div className="card-body ">
                                <div className="chart-container">
                                    <ExpensesOverviewChart monthSelect={monthSelect?.expenses} />
                                </div>
                                <div>
                                    <div className='row dashboard-users-progess-report'>

                                        <div className='col-6 col-sm-4 col-md-4'>
                                            <div className='Dashboardslide2-images-progressbar-parent'>
                                                <div className='Dashboardslide2-images-progressbar'>
                                                    <img src="/images/dashboardicon2.png" alt="" />
                                                </div>
                                                <div className='Dashboard-progressbar'>
                                                    <p>Sales</p>
                                                    <h6>{totalValues?.invoicesGrandTotal}</h6>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="progress">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-6 col-sm-4 col-md-4'>
                                            <div className='Dashboardslide2-images-progressbar-parent'>
                                                <div className='Dashboardslide2-images-progressbar'>
                                                    <img src="/images/dashboardicon1.png" alt="" />
                                                </div>
                                                <div className='Dashboard-progressbar'>
                                                    <p>Purchases</p>
                                                    <h6>{totalValues?.purchsesGrandTotal}</h6>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="progress">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-6 col-sm-4 col-md-4'>
                                            <div className='Dashboardslide2-images-progressbar-parent'>
                                                <div className='Dashboardslide2-images-progressbar'>
                                                    <img src="/images/dashboardicon3.png" alt="" />
                                                </div>
                                                <div className='Dashboard-progressbar'>
                                                    <p>Expenses</p>
                                                    <h6>{totalValues?.expensesGrandTotal}</h6>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="progress">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" ></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className='col-md-3 '>
                                            <div className='Dashboardslide2-images-progressbar-parent'>
                                                <div className='Dashboardslide2-images-progressbar'>
                                                    <img src="/images/dashboardicon4.png" alt="" />
                                                </div>
                                                <div className='Dashboard-progressbar'>
                                                    <p>Customers</p>
                                                    <h6>5678</h6>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="progress">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" height={350}></div>
                                                </div>
                                            </div>

                                        </div> */}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div >
        </div>
    );
}

export default DashboardSlide3;



