const useFormHandler = () => {
    const getNextInvoiceNumber = ({ datasource }) => {
        if (datasource.length === 0) {
            return 1;
        } else {
            const maxInvoiceNumber = Math.max(
                ...datasource.map((invoice) => invoice.invoiceNumber)
            );
            return maxInvoiceNumber + 1;
        }
    };

    const handleCustomerChange = ({ fieldName, value, setValidation, index, setFormData }) => {
        if (value) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                [fieldName]: true,
            }));
        }
        setFormData({ ...formData, [fieldName]: value });
    };

    const handleDateChange = ({ fieldName, date, formData, setFormData }) => {

        if (
            date &&
            Object.prototype.toString.call(date) === "[object Date]" &&
            !isNaN(date)
        ) {
            date.setHours(0, 0, 0, 0);

            const timeDiff = Math.abs(
                date.getTime() - formData?.invoiceDate.getTime()
            );
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            const paymentTerms = diffDays;

            setFormData((prevData) => ({
                ...prevData,
                [fieldName]: date,
                paymentTerms: paymentTerms.toString(),
            }));

            // Update Due Date based on Payment Terms
            if (fieldName === "paymentTerms" && formData.invoiceDate) {
                const dueDate = new Date(formData.invoiceDate);
                dueDate.setDate(dueDate.getDate() + parseInt(date, 10));
                setFormData((prevData) => ({
                    ...prevData,
                    dueDate,
                }));
            }

            // Update Payment Terms based on Due Date
            if (fieldName === "dueDate" && formData.invoiceDate) {
                const differenceInDays = Math.floor(
                    (date - formData.invoiceDate) / (24 * 60 * 60 * 1000)
                );
                setFormData((prevData) => ({
                    ...prevData,
                    paymentTerms: differenceInDays.toString(),
                }));
            }
        }
    };

    return { getNextInvoiceNumber, handleCustomerChange, handleDateChange }
}

export default useFormHandler