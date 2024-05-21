import axios from "axios";
import { toast } from "react-toastify";

const useDeleteSales = () => {
    const handleDeleteInvoice = async ({ invoiceId, setDatasource, datasource, setFilteredDatasource }) => {
        console.log("invoiceIdasdafs", invoiceId)
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/addInvoice/invoices/delete/${invoiceId}`
            );
            if (response.status === 200) {
                toast.success("Deleted Invoice Successfully")
                const deletedInvoice = datasource.find(
                    (item) => item._id === invoiceId
                );
                setDatasource((prevData) =>
                    prevData.filter((item) => item._id !== invoiceId)
                );
                setFilteredDatasource((prevData) =>
                    prevData.filter((item) => item._id !== invoiceId)
                );
            } else {
                console.error("Failed to delete invoice:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };

    const handleDeleteCreditnotes = async ({ creditnotesId, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/creditNotes/creditNotesdelete/${creditnotesId}`
            );

            toast.success("Deleted Invoice Successfully")

            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== creditnotesId)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== creditnotesId)
            );

        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };

    const handleDeleteSalesReturns = async ({ salesReturnId, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/SalesReturn/salesReturndelete/${salesReturnId}`
            );

            toast.success("Deleted Invoice Successfully")

            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== salesReturnId)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== salesReturnId)
            );

        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };

    const handleProformaDelete = async ({ proformaInvoiceid, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(`http://localhost:8000/api/performa/deleteperforma/${proformaInvoiceid}`);
            toast.success("Deleted Invoice Successfully")
            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== proformaInvoiceid)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== proformaInvoiceid)
            );
        } catch (error) {
            console.error('An error occurred while deleting the Proforma record:', error);
        }
    };

    const handleDeleteQuotation = async ({ quotationInvoiceid, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/addQuotation/quotationdelete/${quotationInvoiceid}`
            );
            toast.success("Deleted Invoice Successfully")
            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== quotationInvoiceid)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== quotationInvoiceid)
            );

        } catch (error) {
            console.error("Error deleting quotation:", error);
        }
    };

    const handleDeletePurchase = async ({ purchasesId, setDatasource, setFilteredDatasource }) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/addPurchases/purchases/delete/${purchasesId}`
            );
            if (response.status === 200) {
                toast.success("Deleted Invoice Successfully")
                setDatasource((prevData) =>
                    prevData.filter((item) => item._id !== purchasesId)
                );
                setFilteredDatasource((prevData) =>
                    prevData.filter((item) => item._id !== purchasesId)
                );
            } else {
                console.error("Failed to delete purchase:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };

    const handleDeletePurchaseReturn = async ({ purchaseReturnId, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/purchaseReturn/deletedpurchasesreturn/${purchaseReturnId}`
            );
            toast.success("Deleted Invoice Successfully")
            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== purchaseReturnId)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== purchaseReturnId)
            );
        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };

    const handleDeleteDebitNotes = async ({ debitNotesId, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/debitNotes/deletedebitNotes/${debitNotesId}`
            );
            toast.success("Deleted Invoice Successfully")
            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== debitNotesId)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== debitNotesId)
            );

        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };

    const handleDeletePurchaseOrders = async ({ purchaseORId, setDatasource, setFilteredDatasource }) => {
        console.log("setDatasourcesdfarwpurchase", setDatasource)
        try {
            await axios.delete(
                `http://localhost:8000/api/purchaseorder/deletepurchaseOrders/${purchaseORId}`
            );
            toast.success("Deleted Invoice Successfully")
            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== purchaseORId)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== purchaseORId)
            );
        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };


    const handleExpensesDelete = async ({ expenseId, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/Expense/deletedexpense/${expenseId}`
            );
            toast.success("Deleted Invoice Successfully")
            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== expenseId)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== expenseId)
            );
        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };


    const handleExpenseProductDelete = async ({ exproductId, setDatasource, setFilteredDatasource }) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/exproduct/deletex/${exproductId}`
            );

            toast.success("Deleted Expense Product Successfully")
            setDatasource((prevData) =>
                prevData.filter((item) => item._id !== exproductId)
            );
            setFilteredDatasource((prevData) =>
                prevData.filter((item) => item._id !== exproductId)
            );
        } catch (error) {
            console.error('An error occurred while deleting the exproduct record:', error);
        }
    };

    const handleDeleteDelChallen = async ({ delChallenInvoiceid, setDatasource, setFilteredDatasource }) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/delChallen/deletedelChallen/${delChallenInvoiceid}`
            );
            toast.success("Deleted Invoice Successfully");
            
            setDatasource(prevData =>
                prevData.filter(item => item._id !== delChallenInvoiceid)
            );
    
            setFilteredDatasource(prevData =>
                prevData.filter(item => item._id !== delChallenInvoiceid)
            );
        } catch (error) {
            console.error("Error deleting purchase:", error);
        }
    };
    

    return { handleDeleteInvoice, handleDeleteSalesReturns, handleDeleteCreditnotes, handleProformaDelete, handleDeleteQuotation, handleDeletePurchase, handleDeletePurchaseReturn, handleDeleteDebitNotes, handleDeletePurchaseOrders, handleExpensesDelete, handleExpenseProductDelete, handleDeleteDelChallen }
}

export default useDeleteSales