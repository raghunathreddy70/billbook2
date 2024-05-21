import React, { useEffect, useState } from 'react'
import useGetApis from '../../ApiHooks/useGetApi';
import useDashboardHooks from '../hooks/useDashboardHooks';
import ReactApexChart from 'react-apexcharts';

const CustomersCard = () => {
    const { getApiData } = useGetApis();
    const { getPreviousMonths, calculateAverageOnGrandTotal, calculateAverage } = useDashboardHooks();
    const [average, setAverage] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [colorOnPercent, setColorOnPercent] = useState("#fd5547");

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                let data = await getApiData({ endpoint: `/api/Expense/expense` })
                console.log(data, "expense")
                setDataSource(data);
                const average = calculateAverage(data, "grandTotal", "expenseDate");
                console.log(average, "avg")
                setAverage(average);
                const percentages = getPreviousFiveMonthsPercentageOnEntries(data, average);
                setColorOnPercent(percentages[0] > 70 ? "#fd5547" : ((percentages[0] < 70 && percentages[0] > 40) ? "#f8ed62" : "#34B53A"))
            } catch (error) {
                console.log(error)
            }
        }
        fetchSalesData();
    }, []);

    function getPreviousFiveMonthsPercentageOnEntries(data, average) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let updatedState = getPreviousMonths(1).reverse(); // Get the previous five months and reverse them
        let newArr = updatedState.map((item) => { return { monthName: item, count: 0, percentage: 0 } });

        data?.forEach((item) => {
            let monthIndex = new Date(item?.expenseDate).getMonth();
            let monthName = monthNames[monthIndex];
            let found = updatedState.indexOf(monthName);

            if (found !== -1) {
                newArr[found] = {
                    ...newArr[found], count: newArr[found].count + (item?.grandTotal || 0), percentage: (Math.round(((newArr[found].count + (item?.grandTotal || 0)) / average) * 100))
                }; // Increment count for the found month
            }
        });
        console.log(newArr, "newArr")
        let dataArr = newArr.map((item) => item.percentage)
        return dataArr;
    }

    const option1 = {
        series: getPreviousFiveMonthsPercentageOnEntries(dataSource, average),
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
        colors: [colorOnPercent],
        // colors: ['#FF3A29'],
    };

    return (
        <>
            <ReactApexChart options={option1} series={option1.series} type="radialBar" height={200} />
        </>
    )
}

export default CustomersCard