import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import useDashboardHooks from '../hooks/useDashboardHooks';
import useGetApis from '../../ApiHooks/useGetApi';

const PurchasesOverviewChart = ({ monthSelect }) => {

    const { getPreviousMonths, calculateAverage } = useDashboardHooks();
    const { getApiData } = useGetApis();
    const [average, setAverage] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    // const [monthsNeeaded, setMonthsNeeaded] = useState

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                let data = await getApiData({ endpoint: `/api/addPurchases/purchases` })
                setDataSource(data);
                const average = calculateAverage(data, "purchasesDate");
                setAverage(average);
            } catch (error) {
                console.log(error)
            }
        }
        fetchSalesData();
    }, []);

    const options123 = {
        series: [{
            name: 'Servings',
            data: getPreviousTwelveMonthsPercentageOnEntries(dataSource, average)
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
            categories: getPreviousMonths(monthSelect).reverse(),
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




    function getPreviousTwelveMonthsPercentageOnEntries(data, average) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let updatedState = getPreviousMonths(monthSelect).reverse(); // Get the previous five months and reverse them
        let newArr = updatedState.map((item) => { return { monthName: item, count: 0, percentage: 0 } });

        data.length> 0 && data?.forEach((item) => {
            let currentDate = new Date(item?.purchasesDate);
            let monthIndex = currentDate.getMonth();
            let year = currentDate.getFullYear();
            let monthName = monthNames[monthIndex];
            let found = updatedState.indexOf(monthName + ' ' + year);

            if (found !== -1) {
                newArr[found] = { ...newArr[found], count: newArr[found].count + 1, percentage: (((newArr[found].count + 1) / average) * 100) }; // Increment count for the found month
            }
        });
        let dataArr = newArr.map((item) => item.percentage.toFixed())

        return dataArr;
    }

    return (
        <>
            <ReactApexChart options={options123} series={options123.series} type="bar" />
        </>
    )
}

export default PurchasesOverviewChart