import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import useDashboardHooks from '../hooks/useDashboardHooks';
import useGetApis from '../../ApiHooks/useGetApi';

const ExpensesOverviewChart = ({ monthSelect }) => {
    const { getPreviousMonths, calculateAverage } = useDashboardHooks();
    const { getApiData } = useGetApis();
    const [average, setAverage] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [areaSeries2, setAreaSeries] = useState([]);
    // const [areaSeries2] = useState([{
    //     name: 'Series 2',
    //     data: [30, 40, 25, 20, 35, 45, 25]
    // }]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                let data = await getApiData({ endpoint: `/api/Expense/expense` })
                setDataSource(data);
                const average = calculateAverage(data, "expenseDate");
                setAverage(average);
                const percentages = getPreviousFiveMonthsPercentageOnEntries(data, average);
                setAreaSeries([{ name: 'Series 2', data: percentages }]);
            } catch (error) {
                console.log(error)
            }
        }
        fetchSalesData();
    }, [monthSelect]);

    const options = {
        chart: {
            width: 380,
            type: 'bar'
        },
        xaxis: {
            categories: getPreviousMonths(monthSelect).reverse()
        }
    };

    function getPreviousFiveMonthsPercentageOnEntries(data, average) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let updatedState = getPreviousMonths(monthSelect).reverse(); // Get the previous five months and reverse them
        let newArr = updatedState.map((item) => { return { monthName: item, count: 0, percentage: 0 } });

        data?.forEach((item) => {
            let currentDate = new Date(item?.expenseDate);
            let monthIndex = currentDate.getMonth();
            let year = currentDate.getFullYear();
            let monthName = monthNames[monthIndex];
            let found = updatedState.indexOf(monthName + ' ' + year);

            if (found !== -1) {
                newArr[found] = { ...newArr[found], count: newArr[found].count + 1, percentage: (((newArr[found].count + 1) / average) * 100) }; // Increment count for the found month
            }
        });
        let dataArr = newArr.map((item) => item.percentage)
        return dataArr;
    }


    return (
        <>
            {/* <ReactApexChart options={options} series={areaSeries2} type="bar" width={"100%"} height={280} /> */}
        </>
    )
}

export default ExpensesOverviewChart