const express = require("express");
const router = express.Router();

const addCustomer = require('../models/addCustomer'); 
const addVendor = require('../models/addVendor');
const addInvoice = require('../models/addInvoice');
const addPurchases = require('../models/addPurchases');
const addProduct = require("../models/addProduct");





async function customerCount1(req, res) {
    try {
        const businessId = req.query.businessId;
        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        
        const startDateCurrentMonth = new Date(currentYear, currentMonth, 1);
        const endDateCurrentMonth = new Date(currentYear, currentMonth + 1, 1);

        const startDatePreviousMonth = new Date(currentYear, currentMonth - 1, 1);
        const endDatePreviousMonth = new Date(currentYear, currentMonth, 1);

        const customers = await addCustomer.find({ businessId });
        const currentMonthCustomers = await addCustomer.find({
            businessId,
            createdAt: {
                $gte: startDateCurrentMonth,
                $lt: endDateCurrentMonth
            }
        });

        const previousMonthCustomers = await addCustomer.find({
            businessId,
            createdAt: {
                $gte: startDatePreviousMonth,
                $lt: endDatePreviousMonth
            }
        });

        const currentMonthCount = currentMonthCustomers.length;
        const previousMonthCount = previousMonthCustomers.length;
        
     

        const percentage = previousMonthCount === 0 ? 
            (currentMonthCount > 0 ? 100 : 0) :
            ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        const percentageChange=Math.round(percentage)
      
        res.status(200).json({ 
            customers,
            currentMonthCount, 
            previousMonthCount, 
            percentageChange 
        });
    } catch (error) {
      ;
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function productCount(req, res) {
    try {
        //  const {businessId} = req.body;
        let businessId = req.query.businessId; 
        console.log("businessId",businessId)
        // businessId = businessId.trim();
       
        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }
        
        const products = await addProduct.find({ businessId });
        
        res.status(200).json({ count1: products.length });
       
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
}
async function vendorCount(req, res) {
    try {
        const vendors = await addVendor.find({});
        res.status(200).json({ counts: vendors.length });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }   
    }
}

async function invoiceCount(req, res) {
    try {
        let businessId = req.query.businessId;
        businessId = businessId.trim();

        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }

        const now = new Date();
        const currentYear = now.getFullYear();

        // Initialize an array to hold the count of invoices for each month
        const monthlyInvoiceCount = new Array(12).fill(0);

        // Fetch all invoices for the given businessId for the current year
        const invoices = await addInvoice.find({
            businessId,
            invoiceDate: {
                $gte: new Date(currentYear, 0, 1),
                $lt: new Date(currentYear + 1, 0, 1)
            }
        });

        // Iterate over the invoices and count them by month
        invoices.forEach(invoice => {
            const month = invoice.invoiceDate.getMonth();
            monthlyInvoiceCount[month]++;
        });

        console.log("monthlyInvoiceCount", monthlyInvoiceCount);

        res.status(200).json({ monthlyInvoiceCount });
    } catch (error) {
        console.error("Error fetching invoice count:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
async function getInvoiceCountByRange(req, res) {
    try {
        let { businessId, startDate, endDate } = req.query;
        businessId = businessId.trim();

        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        
        let data = {};

        if (monthDiff > 12) {
            data = await getYearlyInvoiceCount(businessId, startDate, endDate);
        } else if (monthDiff >= 1) {
            data = await getMonthlyInvoiceCount(businessId, startDate, endDate);
        } else if (daysDiff > 7) {
            data = await getWeeklyInvoiceCount(businessId, startDate, endDate);
        } else {
            data = await getDailyInvoiceCount(businessId, startDate, endDate);
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching invoice count:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



async function getYearlyInvoiceCount(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const numberOfYears = endYear - startYear + 1;

    const yearlyInvoiceCount = new Array(numberOfYears).fill(0);
    const years = Array.from({ length: numberOfYears }, (_, i) => startYear + i);

    invoices.forEach(invoice => {
        const year = invoice.invoiceDate.getFullYear();
        const yearIndex = year - startYear;
        yearlyInvoiceCount[yearIndex]++;
    });

    return { years, yearlyInvoiceCount };
}

async function getMonthlyInvoiceCount(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    const numberMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

    const monthlyInvoiceCount = new Array(numberMonths).fill(0);
    const months = Array.from({ length: numberMonths }, (_, i) => new Date(startYear, startMonth + i).toLocaleString('en', { month: 'short' }));

    invoices.forEach(invoice => {
        const invoiceMonth = invoice.invoiceDate.getMonth();
        const invoiceYear = invoice.invoiceDate.getFullYear();
        const index = (invoiceYear - startYear) * 12 + (invoiceMonth - startMonth);
        if (index >= 0 && index < numberMonths) {
            monthlyInvoiceCount[index]++;
        }
    });

    return { months, monthlyInvoiceCount };
}

async function getWeeklyInvoiceCount(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const startOfWeek = date => {
        const day = date.getDay();
        return new Date(date.setDate(date.getDate() - day));
    };

    let currentWeekStart = startOfWeek(new Date(startDate));
    let weeklyInvoiceCount = {};
    let weekLabels = [];

    while (currentWeekStart <= endDate) {
        // Check if the week start is within the selected range
        if (currentWeekStart >= startDate) {
            weekLabels.push(currentWeekStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
        }
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    invoices.forEach(invoice => {
        const weekStart = (startOfWeek(new Date(invoice.invoiceDate)).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
        if (!weeklyInvoiceCount[weekStart]) {
            weeklyInvoiceCount[weekStart] = 0;
        }
        weeklyInvoiceCount[weekStart]++;
    });

    const weeklyInvoiceCounts = weekLabels.map(label => weeklyInvoiceCount[label] || 0);

    return { week: weekLabels, weeklyInvoiceCounts };
}

async function getDailyInvoiceCount(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    let currentDay = new Date(startDate);
    let dailyInvoiceCount = {};
    let dayLabels = [];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    while (currentDay <= endDate) {
        const dayName = daysOfWeek[currentDay.getDay()];
        dayLabels.push(dayName);
        currentDay.setDate(currentDay.getDate() + 1);
    }

    invoices.forEach(invoice => {
        const invoiceDay = daysOfWeek[invoice.invoiceDate.getDay()];
        if (!dailyInvoiceCount[invoiceDay]) {
            dailyInvoiceCount[invoiceDay] = 0;
        }
        dailyInvoiceCount[invoiceDay]++;
    });

    const dailyInvoiceCounts = dayLabels.map(label => dailyInvoiceCount[label] || 0);

    return { day: dayLabels, dailyInvoiceCounts };
}






async function getTotalRevenue(req,res) {
    try {
        let businessId = req.query.businessId; 
        //businessId = businessId.trim();
       
        
        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }
        const invoices = await addInvoice.find({businessId});
        let totalRevenue = 0;
        invoices.forEach(invoice => {
            totalRevenue += invoice.grandTotal || 0;
            
        });
        res.json({revenue: totalRevenue}); 
       
    } catch (error) {
       
        return 0; 
    }
}

// async function totalBalance(req, res) {
//     try {
//         const { businessId } = req.query;
//         if (!businessId) {
//             return res.status(400).json({ message: 'Business ID is required' });
//         }

//         const now = new Date();
//         const currentYear = now.getFullYear();

      
//         const invoices = await addInvoice.find({
//             businessId,
//             invoiceDate: {
//                 $gte: new Date(currentYear, 0, 1),
//                 $lt: new Date(currentYear + 1, 0, 1)
//             }
//         });

       
//         const monthlyBalances = Array(12).fill(0);

//         invoices.forEach(invoice => {
//             const month = invoice.invoiceDate.getMonth(); 
//             monthlyBalances[month] += invoice.balance || 0;
//         });
//         console.log("monthlyBalances",monthlyBalances)
//         res.json({ monthlyBalances });
//     } catch (error) {
//         console.error("Error fetching invoices:", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }


async function purchaseCount(req, res) {
    try {
        const purchases= await addPurchases.find({});
        let totalPurchases = 0;
        purchases.forEach(purchase => {
            totalPurchases += purchase.grandTotal || 0;
        });
        res.json({purchase: totalPurchases}); 
        
       
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }   
    }
}


async function totalSalesPerMonth(req, res) {
    try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        
        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 1);

        const prevMonthStartDate = new Date(currentYear, currentMonth - 1, 1);
        const prevMonthEndDate = new Date(currentYear, currentMonth, 1);

     
        const currentMonthInvoices = await addInvoice.find({
            businessId: req.query.businessId,
            invoiceDate: {
                $gte: startDate,
                $lt: endDate
            }
        });

        const prevMonthInvoices = await addInvoice.find({
            businessId: req.query.businessId,
            invoiceDate: {
                $gte: prevMonthStartDate,
                $lt: prevMonthEndDate
            }
        });

      
        const currentMonthTotalSales = currentMonthInvoices.reduce((acc, invoice) => acc + invoice.grandTotal, 0);

       
        const prevMonthTotalSales = prevMonthInvoices.reduce((acc, invoice) => acc + invoice.grandTotal, 0);

      
        const percentage = prevMonthTotalSales === 0 ? 
            (currentMonthTotalSales > 0 ? 100 : 0) :
            ((currentMonthTotalSales - prevMonthTotalSales) / prevMonthTotalSales) * 100;
        const percentageChange=Math.round(percentage)
        res.json({ 
            currentMonthTotalSales,
            prevMonthTotalSales,
            percentageChange 
        });
    } catch (error) {
       
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function totalBalancePerMonth(req, res) {
    try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1; 
        const currentYear = now.getFullYear();
        var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

        const groupedInvoices = await addInvoice.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$invoiceDate" },
                        year: { $year: "$invoiceDate" }
                    },
                    totalBalance: { $sum: "$balance" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

     

        const formattedResults = groupedInvoices.map(group => ({
            month: `${group._id.month}-${group._id.year}`,
            totalBalance: group.totalBalance
        }));

      
        const currentMonthBalance = formattedResults.find(result => 
            result.month === `${months[currentMonth-1]}`
        ) || { month: `${months[currentMonth-1]}`,totalBalance: groupedInvoices[groupedInvoices.length -1].totalBalance}; 

        res.json({ allMonths: formattedResults, currentMonth: currentMonthBalance });
    } catch (error) {
       
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getMonthlySales(req, res) {
    try {
        let businessId = req.query.businessId; 
        
        businessId = businessId.trim();
        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }

        const now = new Date();
        const currentYear = now.getFullYear();

        const monthlySales = new Array(12).fill(0);  
        const monthlyBalances = new Array(12).fill(0);  
        const monthlyPaidAmounts = new Array(12).fill(0);  

        
        const invoices = await addInvoice.find({
            businessId,
            invoiceDate: {
                $gte: new Date(currentYear, 0, 1),
                $lt: new Date(currentYear + 1, 0, 1)
            }
        });

        
        invoices.forEach(invoice => {
            const month = invoice.invoiceDate.getMonth();
            monthlySales[month] += invoice.grandTotal;
            monthlyBalances[month] += invoice.balance || 0;
        });

        for (let i = 0; i < 12; i++) {
            monthlyPaidAmounts[i] = monthlySales[i] - monthlyBalances[i];
        }

        // console.log("monthlySales", monthlySales);
        // console.log("monthlyBalances", monthlyBalances);
        // console.log("monthlyPaidAmounts", monthlyPaidAmounts);

        res.json({ monthlySales, monthlyBalances, monthlyPaidAmounts });
    } catch (error) {
        console.error("Error fetching monthly sales:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getSalesByDateRange(req, res) {
    try {
        let { businessId, startDate, endDate } = req.query;
        businessId = businessId.trim();
        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        
        let data = {};

        if (monthDiff > 12) {
            data = await getYearlySalesData(businessId, startDate, endDate);
        } else if (monthDiff > 1) {
            data = await getMonthlySalesData(businessId, startDate, endDate);
        } else if (daysDiff > 7) {
            data = await getWeeklySalesData(businessId, startDate, endDate);
        } else {
            data = await getDailySalesData(businessId, startDate, endDate);
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching sales by date range:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


async function getMonthlySalesData(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    // Calculate total number of months between startDate and endDate
    const numberMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1

    const monthlySales = new Array(numberMonths).fill(0);
    const monthlyBalances = new Array(numberMonths).fill(0);
    const monthlyPaidAmounts = new Array(numberMonths).fill(0);
    const months = Array.from({ length: numberMonths }, (_, i) => new Date(startYear, startMonth + i).toLocaleString('en', { month: 'short' }));

    invoices.forEach(invoice => {
        const invoiceMonth = invoice.invoiceDate.getMonth();
        const invoiceYear = invoice.invoiceDate.getFullYear();
        const index = (invoiceYear - startYear) * 12 + (invoiceMonth - startMonth);
        if (index >= 0 && index < numberMonths) {
            monthlySales[index] += invoice.grandTotal;
            monthlyBalances[index] += invoice.balance || 0;
        }
    });

    for (let i = 0; i < numberMonths; i++) {
        monthlyPaidAmounts[i] = monthlySales[i] - monthlyBalances[i];
    }

    return { months, monthlySales, monthlyBalances, monthlyPaidAmounts };
}


async function getYearlySalesData(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const numberOfYears = endYear - startYear + 1;

    const yearlySales = new Array(numberOfYears).fill(0);
    const yearlyBalances = new Array(numberOfYears).fill(0);
    const yearlyPaidAmounts = new Array(numberOfYears).fill(0);
    const years = Array.from({ length: numberOfYears }, (_, i) => startYear + i);

    invoices.forEach(invoice => {
        const year = invoice.invoiceDate.getFullYear();
        const yearIndex = year - startYear;
        yearlySales[yearIndex] += invoice.grandTotal;
        yearlyBalances[yearIndex] += invoice.balance || 0;
    });

    for (let i = 0; i < numberOfYears; i++) {
        yearlyPaidAmounts[i] = yearlySales[i] - yearlyBalances[i];
    }

    return { years, yearlySales, yearlyBalances, yearlyPaidAmounts };
}

// async function getWeeklySalesData(businessId, startDate, endDate) {
//     const invoices = await addInvoice.find({
//         businessId,
//         invoiceDate: {
//             $gte: startDate,
//             $lte: endDate
//         }
//     });

//     const startOfWeek = date => {
//         const day = date.getDay();
//         return new Date(date.setDate(date.getDate() - day));
//     };

//     let currentWeekStart = startOfWeek(new Date(startDate));
//     let weekSales = {};
//     let weekLabels = [];

//     while (currentWeekStart <= endDate) {
//         weekLabels.push(currentWeekStart.toLocaleDateString());
//         currentWeekStart.setDate(currentWeekStart.getDate() + 7);
//     }

//     invoices.forEach(invoice => {
//         const weekStart = startOfWeek(new Date(invoice.invoiceDate)).toLocaleDateString();
//         if (!weekSales[weekStart]) {
//             weekSales[weekStart] = { unpaid: 0, paid: 0 };
//         }
//         weekSales[weekStart].unpaid += invoice.balance || 0;
//         weekSales[weekStart].paid += (invoice.grandTotal - (invoice.balance || 0));
//     });

//     const weeklyBalances = weekLabels.map(label => weekSales[label]?.unpaid || 0);
//     const weeklyPaidAmounts = weekLabels.map(label => weekSales[label]?.paid || 0);

//     return { weeks: weekLabels, weeklyBalances, weeklyPaidAmounts };
// }
async function getWeeklySalesData(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const startOfWeek = date => {
        const day = date.getDay();
        return new Date(date.setDate(date.getDate() - day));
    };

    let currentWeekStart = startOfWeek(new Date(startDate));
    let weekSales = {};
    let weekLabels = [];

    while (currentWeekStart <= endDate) {
        // Check if the week start is within the selected range
        if (currentWeekStart >= startDate) {
            weekLabels.push(currentWeekStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
        }
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    invoices.forEach(invoice => {
        const weekStart = (startOfWeek(new Date(invoice.invoiceDate)).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
        if (!weekSales[weekStart]) {
            weekSales[weekStart] = { unpaid: 0, paid: 0 };
        }
        weekSales[weekStart].unpaid += invoice.balance || 0;
        weekSales[weekStart].paid += (invoice.grandTotal - (invoice.balance || 0));
    });

    const weeklyBalances = weekLabels.map(label => weekSales[label]?.unpaid || 0);
    const weeklyPaidAmounts = weekLabels.map(label => weekSales[label]?.paid || 0);

    return { weeks: weekLabels, weeklyBalances, weeklyPaidAmounts };
}






async function getDailySalesData(businessId, startDate, endDate) {
    const invoices = await addInvoice.find({
        businessId,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });

    let daySales = {};
    let dayLabels = [];

    let currentDay = new Date(startDate);
    while (currentDay <= endDate) {
        dayLabels.push(currentDay.toLocaleDateString('en-US', { weekday: 'short' }));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    invoices.forEach(invoice => {
        const day = new Date(invoice.invoiceDate).toLocaleDateString('en-US', { weekday: 'short' });
        if (!daySales[day]) {
            daySales[day] = { unpaid: 0, paid: 0 };
        }
        daySales[day].unpaid += invoice.balance || 0;
        daySales[day].paid += (invoice.grandTotal - (invoice.balance || 0));
    });

    const dailyBalances = dayLabels.map(label => daySales[label]?.unpaid || 0);
    const dailyPaidAmounts = dayLabels.map(label => daySales[label]?.paid || 0);

    return { days: dayLabels, dailyBalances, dailyPaidAmounts };
}



module.exports = {vendorCount,getMonthlySales, productCount,getTotalRevenue, purchaseCount,totalSalesPerMonth,totalBalancePerMonth,customerCount1,invoiceCount,getSalesByDateRange,getInvoiceCountByRange};



