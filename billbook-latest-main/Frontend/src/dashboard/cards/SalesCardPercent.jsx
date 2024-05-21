import React, { useEffect, useState } from 'react'
import useGetApis from '../../ApiHooks/useGetApi';
import useDashboardHooks from '../hooks/useDashboardHooks';
import ReactApexChart from 'react-apexcharts';

const SalesCardPercent = () => {
    const { getApiData } = useGetApis();
    const { getPreviousMonths, calculateAverageOnGrandTotal } = useDashboardHooks();
    const [average, setAverage] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [colorOnPercent, setColorOnPercent] = useState("#fd5547");

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                let data = await getApiData({ endpoint: `/api/addInvoice/invoices` })
                setDataSource(data);
                const average = calculateAverageOnGrandTotal(data, "grandTotal", "invoiceDate");
                setAverage(average);
                const percentages = getPreviousFiveMonthsPercentageOnEntries(data, average);
                setColorOnPercent(percentages[0] > 70 ? "#34B53A" : ((percentages[0] < 70 && percentages[0] > 40) ? "#f8ed62" : "#fd5547"))
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

        console.log(data)

        data &&  data?.forEach((item) => {
            let currentDate = new Date(item?.invoiceDate);
            let monthIndex = currentDate.getMonth();
            let year = currentDate.getFullYear();
            let monthName = monthNames[monthIndex];
            let found = updatedState.indexOf(monthName + ' ' + year);

            if (found !== -1) {
                newArr[found] = {
                    ...newArr[found], count: newArr[found].count + item?.grandTotal, percentage: (Math.round(((newArr[found].count + item?.grandTotal) / average) * 100))
                }; // Increment count for the found month
            }
        });
        let dataArr = newArr.map((item) => item.percentage) || []
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
        labels: ['Sales'],
        colors: [colorOnPercent],
        // colors: ['#34B53A'],
    };

    return (
        <>
            <ReactApexChart options={option1} series={option1.series} type="radialBar" height={200} />
        </>
    )
}

export default SalesCardPercent