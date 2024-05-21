const useDashboardHooks = () => {
    // function getPreviousMonths(monthsNum) {
    //     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //     let months = [];
    //     let currentDate = new Date();
    //     for (let i = 0; i < monthsNum; i++) {
    //         let monthIndex = currentDate.getMonth();
    //         let monthName = monthNames[monthIndex];
    //         months.push(monthName);
    //         currentDate.setMonth(monthIndex - 1);
    //     }
    //     return months;
    // }

    function getPreviousMonths(monthsNum) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let months = [];
        let currentDate = new Date();
        for (let i = 0; i < monthsNum; i++) {
            let monthIndex = currentDate.getMonth();
            let year = currentDate.getFullYear();
            let monthName = monthNames[monthIndex];
            months.push(monthName + ' ' + year);
            currentDate.setMonth(monthIndex - 1);
        }
        return months;
    }

    function calculateAverage(entries, objVar) {
        if (entries.length === 0) {
            return 0;
        }
        const monthCounts = new Map();
        entries.forEach(entry => {
            let formatDate = entry?.[objVar];
            const yearMonth = formatDate.slice(0, 7);
            monthCounts.set(yearMonth, (monthCounts.get(yearMonth) || 0) + 1);
        });
        const totalMonths = monthCounts.size;
        const totalEntries = entries.length;
        const average = Math.round(totalEntries / totalMonths);
        return average;
    }

    function calculateAverageOnGrandTotal(entries, objVar, dateVar) {
        if (entries.length === 0) {
            return 0;
        }
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let receivedMonths = [];
        entries.map((item) => {
            let currentDate = new Date(item?.[dateVar]);
            let itemMonth = currentDate.getMonth();
            let year = currentDate.getFullYear();
            if (!receivedMonths.includes(monthNames[itemMonth] + ' ' + year)) {
                receivedMonths.push(monthNames[itemMonth] + ' ' + year)
            }
        })
        var total = entries.reduce(function (acc, curr) {
            return acc + (curr?.[objVar] || 0);
        }, 0);
        console.log(receivedMonths)
        let average = Math.round(total / receivedMonths.length);
        return average;
    }
    // function calculateAverageOnGrandTotal(entries, objVar, dateVar) {
    //     if (entries.length === 0) {
    //         return 0;
    //     }
    //     let receivedMonths = [];
    //     entries.map((item) => {
    //         let itemMonth = new Date(item?.[dateVar]).getMonth();
    //         if (!receivedMonths.includes(itemMonth)) {
    //             receivedMonths.push(itemMonth)
    //         }
    //     })
    //     var total = entries.reduce(function (acc, curr) {
    //         return acc + (curr?.[objVar] || 0);
    //     }, 0);
    //     let average = Math.round(total / receivedMonths.length);
    //     return average;
    // }

    const handleChartMonthsChange = ({ e, setState, state, setErrorState, name }) => {
        let value = e
        setState({ ...state, [name]: value })
        if (!value) {
            setErrorState(true)
            return;
        }
        let regex = /^[1-9][0-9]*$/;
        if (!regex.test(value)) {
            setErrorState(true)
            return;
        }
        setErrorState(false)
    }

    return { getPreviousMonths, calculateAverage, calculateAverageOnGrandTotal, handleChartMonthsChange }
}

export default useDashboardHooks