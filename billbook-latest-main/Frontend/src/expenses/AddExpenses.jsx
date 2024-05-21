import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
// import Header from "../layouts/Header";
// import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import Select2 from "react-select2-wrapper";
import "regenerator-runtime/runtime";
import axios from "axios";
import { BiSolidKeyboard } from "react-icons/bi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Select, Input, Button, Tooltip } from "antd";
import { AddPartiesData } from "./AddPartiesData";
import { AddExpenseCatagoryData } from "../products/AddExpenseCatagoryData";
import AddProductServicesModal from "../products/AddProductServicesModal";
import { backendUrl } from "../backendUrl";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import BackButton from "../invoices/Cards/BackButton";
import { useSelector } from "react-redux";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";

const AddExpenses = () => {
  const history = useHistory();
  const [GodownList, setGodownList] = useState([]);

  const [productsSelected, setProductsSelected] = useState(false);

  const [selectedCitys, setSelectedCitys] = useState("");
  const [currencyValue, setCurrencyValue] = useState(0);

  const [totalAmounts, setTotalAmounts] = useState();
  const [grandTotalInSelectedCurrency, setGrandTotalInSelectedCurrency] =
    useState(0);
  const [datasource, setDatasource] = useState([]);

  const [decodedToken, setDecodedToken] = useState(null);

  console.log("decodedToken", decodedToken);

  useEffect(() => {
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

      const convertedAmount = totalAmounts / exchangeRate;
      setConvertedTotalInSelectedCurrency(
        isNaN(convertedAmount) ? 0 : Number(convertedAmount)
      );
    }
  }, [selectedCitys, totalAmounts]);
  const [menu, setMenu] = useState(false);
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

  useEffect(() => {
    if (datasource.length >= 0) {
      setFormData((prevData) => ({
        ...prevData,
        expenseNumber: getNextInvoiceNumber(),
      }));
    }
  }, [datasource]);

  const [formData, setFormData] = useState({
    expenseName: "Expense Invoice",
    expenseNumber: 1,
    partyName: "",
    expenseDate: new Date(),
    referenceNo: "",
    products: "",
    paymentMode: "",
    currency: 0,
    originalInvoiceNumber: "",
    notes: "",
    balance: "",
    expenseCategory: "",
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
      uploadReceiptName: "",
      uploadReceipt: null,
    },
  });

  console.log("expenseFormData", formData);

  const [isFullyPaid, setIsFullyPaid] = useState(false);

  console.log("isFullyPaid", isFullyPaid);

  const balance = isFullyPaid ? 0 : totalAmount;

  console.log("formData in add", formData);

  const [validation, setValidation] = useState({
    partyName: { isValid: true, message: "" },
  });

  const handleDateChange = (fieldName, date) => {
    if (date) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        dueDate: true,
      }));
    }
    if (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    ) {
      date.setHours(0, 0, 0, 0);

      const timeDiff = Math.abs(
        date.getTime() - formData.purchasesDate.getTime()
      );
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const paymentTerms = diffDays;

      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: date,
        paymentTerms: paymentTerms.toString(),
      }));

      if (fieldName === "paymentTerms" && formData.purchasesDate) {
        const dueDate = new Date(formData.purchasesDate);
        dueDate.setDate(dueDate.getDate() + parseInt(date, 10));
        setFormData((prevData) => ({
          ...prevData,
          dueDate,
        }));
      }

      if (fieldName === "purchasesDate" && formData.purchasesDate) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: date,
          dueDate: "",
          paymentTerms: "0",
        }));
      }

      if (fieldName === "dueDate" && formData.purchasesDate) {
        const differenceInDays = Math.floor(
          (date - formData.purchasesDate) / (24 * 60 * 60 * 1000)
        );
        let days = daysBetweenDates(formData.purchasesDate, date);
        setFormData((prevData) => ({
          ...prevData,
          paymentTerms: days.toString(),
        }));
      }
    }
  };

  function daysBetweenDates(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    var diff = Math.abs(d2 - d1);
    var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  }

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

  const userData = useSelector((state) => state?.user?.userData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/Expense/expense/${userData?.data?._id}`,
        { ...formData, businessId: userData?.data?._id }
      );

      console.log("Data submitted successfully:", response.data);
      toast.success("Invoice Added Succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      history.push(`/view-expenses/${response.data._id}`);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const [slectedCustomerId, setSelectedCustomerId] = useState([]);

  const handleCustomerChange = (fieldName, value) => {
    let isValid = true;
    let message = "";
    if (fieldName === "partyName") {
      isValid = value;
      message = "Invalid value";
    }
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleInputChange = (fieldName, value, index) => {
    setFormData((prevData) => {
      const updatedState = { ...prevData };
      const updatedItem = { ...updatedState.table[index] };

      console.log("updatedItem 001", updatedItem);

      updatedItem[fieldName] = parseFloat(value);

      if (fieldName === "price") {
        const newPrice = parseFloat(value) || 0;
        const newQuantity = parseFloat(updatedItem.quantity) || 0;
        const newDiscount = parseFloat(updatedItem.discount) || 0;
        const newGstAmount = parseFloat(updatedItem.gstRate) || 0;

        console.log("newGstAmount", newGstAmount);

        const totalAmountBeforeDiscount = newQuantity * newPrice;
        const discountAmount = (newDiscount / 100) * totalAmountBeforeDiscount;
        const totalAmount = totalAmountBeforeDiscount - discountAmount;

        const gstAfterEnteringPrice = (totalAmount * newGstAmount) / 100;
        updatedItem.totalGstAmount = gstAfterEnteringPrice;
        updatedItem.totalAmount = totalAmount + gstAfterEnteringPrice;
      } else {
        const newPrice = parseFloat(updatedItem.price) || 0;
        const newQuantity = parseFloat(value) || 0;
        const newDiscount = parseFloat(updatedItem.discount) || 0;
        const newGstAmount = parseFloat(updatedItem.totalTax) || 0;

        const totalAmountBeforeDiscount = newQuantity * newPrice;
        const discountAmount = (newDiscount / 100) * totalAmountBeforeDiscount;
        const totalAmount = totalAmountBeforeDiscount - discountAmount;

        const gstAfterEnteringQuantity = (totalAmount * newGstAmount) / 100;
        updatedItem.totalGstAmount = gstAfterEnteringQuantity;
        updatedItem.totalAmount = totalAmount + gstAfterEnteringQuantity;
      }

      updatedState.table[index] = updatedItem;
      return updatedState;
    });

    calculateTotalAmountForAllProducts();
    calculateTotalAmountForAllProducts(selectedCitys?.currencyValue);
  };

  const calculateTotalAmountForAllProducts = (currencyValue) => {
    let total = 0;
    formData.table.forEach((item) => {
      console.log("calculateTotalAmountForAllProducts", item);
      total += parseFloat(item.totalAmount) || 0;
    });
    const roundedTotal = total;
    setTotalAmount(roundedTotal);
    currencyConverter(roundedTotal);
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

    formData.table.forEach((item) => {
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

    formData.table.forEach((item) => {
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

    formData.table.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const discountPercentage = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;

      const discountAmount = (price * quantity * discountPercentage) / 100;
      // const discountedPrice = price - discountAmount;
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
    calculateTotaltaxableForAllProducts();
  }, [formData]);

  useEffect(() => {
    const updatedBalance = isFullyPaid ? 0 : totalAmount;

    setFormData((prevFormData) => ({
      ...prevFormData,
      grandTotal: totalAmount,
      balance: updatedBalance,
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
    isFullyPaid,
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

    const updatedTable = [...formData.table];
    const updatedItem = { ...updatedTable[index] };
    console.log("updatedItem", updatedItem);
    if (updatedItem.maxQuantity < value && updatedItem.category !== "service") {
      toast.error("Quantity greater than Stock", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

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

      if (field === "gstRate") {
        const newGstRate = parseFloat(value);

        updatedTable[index]["tax"] = newGstRate;
      }

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
    console.log("value firt", value);
    setFormData((prevData) => {
      const updatedTable = [...prevData.table];
      const updatedItem = { ...updatedTable[index] };
      console.log("updatedItem", updatedItem);

      updatedItem[field] = parseFloat(value) || 0;

      const quantity = updatedItem.quantity || 1;

      const newTotalAmount = updatedItem.totalAmount || 0;
      console.log("newTotalAmount", newTotalAmount);
      const previousTotalGstAmount =
        parseFloat(updatedItem.totalGstAmount) || 0;
      const previousDiscountAmount = parseFloat(updatedItem.discount) || 0;
      const previousQuantity = parseFloat(updatedItem.quantity) || 0;
      const gstrate = parseFloat(updatedItem.gstRate) || 0;

      if (field === "totalAmount" && !isNaN(newTotalAmount)) {
        let newPrice =
          (newTotalAmount / (quantity * (1 + gstrate / 100))) *
          (100 / (100 - previousDiscountAmount));

        updatedItem.price = newPrice;
      } else if (field === "price") {
        // Recalculate total amount based on new price
        updatedItem.totalAmount =
          parseFloat(value) +
          previousTotalGstAmount -
          previousDiscountAmount * previousQuantity;

        console.log("updatedItem.totalAmount");
      }

      updatedTable[index] = updatedItem;

      return {
        ...prevData,
        table: updatedTable,
      };
    });
  };

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

  const handleDeleteItem = (index) => {
    const updatedTable = [...formData.table];
    updatedTable.splice(index, 1);
    setFormData({ ...formData, table: updatedTable });
  };

  useEffect(() => {
    if (userData?.data?._id) {
      axios
        .get(`${backendUrl}/api/Expense/expense/${userData?.data?._id}`)
        .then((response) => {
          setDatasource(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userData]);

  const getNextInvoiceNumber = () => {
    if (datasource.length === 0) {
      return 1;
    } else {
      const maxInvoiceNumber = Math.max(
        ...datasource.map((invoice) => invoice.expenseNumber)
      );
      return maxInvoiceNumber + 1;
    }
  };

  const handleFilereciptChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const file = selectedFile.name;
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          bankDetails: {
            ...prevData.bankDetails,
            uploadReceipt: reader.result,
            uploadReceiptName: file,
          },
        }));
      };

      reader.readAsDataURL(selectedFile);
    }
  };
  const [PurchaseInput, setPurchaseInput] = useState("");

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header justify-normal items-center space-x-2">
                <BackButton />
                <h5 className="mt-0">Create Expenses</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body pt-10">
                    <div className="form-group-item border-0 mb-0">
                      <div className="row align-item-center">
                        {/* </Modal> */}
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Expense Id</label>
                            <Input
                              type="text"
                              className="form-control cursor-not-allowed"
                              placeholder="Enter Invoice Number"
                              value={
                                formData.expenseNumber || getNextInvoiceNumber()
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>
                              Party Name
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Party Name"
                              className={`form-control cursor-not-allowed  ${
                                !validation?.partyName?.isValid
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={formData?.partyName}
                              onChange={(e) =>
                                handleCustomerChange(
                                  "partyName",
                                  e.target.value
                                )
                              }
                            />
                            {!validation?.partyName?.isValid && (
                              <p className="error-message text-danger mt-1 pt-1">
                                {validation?.partyName?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>Date</label>
                            <div className="cal-icon cal-icon-info">
                              <DatePicker
                                className="datetimepicker form-control"
                                selected={formData.expenseDate}
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

                    <div className="form-group-item mt-2">
                      <div className="card-table">
                        <div className="card-body add-invoice">
                          <div className="table-responsive">
                            <table className="table table-center table-hover datatable">
                              <thead className="thead-light">
                                <tr>
                                  <th className="table_column-width_1">
                                    Product
                                  </th>
                                  <th className="table_column-width_1">
                                    Price
                                  </th>
                                  <th className="table_column-width_1">
                                    Amount
                                  </th>
                                  <th className="table_column-width_1">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              {formData.table.length > 0 && (
                                <tbody className="thead-light">
                                  {formData.table.map((item, index) => (
                                    <tr key={index}>
                                      <td className="table_column-width_1">
                                        {item.productName}
                                      </td>
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
                                          className="form-control form-control-sm remove-arrow"
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
                                          <span>
                                            <i class="fa-solid fa-trash-can"></i>
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
                              <label>
                                Create Items
                                <span className="text-danger">*</span>
                              </label>
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
                                    placeholder="Enter Product Name"
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
                          {formData.bankDetails.uploadReceipt && (
                            <>
                              <div>
                                <p>
                                  Uploaded file:{" "}
                                  {formData.bankDetails.uploadReceiptName}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="add-customer-btns text-end pt-4">
                      <button
                        type="reset"
                        className="btn btn-primary cancel me-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmit}
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
      </div>
    </>
  );
};

export default AddExpenses;
