import React, { useState, useEffect, useCallback, uSe } from "react";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import FeatherIcon from "feather-icons-react";
import Select2 from "react-select2-wrapper";
import "regenerator-runtime/runtime";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Select, Input, message, Tooltip } from "antd";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CustomerAddInvoiceModal from "./CustomerAddInvoiceModal";
import BackButton from "./Cards/BackButton";
import AddProductServicesModal from "../products/AddProductServicesModal";
import SelectCurrency from "./Modals/SelectCurrency";
import SelectBank from "./Modals/SelectBank";
import SelectProducts from "./Modals/SelectProducts";
import SelectGowdown from "./Modals/SelectGowdown";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import AddCustomer from "../customers/AddCustomer";
import PanCardNumber from "./Modals/PanCardNumber";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const AddProforma = () => {
  const location = useLocation();
  const [addProduct1, setAddProduct1] = useState(false);

  const history = useHistory();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isAnotherModalVisible, setIsAnotherModalVisible] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [GodownList, setGodownList] = useState([]);

  const [bankSelected, setBankSelected] = useState(false);
  const [productsSelected, setProductsSelected] = useState(false);

  const showProductModal = () => {
    setIsProductModalVisible(true);
  };

  const handleProductCancel = () => {
    setIsProductModalVisible(false);
  };

  const handleProductSelect = (productId) => {
    setSelectedProductModal(productId);
    setIsAnotherModalVisible(true);
    setIsProductModalVisible(false);
  };

  const [isCustomerDetailsModalOpen, setisCustomerDetailsModalOpen] =
    useState(false);

  const [pancardmodalOpen, setPancardmodalOpen] = useState(false);

  const [productsAdded, setProductsAdded] = useState(false);

  const handleAddProducts = () => {
    setProductsAdded(true);
  };

  const [currencyData, setCurrencyData] = useState([]);
  const [selectedCitys, setSelectedCitys] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyValue, setCurrencyValue] = useState(0);

  const [totalAmounts, setTotalAmounts] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [grandTotalInSelectedCurrency, setGrandTotalInSelectedCurrency] =
    useState(0);
  const [datasource, setDatasource] = useState([]);

  const fetchCurrencyData = async () => {
    try {
      if(userData?.data?._id) {
      const response = await axios.get(
        `http://localhost:8000/api/AddCurrency/currency/${userData?.data?._id}`
      );
      setCurrencyData(response.data);
    }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, [userData]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const openCustomerDetailsModal = () => {
    setisCustomerDetailsModalOpen(true);
  };

  const closeCustomerDetailsModal = () => {
    setisCustomerDetailsModalOpen(false);
  };
  const closepancardModal = () => {
    setPancardmodalOpen(false);
  };

  useEffect(() => {
    if(userData?.data?._id) {
    axios
      .get(`http://localhost:8000/api/performa/Proforma/${userData?.data?._id}`)
      .then((response) => {
        setDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  }, [userData]);

  const userData = useSelector((state) => state?.user?.userData);
  useEffect(() => {
    setFormData({
      ...formData,
      bussPANNumber: userData?.data?.PANNumber || " ",
    });
    // console.log("decodedToken", decodedToken)
  }, []);

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

  const handleCitysChange = (value) => {
    setSelectedCitys(value);
    const selectedCityData = currencyData.find(
      (city) => city.cityName === value
    );
    if (selectedCityData) {
      setSelectedCurrency(selectedCityData.currency);
      setCurrencyValue(selectedCityData.currencyValue);

      let convertedAmount;
      if (selectedCityData.currency) {
        convertedAmount = totalAmount / selectedCityData.currencyValue;
      } else {
        console.error("Selected city data does not have a valid currency");

        convertedAmount = Number(convertedAmount);
      }

      setGrandTotalInSelectedCurrency(convertedAmount);
      setFormData((prevData) => ({
        ...prevData,
        currency: convertedAmount.toFixed(2),
      }));
    }
  };
  const handleBankChange = () => {};
  const handleEditableCurrencyChange = (event) => {
    const newCurrencyValue = event.target.value;

    if (!isNaN(newCurrencyValue)) {
      setCurrencyValue(Number(newCurrencyValue));
      const convertedAmount = calculateConvertedAmount(newCurrencyValue);
      setGrandTotalInSelectedCurrency(convertedAmount);
      setFormData((prevData) => ({
        ...prevData,
        currency: convertedAmount.toFixed(2),
      }));
    } else {
      console.error("Invalid currency value entered");
    }
  };
  const calculateConvertedAmount = (newCurrencyValue) => {
    if (selectedCitys) {
      const selectedCityData = currencyData.find(
        (city) => city.cityName === selectedCitys
      );
      if (selectedCityData) {
        return totalAmount / newCurrencyValue;
      }
    }

    console.error("Selected city data not available for conversion");
    return totalAmount;
  };

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bankData, setBankData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([]);

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const fetchData = async () => {
    try {
      if(userData?.data?._id) {
      const response = await axios.get(
        `http://localhost:8000/api/BankDeatils/bank-details/${userData?.data?._id}`
      );
      setBankData(response.data);
    }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);


  const bankoptions = bankData.map((cus) => ({
    id: cus._id,
    text: cus.branchName,
  }));
  const [bankSelect, setBankSelect] = useState(false);
  const [selectBank1, setSelectBank1] = useState(false);

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
    if (account) {
      setBankSelected(true);
      setBankSelect(true);
    }
    setSelectBank1(false);
  };

  const [menu, setMenu] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleAddChargesClick = () => {
    setShowInput(true);
  };

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

  const handleGstRateChange = (e, index) => {
    const newGstRate = parseFloat(e.target.value);

    if (!isNaN(newGstRate)) {
      handletableFieldChange(index, "gstRate", newGstRate);
    } else {
      console.error("Invalid GST Rate:", e.target.value);
    }
    console.log("gst Selected", newGstRate);
  };
  const recalculateTotalAmount = () => {
    let newTotalAmount = 0;
    product.forEach((product) => {
      newTotalAmount +=
        product.amount + product.totalGstAmount + product.cessAmount;
    });

    setTotalAmount(newTotalAmount);
    currencyConverter(newTotalAmount);
  };

  useEffect(() => {
    if (datasource.length >= 0) {
      setFormData((prevData) => ({
        ...prevData,
        proformaNumber: getNextInvoiceNumber(),
      }));
    }
  }, [datasource]);

  const [customer, setCustomer] = useState([]);
  const [customerUniqueid, setCustomerUniqueid] = useState([]);

  console.log("customerkndrop", customer);

  const fetchCustomers = async () => {
    try {
      if(userData?.data?._id) {
      const response = await axios.get(
        `http://localhost:8000/api/addCustomer/customers/${userData?.data?._id}`,
      );
      setCustomer(
        // { id: 1, text: "Select Item Category" },
        response.data
      );
      setCustomerUniqueid(response.data);
    }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, [userData]);

  const [formData, setFormData] = useState({
    proformaName: "Proforma Invoice",
    businessId: userData?.data?._id,
    proformaNumber: 1,
    customerName: "",
    performaDate: new Date(),
    dueDate: new Date(),
    referenceNo: "",
    products: "",
    paymentTerms: 0,
    currency: 0,
    website: "",
    // notes: "",
    bankId: "",
    custPANNumber: "",
    bussPANNumber: "",
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
      termsAndConditions: "",
      additionalCharges: "",
      signatureName: "",
      signatureImage: null,
      grandTotal: "",
      totalDiscount: 0,
      totalGst: 0,
    },
  });

  const [isFullyPaid, setIsFullyPaid] = useState(false);

  console.log("isFullyPaid", isFullyPaid);

  const handleCheckboxChange = (e) => {
    setIsFullyPaid(e.target.checked);
  };
  const balance = isFullyPaid ? 0 : totalAmount;

  console.log("formData in add", formData);

  const [validation, setValidation] = useState({
    customerName: { isValid: true, message: "" },
  });

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const handleShowAddresses = () => {
    setShowAddresses(!showAddresses);
  };

  const handlePaymentTermsChange = (terms) => {
    const days = parseInt(terms);
    const date = Date.now();

    const moonLanding = new Date(formData.performaDate).getTime();

    console.log("moonLanding", typeof moonLanding);

    const totalDays = days; // Assuming you want to subtract 1 day
    const dueDateTimestamp = moonLanding + totalDays * 24 * 60 * 60 * 1000;

    console.log(
      "formData",
      formData,
      "days",
      totalDays,
      "dueDateTimestamp",
      dueDateTimestamp
    );

    const dueDate = new Date(dueDateTimestamp);
    let formattedDueDate;
    // Check if dueDate is valid before formatting
    if (!isNaN(dueDate.getTime())) {
      // Formatting the dueDate similar to invoiceDate
      formattedDueDate = dueDate;
      console.log("formattedDueDate", formattedDueDate);
    } else {
      console.log("Invalid dueDate");
    }
    setFormData((prevData) => ({
      ...prevData,
      paymentTerms: totalDays,
      dueDate: formattedDueDate,
    }));
  };

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
        date.getTime() - formData.performaDate.getTime()
      );
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const paymentTerms = diffDays;

      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: date,
        paymentTerms: paymentTerms.toString(),
      }));

      if (fieldName === "paymentTerms" && formData.performaDate) {
        const dueDate = new Date(formData.performaDate);
        dueDate.setDate(dueDate.getDate() + parseInt(date, 10));
        setFormData((prevData) => ({
          ...prevData,
          dueDate,
        }));
      }

      if (fieldName === "performaDate" && formData.performaDate) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: date,
          dueDate: "",
          paymentTerms: "0",
        }));
      }

      if (fieldName === "dueDate" && formData.performaDate) {
        const differenceInDays = Math.floor(
          (date - formData.performaDate) / (24 * 60 * 60 * 1000)
        );
        let days = daysBetweenDates(formData.performaDate, date);
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
    if (!formData.customerName) {
      validationErrors.customerName = {
        isValid: false,
        message: "Please select a customer name",
      };
    }

    // Check if the bank has been selected

    if (!formData.products && !productsSelected) {
      validationErrors.productsSelected = {
        isValid: false,
        message: "Please select products",
      };
      console.error("Please select products");
    }

    if (formData.table.length === 0) {
      setProductsSelected(false);
      validationErrors.productsSelected = {
        isValid: false,
        message: "Please select products",
      };
      console.error("Please select products");
    }

    return validationErrors;
  };

  const [isCustomerPan, setIsCustomerPan] = useState(true);
  const [isBusinessPan, setIsBusinessPan] = useState(true);

  console.log("isCustomerPan", isCustomerPan, "isBusinessPan", isBusinessPan);

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
        "http://localhost:8000/api/performa/Proforma",
        {...formData, businessId : userData?.data?._id }
      );
      // if(formData.custPANNumber.trim().length > 0)

      console.log("Data submitted successfully:", response.data);

      if (
        (!response?.data?.iscustomer || !response?.data?.isBussinessPAN) &&
        response.data.invoice == undefined
      ) {
        console.log("response?.data?.iscustomer", response?.data?.iscustomer);
        setIsCustomerPan(response?.data?.iscustomer);
        setIsBusinessPan(response?.data?.isBussinessPAN);
        {
          !response?.data?.iscustomer || !response?.data?.isBussinessPAN
            ? setPancardmodalOpen(true)
            : setPancardmodalOpen(false);
        }
        return;
      } else {
        toast.success("Performa Added Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push("/proforma-invoice");
        setFormData({
          proformaNumber: "",
          customerName: "",
          performaDate: new Date(),
          dueDate: new Date(),
          products: "",
          paymentTerms: "",
          currency: "",
          website: "",
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
          table: [],
          bankDetails: {
            selectBank: {
              bankName: "",
              accountNumber: "",
              branchName: "",
              IFSCCode: "",
            },
            notes: "",
            termsAndConditions: "",
            additionalCharges: "",
            signatureName: "",
            signatureImage: null,
            grandTotal: "",
            totalDiscount: 0,
            // totalGst: 0,
          },
        });
      }
      // setTimeout(() => {
      //   // window.location.reload();
      // }, 1500);
    } catch (error) {
      console.error("Error submitting data:", error);
      // console.log("Error Data", error.response.data);
    }
  };

  const fetchGstData = async () => {
    try {
      if(userData?.data?._id) {
      const response = await axios.get(`http://localhost:8000/api/addgst/gst/${userData?.data?._id}`)
      setGstData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGstData();
  }, [userData]);

  const [slectedCustomerId, setSelectedCustomerId] = useState([]);

  const handleCustomerChange = (fieldName, value) => {
    let isValid = true;
    let message = "";
    if (fieldName === "customerName") {
      isValid = value;
      message = "Invalid value";
    }
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
    // setFormData({ ...formData, [fieldName]: value });
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  useEffect(() => {
    const customerid = location.state?.state?.contact_id;
    if (customerid) {
      console.log("customeriffr", customerid);
      const matchedCustomer = customer.find(
        (option) => option._id === customerid
      );
      if (matchedCustomer) {
        setSelectedCustomerId(matchedCustomer._id);
      }
      handleCustomerChange("customerName", customerid);
    }
  }, [location.state]);

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

  const [selectedproduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState([]);

  console.log("selectedProductId", selectedProductId);

  const fetchProductsbyId = async (selectedproduct) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/addProduct/products/${selectedproduct}`
      );
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

  const fetchProducts = async () => {
    try {
      if(userData?.data?._id) {
      const response = await axios.get(
        `http://localhost:8000/api/addProduct/products/${userData?.data?._id}`,
      );
      setProduct(response.data);
    }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userData]);

  const handleproductchange = (productId, godownId) => {
    console.log("GODOWN__ID", godownId);
    setProductsSelected(true);
    const selectedProduct = product.find((prod) => prod._id === productId);
    const gstRateTaxId = selectedProduct.gstTaxRate;
    const foundGstData = gstData?.find((gst) => gst._id === gstRateTaxId) || 0;

    console.log("foundGstData", foundGstData);
    const gstRateTaxValue = foundGstData ? foundGstData.gstPercentageValue : 0;

    console.log("selectedProduct", selectedProduct);
    let price;

    if (selectedProduct.taxType === "With Tax") {
      price =
        parseFloat(selectedProduct.salesPrice) / (1 + gstRateTaxValue / 100);
    } else {
      price = parseFloat(selectedProduct.salesPrice);
    }

    let MaxQuantity = 1;
    if (godownId) {
      for (let i = 0; i < selectedProduct.Godown.length; i++) {
        if (selectedProduct.Godown[i].godownId === godownId) {
          MaxQuantity = selectedProduct.Godown[i].stock;
        }
      }
    } else if (parseFloat(selectedProduct.openingStock) > 0) {
      MaxQuantity = parseFloat(selectedProduct.openingStock);
    } else {
      MaxQuantity = 1;
    }

    // price = (selectedProduct.salesPrice * (1 - gstRateTaxValue / 100)).toFixed(2);

    const newTable = [...formData.table];
    newTable.push({
      productId: selectedProduct._id,
      productName: selectedProduct.itemName
        ? selectedProduct.itemName
        : selectedProduct.serviceName,
      price: price || 0,
      quantity: 1,
      maxQuantity: MaxQuantity,
      discount: 0,
      tax: 0,
      gstRate: foundGstData.gstPercentageValue,
      totalAmount: parseFloat(selectedProduct.salesPrice) || 0,
      totalDiscount: "",
      totalTax: foundGstData.gstPercentageValue || 0,
      totalGstAmount: 0,
      godownId: godownId,
      category: selectedProduct?.category,
    });

    console.log("NEW TABLE ---", newTable);
    setFormData({
      ...formData,
      table: newTable,
    });
  };

  const handleDeleteItem = (index) => {
    const updatedTable = [...formData.table];
    updatedTable.splice(index, 1);
    setFormData({ ...formData, table: updatedTable });
  };

  const getNextInvoiceNumber = () => {
    if (datasource.length === 0) {
      return 1;
    } else {
      const maxInvoiceNumber = Math.max(
        ...datasource.map((invoice) => invoice.proformaNumber)
      );
      return maxInvoiceNumber + 1;
    }
  };

  const fetchGodownData = async () => {
    try {
      if(userData?.data?._id) {
      const response = await axios.get(
        `http://localhost:8000/api/godown/godownlist/${userData?.data?._id}`
      );
      setGodownList(response.data);
    }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGodownData();
  }, [userData]);

  useEffect(() => {
    if (userData && userData.data && userData.data.termsConditions) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bankDetails: {
          ...prevFormData.bankDetails,
          termsAndConditions: userData.data.termsConditions,
        },
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.data && userData.data.signatureImage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bankDetails: {
          ...prevFormData.bankDetails,
          signatureImage: userData.data.signatureImage,
        },
      }));
    }
  }, [userData]);

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header justify-normal items-center space-x-2">
                <BackButton />
                <h5 className="mt-0">Add Proforma</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body pt-10">
                    <div className="form-group-item border-0 mb-0">
                      <div className="row align-item-center">
                        <PanCardNumber
                          open={pancardmodalOpen}
                          onClose={closepancardModal}
                          setPancardmodalOpen={setPancardmodalOpen}
                          customerName={formData?.customerName}
                          handleSubmit={handleSubmit}
                        />
                        {/* </Modal> */}
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Proforma Number</label>
                            <input
                              type="text"
                              className="form-control cursor-not-allowed"
                              placeholder="Enter Invoice Number"
                              value={
                                formData.proformaNumber ||
                                getNextInvoiceNumber()
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>
                              Customer Name
                              <span className="text-danger">*</span>
                            </label>
                            <ul className="form-group-plus css-equal-heights">
                              <li>
                                <select
                                  className={`form-select ${
                                    !validation?.customerName?.isValid &&
                                    "is-invalid"
                                  }`}
                                  value={formData?.customerName}
                                  onChange={(e) =>
                                    handleCustomerChange(
                                      "customerName",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Choose Customer</option>
                                  {customer.map((option) => (
                                    <option key={option._id} value={option._id}>
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                                {!validation?.customerName?.isValid && (
                                  <p className="error-message text-danger">
                                    {validation?.customerName?.message}
                                  </p>
                                )}
                              </li>
                              <li>
                                <Tooltip
                                  placement="topLeft"
                                  title={"Add Customer"}
                                >
                                  <Link
                                    to="#"
                                    className="btn btn-primary form-plus-btn"
                                    onClick={() =>
                                      setisCustomerDetailsModalOpen(true)
                                    }
                                  >
                                    <FeatherIcon icon="plus-circle" />
                                  </Link>
                                </Tooltip>
                                <AddCustomer
                                  visible={isCustomerDetailsModalOpen}
                                  onCancel={() =>
                                    setisCustomerDetailsModalOpen(false)
                                  }
                                  fetchData={fetchCustomers}
                                  CustomersData={customerUniqueid}
                                  setCustomersData={setCustomerUniqueid}
                                />
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Proforma Date</label>
                            <div className="cal-icon cal-icon-info">
                              <DatePicker
                                // className=" form-control"
                                className="datetimepicker form-control "
                                selected={formData.performaDate}
                                onChange={(date) =>
                                  handleDateChange("performaDate", date)
                                }
                                dateFormat="dd-MM-yyyy"
                                showTimeInput={false}
                              ></DatePicker>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Due Date</label>
                            <div className="cal-icon cal-icon-info">
                              <DatePicker
                                className={`datetimepicker form-control`}
                                selected={formData.dueDate}
                                onChange={(date) =>
                                  handleDateChange("dueDate", date)
                                }
                                minDate={formData.invoiceDate}
                                dateFormat="dd-MM-yyyy"
                                showTimeInput={false}
                              ></DatePicker>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group position-relative">
                            <label>Payment Terms</label>
                            <div className="input-group input-group-sm mb-3">
                              <input
                                type="text"
                                className="form-control cursor-not-allowed"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-sm"
                                value={formData.paymentTerms}
                                onChange={(e) =>
                                  handlePaymentTermsChange(e.target.value)
                                }
                              />
                              <span
                                className="input-group-text"
                                id="inputGroup-sizing-sm"
                              >
                                days
                              </span>
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
                                  <th>Product / Service</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th>Discount</th>
                                  <th>Tax</th>
                                  <th>Amount</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              {formData.table.length > 0 && (
                                <tbody>
                                  {formData.table.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.productName}</td>
                                      <td>
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
                                      <td>
                                        <input
                                          type="number"
                                          name="re_invoice"
                                          value={item.quantity}
                                          className="form-control form-control-sm"
                                          style={{
                                            width: "130px",
                                            borderStyle: "dotted",
                                            borderWidth: "2px",
                                          }}
                                          onChange={(e) =>
                                            handleQuantityChange(
                                              e,
                                              index,
                                              "quantity"
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="re_invoice"
                                          value={item.discount || ""}
                                          className="form-control form-control-sm"
                                          style={{
                                            width: "130px",
                                            borderStyle: "dotted",
                                            borderWidth: "2px",
                                          }}
                                          onChange={(e) =>
                                            handleDiscountChange(e, index)
                                          }
                                        />
                                      </td>

                                      <td>
                                        <select
                                          value={
                                            item.gstRate ? item.gstRate : ""
                                          }
                                          onChange={(e) =>
                                            handleGstRateChange(e, index)
                                          }
                                          className="form-control form-control-sm"
                                          style={{
                                            width: "130px",
                                            borderStyle: "dotted",
                                            borderWidth: "2px",
                                          }}
                                        >
                                          <option value="">
                                            Select an Option
                                          </option>
                                          {gstData.map((rate) => (
                                            <option
                                              key={rate._id}
                                              value={rate.gstPercentageValue}
                                            >
                                              {rate.gstPercentageName}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td>
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

                                      <td className="d-flex align-items-center">
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
                        <div className="col-lg-12">
                          <div className="form-group-bank">
                            <div className="form-group">
                              <label>
                                Select Items{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="bank-3 align-items-center row">
                                <div className="col-md-9">
                                  <Link
                                    to="#"
                                    style={{
                                      display: "block",
                                      border: "2px dotted",
                                      padding: "10px",
                                      textDecoration: "none",
                                    }}
                                    className="select-products-button"
                                    onClick={() => {
                                      showProductModal();
                                    }}
                                  >
                                    <center>Select Products</center>
                                  </Link>
                                </div>
                                <div className="select-products-button-plus col-md-3 p-0">
                                  <Tooltip
                                    placement="topLeft"
                                    title={"Create New Item"}
                                  >
                                    <Link
                                      className="btn btn-primary flex justify-center items-center h-[100%]"
                                      to="#"
                                      onClick={() => setAddProduct1(true)}
                                    >
                                      <i
                                        className="fa fa-plus-circle pr-2"
                                        aria-hidden="true"
                                      />
                                      Create New Item
                                    </Link>
                                  </Tooltip>
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
                      </div>
                    </div>

                    <AddProductServicesModal
                      visible={addProduct1}
                      onCancel={() => setAddProduct1(false)}
                      datasource={datasource}
                      setDatasource={setDatasource}
                      fetchData={fetchProducts}
                    />

                    <div className="form-group-item border-0 p-0">
                      <div className="row">
                        <div className="col-xl-6 col-lg-12">
                          <div className="form-group-bank">
                            <div className="form-group">
                              {/* <label>Select Bank</label> */}

                              {/* Add the error message for bank selection */}

                              {bankSelect && selectedAccount && (
                                <div className="add-bank-details mt-3">
                                  <h6>Account Details</h6>
                                  <p>
                                    <span>Bank Account Number: </span>
                                    {selectedAccount.bankAccountNumber}
                                  </p>
                                  <p>
                                    <span>IFSC Code: </span>
                                    {selectedAccount.IFSCCode}
                                  </p>
                                  <p>
                                    <span>Branch Name: </span>
                                    {selectedAccount.branchName}
                                  </p>
                                  <p>
                                    <span>Account Holder's Name: </span>
                                    {selectedAccount.accountHoldersName}
                                  </p>
                                  <p>
                                    <span>UPI ID: </span>
                                    {selectedAccount.UPIID}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="form-group notes-form-group-info">
                              <label>Notes</label>
                              <textarea
                                className="form-control"
                                placeholder="Enter Notes"
                                value={formData.bankDetails.notes}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    bankDetails: {
                                      ...formData.bankDetails,
                                      notes: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div>
                              <div className="form-group notes-form-group-info mb-0">
                                <label>Terms and Conditions</label>
                                <textarea
                                  className="form-control"
                                  placeholder="Enter Terms and Conditions"
                                  value={
                                    formData.bankDetails.termsAndConditions
                                  }
                                  onChange={(e) =>
                                    setFormData((prevFormData) => ({
                                      ...prevFormData,
                                      bankDetails: {
                                        ...prevFormData.bankDetails,
                                        termsAndConditions: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-12">
                          <div className="form-group-bank">
                            <div className="row">
                              <div className="col-lg-4 col-md-12">
                                <div>
                                  {showInput && (
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={
                                        formData.bankDetails.additionalCharges
                                      }
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          bankDetails: {
                                            ...formData.bankDetails,
                                            additionalCharges: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="invoice-total-box">
                              <div className="invoice-total-inner">
                                <div className="status-toggle justify-content-between"></div>
                              </div>
                              {productsAdded && (
                                <div className="invoice-total-footer">
                                  <h4>
                                    Taxable Amount{" "}
                                    <span>{taxableAmount.toFixed(2)}</span>
                                  </h4>
                                  <h4>
                                    Total Discount ({totalDiscountPercentage}%){" "}
                                    <span>{totalDiscount.toFixed(2)}</span>
                                  </h4>
                                  <>
                                    <h4>
                                      Total Tax ({totalTaxPercentage}%){" "}
                                      <span>{totalTax.toFixed(2)}</span>
                                    </h4>

                                    <h4>
                                      CGST ({cgstTaxPercentage}%){" "}
                                      <span>{cgstTaxAmount.toFixed(2)}</span>
                                    </h4>
                                    <h4>
                                      SGST ({sgstTaxPercentage}%){" "}
                                      <span>{sgstTaxAmount.toFixed(2)}</span>
                                    </h4>
                                  </>
                                  <h4>
                                    Grand Total(INR){" "}
                                    <span>{totalAmount.toFixed(2)}</span>
                                  </h4>
                                  {selectedCitys && (
                                    <div>
                                      <h4>
                                        Currency ({selectedCurrency}){" "}
                                        <span>
                                          {grandTotalInSelectedCurrency.toFixed(
                                            2
                                          )}
                                        </span>
                                      </h4>
                                    </div>
                                  )}
                                  <Button
                                    type="primary"
                                    className="primary-button bg-[#8b1bf8] text-[#fff] hover:!bg-[#8b1bf8] hover:!text-[#fff]"
                                    onClick={showModal}
                                  >
                                    Select Currency
                                  </Button>
                                  <SelectCurrency
                                    currencyData={currencyData}
                                    currencyValue={currencyValue}
                                    handleCancel={handleCancel}
                                    handleCitysChange={handleCitysChange}
                                    handleEditableCurrencyChange={
                                      handleEditableCurrencyChange
                                    }
                                    handleOk={handleOk}
                                    isModalVisible={isModalVisible}
                                    selectedCitys={selectedCitys}
                                    selectedCurrency={selectedCurrency}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="form-group mb-0">
                              <label>Signature Image</label>

                              <img
                                src={formData.bankDetails.signatureImage}
                                alt="Signature"
                              />
                            </div>
                          </div>
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

        {/* Add Bank Details Modal */}
        <SelectBank
          visible={selectBank1}
          onCancel={() => setSelectBank1(false)}
          bankoptions={bankoptions}
          formData={formData}
          handleAccountChange={handleAccountChange}
        />
        {/* /Add Bank Details Modal */}
      </div>
      {/* //Products Modal */}
      <SelectProducts
        handleAddProducts={handleAddProducts}
        handleProductSelect={handleProductSelect}
        handleproductchange={handleproductchange}
        setIsProductModalVisible={setIsProductModalVisible}
        product={product}
        selectedProductModal={selectedProductModal}
        handleProductCancel={handleProductCancel}
        isProductModalVisible={isProductModalVisible}
      />
    </>
  );
};

export default AddProforma;
