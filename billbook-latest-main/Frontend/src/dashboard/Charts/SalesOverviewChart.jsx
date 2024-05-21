import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useGetApis from '../../ApiHooks/useGetApi';
import useDashboardHooks from '../hooks/useDashboardHooks';

const SalesOverviewChart = ({ monthSelect }) => {
    const { getPreviousMonths, calculateAverage } = useDashboardHooks();
    const { getApiData } = useGetApis();
    const [average, setAverage] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [areaSeries, setAreaSeries] = useState([]);


    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                let data = await getApiData({ endpoint: `/api/addInvoice/invoices` })
                setDataSource(data);
                const average = calculateAverage(data, "invoiceDate");
                setAverage(average);
                const percentages = getPreviousFiveMonthsPercentageOnEntries(data, average);
                setAreaSeries([{ name: 'Series 1', data: percentages }]);
            } catch (error) {
                console.log(error)
            }
        }
        fetchSalesData();
    }, [monthSelect]);

    const areaOptions = {
        chart: {
            width: 380,
            type: 'area',
        },
        xaxis: {
            categories: getPreviousMonths(monthSelect).reverse()
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: "100%"
                },
                legend: {
                    position: 'bottom'
                },
            }
        }]
    };
    function getPreviousFiveMonthsPercentageOnEntries(data, average) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let updatedState = getPreviousMonths(monthSelect).reverse(); // Get the previous five months and reverse them
        let newArr = updatedState.map((item) => { return { monthName: item, count: 0, percentage: 0 } });

        data?.forEach((item) => {
            let currentDate = new Date(item?.invoiceDate);
            let monthIndex = currentDate.getMonth();
            let year = currentDate.getFullYear();
            let monthName = monthNames[monthIndex];
            let found = updatedState.indexOf(monthName + ' ' + year);

            if (found !== -1) {
                newArr[found] = { ...newArr[found], count: newArr[found].count + 1, percentage: (((newArr[found].count + 1) / average) * 100) }; // Increment count for the found month
            }
        });
        let dataArr = newArr.map((item) => item.percentage)
        console.log(dataArr, "arr")
        return dataArr;
    }

    return (
        <>
            <ReactApexChart options={areaOptions} series={areaSeries} type="area" width={"100%"} height={365} />
        </>
    )
}

export default SalesOverviewChart;
