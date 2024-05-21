import axios from "axios";
import { backendUrl } from "../backendUrl";

const useGetApis = () => {

    const getApiData = async ({ endpoint }) => {
        try {
            const { data } = await axios.get(
                `${backendUrl}${endpoint}`
            );
            console.log("data from usegetapi", data)
            return data
        } catch (error) {
            return error
        }
    }

    const fetchTotalInvoicesOfCustomer = async ({ customerId }) => {
        try {
            const data = await getApiData({ endpoint: `/api/addInvoice/allinvoicesbyCustomerId/${customerId}` })
            return data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const fetchTotalInvoicesOfVendors = async ({ vendorId }) => {
        try {
            const data = await getApiData({ endpoint: `/api/addPurchases/ventransactions/${vendorId}` })
            return data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const fetchInvoices = async () => {
        let data = await getApiData({ endpoint: '/api/addInvoice/invoices' });

        let totalGrandTotalValue = data.reduce((acc, invoice) => {
            return acc + (invoice.grandTotal || 0);
        }, 0);
        return { invoicesGrandTotal: totalGrandTotalValue, invoicesLength: data?.length }
    }

    const fetchPurchases = async () => {
        let data = await getApiData({ endpoint: '/api/addPurchases/purchases' });
        let totalGrandTotalValue = data.reduce((acc, invoice) => {
            return acc + (invoice.grandTotal || 0);
        }, 0);
        return { purchsesGrandTotal: totalGrandTotalValue, purchasesLength: data?.length }
    }

    const fetchExpenses = async () => {
        let data = await getApiData({ endpoint: '/api/Expense/expense' });
        let totalGrandTotalValue = data.reduce((acc, invoice) => {
            return acc + (invoice.grandTotal || 0);
        }, 0);
        return { expensesGrandTotal: totalGrandTotalValue, expensesLength: data?.length }
    }

    return { getApiData, fetchTotalInvoicesOfCustomer, fetchInvoices, fetchPurchases, fetchExpenses, fetchTotalInvoicesOfVendors }
}

export default useGetApis