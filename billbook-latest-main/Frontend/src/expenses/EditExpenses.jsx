import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import FeatherIcon from "feather-icons-react";
import Select2 from "react-select2-wrapper";
import "regenerator-runtime/runtime";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Select, Input, Button } from "antd";
// import AddvendorModal from "./AddvendorModal";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { backendUrl } from "../backendUrl";
import BackButton from "../invoices/Cards/BackButton";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";

const EditExpenses = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isAnotherModalVisible, setIsAnotherModalVisible] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  const handleProductCancel = () => {
    setIsProductModalVisible(false);
  };

  const handleProductSelect = (exproductId) => {
    setSelectedProductModal(exproductId);
    setIsAnotherModalVisible(true);
    setIsProductModalVisible(false);
  };

  const [productsAdded, setProductsAdded] = useState(false);

  const handleAddProducts = () => {
    setProductsAdded(true);
  };

  const [updateExpenses1, setUpdateExpenses1] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [selectedCitys, setSelectedCitys] = useState("");
  const [currencyValue, setCurrencyValue] = useState(0);

  const [totalAmounts, setTotalAmounts] = useState();
  const [grandTotalInSelectedCurrency, setGrandTotalInSelectedCurrency] =
    useState(0);
  console.log("grandTotalInSelectedCurrency", grandTotalInSelectedCurrency);
  const [datasource, setDatasource] = useState([]);

  const fetchCurrencyData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/AddCurrency/currency`
      );
      setCurrencyData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/Expense/expense`)
      .then((response) => {
        console.log(response.data);
        setDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log("datasource", datasource);

  useEffect(() => {
    console.log("totalAmounts:", totalAmounts);
    console.log("selectedCitys.currencyValue:", selectedCitys?.currencyValue);

    if (
      selectedCitys &&
      selectedCitys.currencyValue !== undefined &&
      !isNaN(totalAmounts)
    ) {
      const exchangeRate = selectedCitys.currencyValue || 1;
      const grandTotalInSelected = totalAmounts * exchangeRate;
      const roundedGrandTotal = isNaN(grandTotalInSelected)
        ? 0
        : Number(grandTotalInSelected);
      setGrandTotalInSelectedCurrency(roundedGrandTotal);

      // Divide newTotalAmount by currencyValue
      const convertedAmount = totalAmounts / exchangeRate;
      setConvertedTotalInSelectedCurrency(
        isNaN(convertedAmount) ? 0 : Number(convertedAmount)
      );
    }
  }, [selectedCitys, totalAmounts]);

  const [bankData, setBankData] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState([]);

  console.log("selectedAccount", selectedAccount);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/BankDeatils/bank-details`
      );
      console.log("databank:", response.data);
      setBankData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log("detailsinvoice", bankData);

  const bankoptions = bankData.map((cus) => ({
    id: cus._id,
    text: cus.branchName,
  }));


  const handleAccountChange = (event) => {
    const selectedBranchName = event.target.value;
    const account = bankData.find(
      (account) => account._id === selectedBranchName
    );
    setSelectedAccount(account);
    setFormData((prevFormData) => ({
      ...prevFormData,
      bankDetails: {
        ...prevFormData.bankDetails,
        selectBank: selectedBranchName,
      },
    }));
  };

  const [menu, setMenu] = useState(false);

  const [gstData, setGstData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalTaxPercentage, setTotalTaxPercentage] = useState(0);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [cgstTaxAmount, setcgstTaxAmount] = useState(0);
  const [sgstTaxAmount, setsgstTaxAmount] = useState(0);
  const [totalDiscountPercentage, setTotalDiscountPercentage] = useState(0);

  const [cgstTaxPercentage, setCgstTaxPercentage] = useState(0);
  const [sgstTaxPercentage, setSgstTaxPercentage] = useState(0);

  const [customer, setCustomer] = useState([]);
  const [customerUniqueid, setCustomerUniqueid] = useState([]);
  console.log("customer", customer);
  console.log("customerUniqueid", customerUniqueid[0]?.partyId);

  const CustomerUID = customerUniqueid[0]?.partyId;
  console.log("CustomerUID", CustomerUID);

  const customeroptions = customer.map((cus) => ({
    id: cus._id,
    text: cus.partyName,
  }));

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/Parties/party`
        );
        console.log("vendors", response.data);
        setCustomer(
          // { id: 1, text: "Select Item Category" },
          response.data
        );
        setCustomerUniqueid(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const [paymentMode, setPaymentMode] = useState("");
  const [formData, setFormData] = useState({
    expenseName: "Expense Invoice",
    expenseNumber: 1,
    partyName: "",
    expenseDate: new Date(),
    expenseCategory: "",
    referenceNo: "",
    products: "",
    paymentMode: "",
    currency: 0,
    originalInvoiceNumber: "",
    notes: "",
    balance: "",
    grandTotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    totalTaxPercentage: 0,
    taxableAmount: 0,
    cgstTaxAmount: 0,
    sgstTaxAmount: 0,
    totalDiscountPercentage: 0,
    cgstTaxPercentage: 0,
    sgstTaxPercentage: 0,
    balance: 0,
    table: [],
    bankDetails: {
      selectBank: "",
      notes: "",
      grandTotal: "",
      totalDiscount: 0,
      totalGst: 0,
      uploadReceipt: null
    },
  });
  const [validation, setValidation] = useState({
    expenseCategory: true,
    paymentMode: true,
    originalInvoiceNumber: { isdataValid: true, message: "" },
  })

  console.log("formdata", formData);

  useEffect(() => {
    console.log("Component updated:", formData);
  }, [formData]);


  const handleDateChange = (fieldName, date) => {
    if (date instanceof Date && !isNaN(date)) {
      const isoDate = date.toISOString();
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: isoDate,
      }));
    }
  };


  useEffect(() => {
    const fetchExpenseDetails = async (id) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/Expense/Expense/${id}`
        );
        if (response.ok) {
          const expenseDetails = await response.json();
          setFormData(expenseDetails);
        } else {
          console.error("Failed to fetch creditnotes details");
        }
      } catch (error) {
        console.error("Error fetching creditnotes details", error);
      }
    };

    fetchExpenseDetails(id);
  }, [id]);
  const [productsSelected, setProductsSelected] = useState(false);

  const [editExpenseid, setEditExpenseid] = useState("");
  const editExpensesidUpdate = (value) => {
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    setEditExpenseid(value);
    setUpdateExpenses1(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/Expense/update-expense/${id}`,
        { formData }
      );

      console.log("Data submitted successfully:", response.data);

      toast.success("Expenses Added Succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      history.push(`/view-expenses/${response.data._id}`);
    } catch (error) {
      toast.success("Error submitting data", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error submitting data:", error);
    }
  };

  console.log("formData", formData);

  const fetchGstData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/addgst/gst`);
      setGstData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGstData();
  }, []);

  const [exCategory, setExCategory] = useState([]);


  const fetchExCategoryData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/ExpenseCat/expensecat`
      );
      setExCategory(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchExCategoryData();
  }, []);

  console.log("exCategory", exCategory);

  const validateFormData = (formData) => {
    const validationErrors = {};

    if (!formData.partyName) {
      validationErrors.partyName = {
        isValid: false,
        message: "Please select a Party name",
      };
    }
    if (!PurchaseInput && !productsSelected) {
      validationErrors.productsSelected = {
        isValid: false,
        message: "Please select products",
      };
      console.error("Please select products");
    }
    return validationErrors;
  };
  const handleInputChange = (fieldName, value, index) => {
    if (value) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        expenseCategory: true,
        partyName: true,
      }));
    }
    const priceRegex = /^[0-9\s]*$/;
    let isdataValid = true;
    let message = "";
    if (fieldName === "originalInvoiceNumber") {
      isdataValid = priceRegex.test(value);
      message = 'Invalid value';
    }
    setValidation({
      ...validation,
      [fieldName]: { isdataValid, message },
    });
    setFormData({ ...formData, [fieldName]: value });
    setFormData((prevData) => {
      const updatedState = { ...prevData };
      const updatevar = { ...updatedState.table[index] };

      // Parse old values
      const oldQuantity = parseFloat(updatevar.quantity) || 0;
      const oldDiscount = parseFloat(updatevar.discount) || 0;
      const oldGstAmount = parseFloat(updatevar.totalGstAmount) || 0;

      // Update the field value
      updatevar[fieldName] = parseFloat(value);

      // Parse new values
      const newQuantity = parseFloat(updatevar.quantity) || 0;
      const newDiscount = parseFloat(updatevar.discount) || 0;
      const newGstAmount = parseFloat(updatevar.totalGstAmount) || 0;
      const newPrice = parseFloat(updatevar.price) || 0;

      console.log("Old values:", {
        oldQuantity,
        oldDiscount,
        oldGstAmount,
      });
      console.log("New values:", {
        newQuantity,
        newDiscount,
        newGstAmount,
        newPrice,
      });

      // Calculate total amount based on the field changed
      if (fieldName === "price") {
        const totalAmountBeforeDiscount = newQuantity * newPrice;
        const discountAmount = (newDiscount / 100) * totalAmountBeforeDiscount;
        const totalAmount = totalAmountBeforeDiscount - discountAmount;

        const gstAfterEnteringPrice = (totalAmount * newGstAmount) / 100;
        updatevar.totalGstAmount = gstAfterEnteringPrice;
        updatevar.totalAmount = totalAmount + gstAfterEnteringPrice;
      } else {
        updatevar.totalAmount =
          newQuantity * newPrice - newDiscount + newGstAmount;
      }

      // Update the state
      updatedState.table[index] = updatevar;
      return updatedState;
    });

    calculateTotalAmountForAllProducts();
    calculateTotalAmountForAllProductswithcurrency(
      selectedCitys?.currencyValue
    );
  };

  const calculateTotalAmountForAllProducts = () => {
    let total = 0;
    formData.table.forEach((item) => {
      total +=
        parseFloat((item.totalAmount || 0) - (item.totalDiscount || 0) + (item.totalTax || 0)) || 0;
    });
    const roundedTotal = total;
    setTotalAmount(roundedTotal);
    // currencyConverter(roundedTotal);
    setFormData((prevFormData) => ({
      ...prevFormData,
      grandTotal: total,
    }));
  };

  const calculateTotalAmountForAllProductswithcurrency = (currencyValue) => {
    let total = 0;
    formData.table.forEach((item) => {
      total +=
        parseFloat(item.totalAmount - item.totalDiscount + item.totalTax) || 0;
    });
    const roundedTotal = total;
    setTotalAmount(roundedTotal);
    // currencyConverter(roundedTotal);
    setFormData((prevFormData) => ({
      ...prevFormData,
      grandTotal: total,
    }));
  };

  const currencyConverter = (roundedTotal) => {
    if (selectedCitys && currencyValue !== undefined && !isNaN(roundedTotal)) {
      console.log("Converting currency. Values:", {
        selectedCitys,
        currencyValue,
        roundedTotal,
      });

      const exchangeRate = currencyValue || 1;
      const grandTotalInSelected = roundedTotal / exchangeRate;
      const roundedGrandTotal = +grandTotalInSelected ?? 0;

      console.log("Converted amount:", roundedGrandTotal);
    }
  };

  useEffect(() => {
    calculateTotalAmountForAllProducts(selectedCitys?.currencyValue);
  }, [formData.table, selectedCitys?.currencyValue]);

  const calculateTotaldiscountForAllProducts = () => {
    let totalDiscountAmount = 0;
    let totalDiscountPercentage = 0;

    formData.table && formData.table.forEach((item) => {
      const discountPercentage = parseFloat(item.discount) || 0;
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 1;

      const discountAmount = (price * quantity * discountPercentage) / 100;
      totalDiscountAmount += discountAmount;
      totalDiscountPercentage += discountPercentage;
    });

    setTotalDiscount(totalDiscountAmount);
    setTotalDiscountPercentage(totalDiscountPercentage);
  };

  const calculateTotaltaxForAllProducts = () => {
    let totalTaxAmount = 0;
    let totalTaxPercentage = 0;
    let cgstTaxAmount = 0;
    let sgstTaxAmount = 0;
    let totalCgstPercentage = 0;
    let totalSgstPercentage = 0;

    formData.table && formData.table.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const discountPercentage = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const gstRate = parseFloat(item.gstRate) || 0;

      const discountAmount = (price * quantity * discountPercentage) / 100;
      const discountedPrice = price - discountAmount;

      const taxableAmount = price * quantity - discountAmount;

      if (gstRate > 0) {
        const taxAmount = (taxableAmount * gstRate) / 100;

        totalTaxAmount += taxAmount;
        totalTaxPercentage += gstRate;

        const cgstAmount = taxAmount / 2;
        const sgstAmount = taxAmount / 2;

        cgstTaxAmount += cgstAmount;
        sgstTaxAmount += sgstAmount;

        // Calculate CGST and SGST percentages
        totalCgstPercentage += gstRate / 2;
        totalSgstPercentage += gstRate / 2;
      }
    });

    setTotalTax(totalTaxAmount);
    setTotalTaxPercentage(totalTaxPercentage);
    setcgstTaxAmount(cgstTaxAmount);
    setsgstTaxAmount(sgstTaxAmount);
    setCgstTaxPercentage(totalCgstPercentage);
    setSgstTaxPercentage(totalSgstPercentage);
  };

  const calculateTotaltaxableForAllProducts = () => {
    let totalTaxableAmount = 0;

    formData.table && formData.table.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const discountPercentage = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;

      const discountAmount = (price * quantity * discountPercentage) / 100;
      const discountedPrice = price - discountAmount;
      totalTaxableAmount += price * quantity - discountAmount;
    });

    setTaxableAmount(totalTaxableAmount);
  };

  useEffect(() => {
    calculateTotalAmountForAllProducts();
  }, [formData.table]);

  useEffect(() => {
    calculateTotaldiscountForAllProducts();
  }, [formData.table]);

  useEffect(() => {
    calculateTotaltaxForAllProducts();
  }, [formData.table]);

  useEffect(() => {
    calculateTotaltaxForAllProducts();
  }, [formData.table]);

  useEffect(() => {
    calculateTotaltaxableForAllProducts();
  }, [formData.table]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      grandTotal: totalAmount,
      balance: totalAmount,
      totalDiscount: totalDiscount,
      totalTax: totalTax,
      taxableAmount: taxableAmount,
      cgstTaxAmount: cgstTaxAmount,
      sgstTaxAmount: sgstTaxAmount,
      totalTaxPercentage: totalTaxPercentage,
      totalDiscountPercentage: totalDiscountPercentage,
      cgstTaxPercentage: cgstTaxPercentage,
      sgstTaxPercentage: sgstTaxPercentage,
    }));
  }, [
    totalAmount,
    totalDiscount,
    totalTax,
    taxableAmount,
    cgstTaxAmount,
    sgstTaxAmount,
    totalTaxPercentage,
    totalDiscountPercentage,
    cgstTaxPercentage,
    sgstTaxPercentage,
  ]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          bankDetails: {
            ...prevData.bankDetails,
            signatureImage: reader.result,
          },
        }));
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const handleQuantityChange = (e, index, fieldName) => {
    const value = parseFloat(e.target.value) || 0;

    setFormData((prevData) => {
      const updatedTable = [...prevData.table];
      const updatedItem = { ...updatedTable[index] };

      updatedItem[fieldName] = value;
      updatedItem.totalAmount = calculateTotalAmountForItem(updatedItem);

      updatedTable[index] = updatedItem;

      return {
        ...prevData,
        table: updatedTable,
      };
    });
  };

  const calculateTotalAmountForItem = (item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseFloat(item.quantity) || 1;
    const discount = parseFloat(item.discount) || 0;
    const gstRate = parseFloat(item.gstRate) || 0;

    const totalAmountBeforeDiscount = price * quantity;
    const discountAmount = (discount / 100) * totalAmountBeforeDiscount;
    const discountedAmount = totalAmountBeforeDiscount - discountAmount;

    let totalAmount = discountedAmount;

    if (gstRate > 0) {
      const taxAmount = (discountedAmount * gstRate) / 100;
      totalAmount += taxAmount;
    }

    return totalAmount;
  };

  const handleDiscountChange = (e, index) => {
    const newDiscount = parseFloat(e.target.value);

    if (!isNaN(newDiscount)) {
      handletableFieldChange(index, "discount", newDiscount);
    } else {
      console.error("Invalid Discount:", e.target.value);
    }
  };

  const handletableFieldChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedTable = [...prevData.table];
      updatedTable[index][field] = value;

      calculateTotalAmount(index);
      return {
        ...prevData,
        table: updatedTable,
      };
    });
  };

  const calculateTotalAmount = (index) => {
    setFormData((prevData) => {
      const updatedTable = [...prevData.table];
      const product = updatedTable[index];

      const quantity = Math.max(1, parseFloat(product.quantity) || 0);
      const discount = parseFloat(product.discount) || 0;
      const gstRate = parseFloat(product.gstRate) || 0;

      const totalAmountBeforeDiscount = product.price * quantity;
      const discountAmount = (discount / 100) * totalAmountBeforeDiscount;
      const totalAmount = totalAmountBeforeDiscount - discountAmount;

      let calculatedGst = 0;
      let cgst = 0;
      let sgst = 0;

      if (!isNaN(gstRate) && gstRate !== 0) {
        calculatedGst = (totalAmount * gstRate) / 100;
        cgst = calculatedGst / 2;
        sgst = calculatedGst / 2;
      }

      product.cgstAmount = cgst;
      product.sgstAmount = sgst;
      product.totalGstAmount = calculatedGst;
      product.totalAmount = totalAmount + calculatedGst;

      return {
        ...prevData,
        table: updatedTable,
      };
    });
  };

  const handleChangeTableField = (index, field, value) => {
    setFormData((prevData) => {
      const updatedTable = [...prevData.table];
      const updatedItem = { ...updatedTable[index] };

      updatedItem[field] = parseFloat(value) || 0;
      console.log("field in total amount", updatedItem[field]);

      const newTotalAmount = updatedItem.totalAmount || 0;
      console.log("newTotalAmount", newTotalAmount);
      const previousTotalGstAmount =
        parseFloat(updatedItem.totalGstAmount) || 0;
      const previousDiscountAmount = parseFloat(updatedItem.discount) || 0;
      const previousQuantity = parseFloat(updatedItem.quantity) || 0;
      const gstrate = parseFloat(updatedItem.gstRate) || 0;

      if (field === "totalAmount" && !isNaN(newTotalAmount)) {
        const newprice = newTotalAmount / (1 + gstrate / 100);

        updatedItem.price =
          newprice / previousQuantity + previousDiscountAmount;
      } else if (field === "price") {
        updatedItem.totalAmount =
          parseFloat(value) +
          previousTotalGstAmount -
          previousDiscountAmount * previousQuantity;
      }

      updatedTable[index] = updatedItem;

      return {
        ...prevData,
        table: updatedTable,
      };
    });
  };

  const [selectedproduct, setSelectedProduct] = useState(null);
  console.log("selected product", selectedproduct);
  const [selectedProductId, setSelectedProductId] = useState([]);

  console.log("productby id", selectedProductId);

  const fetchProductsbyId = async (selectedproduct) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/exproduct/exproducts/${selectedproduct}`
      );
      console.log(response.data);
      setSelectedProductId(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (selectedproduct) {
      fetchProductsbyId(selectedproduct);
    }
  }, [selectedproduct]);

  const [product, setProduct] = useState([]);
  console.log("product", product);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/exproduct/exproducts`
      );
      console.log(response.data);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleproductchange = (productId, godownId) => {

    const newTable = [...formData.table];
    newTable.push({
      productName: PurchaseInput,
      price: 0,
      quantity: 1,
      discount: 0,
      tax: 0,
      gstRate: 0,
      totalAmount: 0,
      totalDiscount: "",
      totalTax: 0,
      totalGstAmount: 0,
    });
    setPurchaseInput("");
    console.log("NEW TABLE ---", newTable);
    setFormData({
      ...formData,
      table: newTable,
    });
    setProductsSelected(true);
  };

  const notify = () => {
    toast.success("Product selected successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleDeleteItem = (index) => {
    const updatedTable = [...formData.table];
    updatedTable.splice(index, 1);
    setFormData({ ...formData, table: updatedTable });
  };


  const handlePaymentModeChange = (fieldName, value, index) => {
    if (value) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        paymentMode: true,
      }));
    } setPaymentMode(value); // Update paymentMode state
    setFormData({ ...formData, [paymentMode]: value }); // Update formData with new paymentMode value
  };
  const [PurchaseInput, setPurchaseInput] = useState("");

  const handleFilereciptChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          bankDetails: {
            ...prevData.bankDetails,
            uploadReceipt: reader.result,
          },
        }));
      };

      reader.readAsDataURL(selectedFile);
    }
  };
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header justify-normal items-center space-x-2">
                <BackButton />
                <h5 className="flex align-items-center">
                  Edit Expenses
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body pt-10">
                    <div className="form-group-item border-0 mb-0">
                      <div className="row align-item-center">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>Expense Id</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter First Name"
                              value={
                                formData.expenseNumber
                              }
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>Party Name<span className="text-danger">*</span></label>
                            <input
                              type="text"

                              className="form-control"
                              placeholder="Enter Party Name"
                              value={formData?.partyName}
                              onChange={(e) =>
                                handleInputChange(e, "partyName")
                              }
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>Date</label>
                            <div className="cal-icon cal-icon-info">
                              <DatePicker
                                className="datetimepicker form-control"
                                selected={new Date(formData.expenseDate)}
                                onChange={(date) =>
                                  handleDateChange("expenseDate", date)
                                }
                                dateFormat="dd-MM-yyyy"
                                showTimeInput={false}
                              ></DatePicker>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group-item">
                      <div className="card-table">
                        <div className="card-body add-invoice">
                          <div className="table-responsive">
                            <table className="table table-center table-hover datatable">
                              <thead className="thead-light">
                                <tr>
                                  <th className="table_column-width_1">Product / Service</th>
                                  <th className="table_column-width_1">Price</th>
                                  <th className="table_column-width_1">Amount</th>
                                  <th className="table_column-width_1">Action</th>
                                </tr>
                              </thead>
                              {formData?.table?.length > 0 && (
                                <tbody className="thead-light">
                                  {formData.table.map((item, index) => (
                                    <tr key={index}>
                                      <td className="table_column-width_1">{item.productName}</td>
                                      <td className="table_column-width_1">
                                        <input
                                          type="number"
                                          name="re_invoice"
                                          value={item.price}
                                          className="form-control form-control-sm"
                                          style={{
                                            width: "130px",
                                            borderStyle: "dotted",
                                            borderWidth: "2px",
                                          }}
                                          onChange={(e) =>
                                            handleInputChange(
                                              "price",
                                              e.target.value,
                                              index
                                            )
                                          }
                                        />
                                      </td>

                                      <td className="table_column-width_1">
                                        <input
                                          type="number"
                                          name="re_invoice"
                                          value={item.totalAmount}
                                          className="form-control form-control-sm"
                                          style={{
                                            width: "130px",
                                            borderStyle: "dotted",
                                            borderWidth: "2px",
                                          }}
                                          onChange={(e) =>
                                            handleChangeTableField(
                                              index,
                                              "totalAmount",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </td>

                                      <td className="table_column-width_1">
                                        <button
                                          className="text-danger-light1"
                                          onClick={() =>
                                            handleDeleteItem(index)
                                          }
                                        >
                                          <span >
                                            <FeatherIcon icon="trash-2" />
                                          </span>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              )}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group-bank">
                            <div className="form-group">
                              <label>Select Products <span className="text-danger">*</span></label>
                              <div className="bank-3 align-items-center row">
                                <div className="col-md-8">
                                  <input
                                    style={{
                                      display: "block",
                                      border: "2px dotted",
                                      padding: "10px",
                                      textDecoration: "none",
                                      width: "100%",
                                    }}
                                    placeholder="Enter Purchase Name"
                                    className="select-products-button"
                                    onChange={(e) =>
                                      setPurchaseInput(e.target.value)
                                    }
                                    value={PurchaseInput}
                                  />
                                </div>
                                <div className="select-products-button-plus col-md-4 p-0">
                                  <button
                                    className="btn btn-primary flex justify-center items-center h-[100%]"
                                    onClick={handleproductchange}
                                    disabled={!PurchaseInput}
                                  >
                                    <i
                                      className="fa fa-plus-circle pr-2"
                                      aria-hidden="true"
                                    />
                                    Create New Item
                                  </button>
                                </div>
                                {validation.productsSelected &&
                                  !productsSelected && (
                                    <div className="error-message text-danger mt-1 pt-1">
                                      {validation.productsSelected.message}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-0 col-sm-6 col-md-6">
                          <label>Upload Receipt</label>
                          <div className="form-group service-upload service-upload-info mb-0">
                            <span>
                              <FeatherIcon
                                icon="upload-cloud"
                                className="me-1"
                              />
                              Upload receipt
                            </span>
                            <input
                              type="file"
                              multiple=""
                              id="image_sign"
                              onChange={handleFilereciptChange}
                            />
                            <div id="frames" />
                          </div>
                          {formData?.bankDetails?.uploadReceipt && (
                            <img
                              src={formData?.bankDetails?.uploadReceipt?.url}
                              alt="Signature"
                              className="uploaded-signature"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="add-customer-btns text-end">
                      <button
                        type="reset"
                        className="btn btn-primary cancel me-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={editExpensesidUpdate}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Tax & Discount Modal */}
        <div
          className="modal custom-modal fade"
          id="add_discount"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0 align-center">
                  <h4 className="mb-0">Add Tax &amp; Discount</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Rate</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={120}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer add-tax-btns">
                <button
                  type="reset"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Tax & Discount Modal */}
        {/* {edit updata} */}
        <Modal
          closable={false}
          onCancel={() => setUpdateExpenses1(false)}
          open={updateExpenses1}
          footer={null}
        >
          <div className="row">
            <div className="form-header">
              <h3 className="update-popup-buttons">Update Expenses</h3>
              <p>Are you sure want to update?</p>
            </div>
            <div className="modal-btn delete-action">
              <div className="row">
                <div className="col-6">
                  <button
                    type="reset"
                    className="w-100 btn btn-primary paid-continue-btn"
                    onClick={() => handleSubmit(editExpenseid)}
                  >
                    Update
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    onClick={() => setUpdateExpenses1(false)}
                    className="w-100 btn btn-primary paid-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* Delete Items Modal */}
        <div
          className="modal custom-modal fade"
          id="delete_discount"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 justify-content-center pb-0">
                <div className="form-header modal-header-title text-center mb-0">
                  <h4 className="mb-2">Delete Product / Services</h4>
                  <p>Are you sure want to delete?</p>
                </div>
              </div>
              <div className="modal-body">
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <Link
                        to="#"
                        data-bs-dismiss="modal"
                        className="btn btn-primary paid-continue-btn"
                      >
                        Delete
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to="#"
                        data-bs-dismiss="modal"
                        className="btn btn-primary paid-cancel-btn"
                      >
                        Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Items Modal */}

        {/* Add Bank Details Modal */}
        <div
          className="modal custom-modal fade"
          id="bank_details"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Bank Details </h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div>
                      <div>
                        <label htmlFor="accountSelect">Choose Account:</label>

                        <Select2
                          data={bankoptions}
                          options={{
                            placeholder: "Choose Bank",
                          }}
                          value={formData?.bankDetails?.selectBank}
                          onChange={handleAccountChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                >
                  <button className="btn btn-primary paid-cancel-btn me-2">Back</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Bank Details Modal */}
      </div>
      {/* //Products Modal */}
      <Modal
        title="Select Product"
        open={isProductModalVisible}
        onCancel={handleProductCancel}
        footer={[
          <Button key="back" onClick={handleProductCancel} className="btn btn-secondary waves-effect me-2" >
            Cancel
          </Button>,
          <Button
            className="btn btn-info waves-effect waves-light"
            key="submit"
            type="primary"
            onClick={() => handleProductSelect(selectedProductModal)}
          >
            Select
          </Button>,
        ]}
      >
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {product &&
              product.map((prod) => (
                <tr key={prod._id}>
                  <td>{prod.itemName}</td>
                  <td>{prod.purchasePrice}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-primary me-2 add-purchases-modal-button"
                        onClick={() => {
                          handleproductchange(prod._id);
                          handleProductSelect(selectedProductModal);
                          handleAddProducts();
                        }}
                      >
                        Add <FeatherIcon icon="plus-circle" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Modal>
    </>
  );
};

export default EditExpenses;