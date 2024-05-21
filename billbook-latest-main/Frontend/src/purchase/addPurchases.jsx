import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import FeatherIcon from "feather-icons-react";
import "regenerator-runtime/runtime";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Input, Select, Tooltip } from "antd";
import AddProductServicesModal from "../products/AddProductServicesModal";
import SelectCurrency from "../invoices/Modals/SelectCurrency";
import SelectBank from "../invoices/Modals/SelectBank";
import SelectProducts from "../invoices/Modals/SelectProducts";
import SelectGowdown from "../invoices/Modals/SelectGowdown";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import BackButton from "../invoices/Cards/BackButton";

import { jwtDecode } from "jwt-decode";
import VenPanCard from "../invoices/Modals/VenPanCard";
import { useSelector } from "react-redux";
import DeleteButton from "../Buttons/DeleteButton";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";

const AddPurchases = () => {
  const location = useLocation();
  const [addProduct1, setAddProduct1] = useState(false);
  const [PurchaseInput, setPurchaseInput] = useState("");
  const [taxableIput, setTaxableInput] = useState(false);
  const history = useHistory();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isAnotherModalVisible, setIsAnotherModalVisible] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [GodownList, setGodownList] = useState([]);

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

  const [venpancardmodalOpen, setVenPancardmodalOpen] = useState(false);

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

  // const fetchCurrencyData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/AddCurrency/currency"
  //     );
  //     setCurrencyData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCurrencyData();
  // }, []);


  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/addPurchases/purchases/${userData?.data?._id}`)
      .then((response) => {
        setDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const userData = useSelector((state) => state?.user?.userData)

  console.log("userData", userData)


  useEffect(() => {

    setFormData({
      ...formData,
      bussPANNumber: userData?.data?.PANNumber || "",
    });
  }, []);

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
        purchaseNumber: getNextInvoiceNumber(),
      }));
    }
  }, [datasource]);

  const [customer, setCustomer] = useState([]);
  const [customerUniqueid, setCustomerUniqueid] = useState([]);

  console.log("customerkndrop", customer);

  // const fetchCustomers = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/addVendor/vendors"
  //     );
  //     console.log("vendors", response.data);
  //     setCustomer(response.data);
  //     setCustomerUniqueid(response.data);
  //   } catch (error) {
  //     console.error("Error fetching customers:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCustomers();
  // }, []);

  const [formData, setFormData] = useState({
    purchaseName: "Purchases Invoice",
    purchaseNumber: 1,
    name: "",
    businessId: userData?.data?._id,
    vendorName: "",
    purchasesDate: new Date(),
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
    currentRevenu: 0,
    businessRevenu: 0,
    balance: 0,
    table: [],
    bankDetails: {
      selectBank: "",
      notes: "",
      termsAndConditions: "",
      additionalCharges: "",

      uploadReceipt: null,
      uploadReceiptName: "",
      grandTotal: "",
      totalDiscount: 0,
      totalGst: 0,
    },
  });

  console.log("purchaseFormData", formData);

  const [isFullyPaid, setIsFullyPaid] = useState(false);

  console.log("isFullyPaid", isFullyPaid);

  const handleCheckboxChange = (e) => {
    setIsFullyPaid(e.target.checked);
  };
  const balance = isFullyPaid ? 0 : totalAmount;

  console.log("formData in add", formData);

  const [validation, setValidation] = useState({
    vendorName: { isValid: true, message: "" },
  });

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const handleShowAddresses = () => {
    setShowAddresses(!showAddresses);
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

    if (!formData.vendorName) {
      validationErrors.vendorName = {
        isValid: false,
        message: "Please select a customer name",
      };
    }
    if (!PurchaseInput && !productsSelected) {
      validationErrors.productsSelected = {
        isValid: false,
        message: "Please select products",
      };
      console.error("Please select products");
    }

    // if (formData.table.length === 0) {
    //   setProductsSelected(false);
    //   validationErrors.productsSelected = {
    //     isValid: false,
    //     message: "Please select products",
    //   };
    //   console.error("Please select products");
    // }


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
        `http://localhost:8000/api/addPurchases/purchases/${userData?.data?._id}`,
        { formData }
      );

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
            ? setVenPancardmodalOpen(true)
            : setVenPancardmodalOpen(false);
        }
        return;
      } else {
        toast.success("Purchase Invoice Added Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push("/purchase-invoice");
        setFormData({
          purchaseNumber: "",
          name: "",
          vendorName: "",
          purchasesDate: new Date(),
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
      const response = await axios.get(`http://localhost:8000/api/addgst/gst/${userData?.data?._id}`);
      setGstData(response.data);
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
    if (fieldName === "vendorName") {
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

  useEffect(() => {
    const vendorid = location.state?.state?.contact_id;
    if (vendorid) {
      console.log("vendorid", vendorid);
      const matchedCustomer = customer.find(
        (option) => option._id === vendorid
      );
      console.log("matchedCustomer", matchedCustomer);
      if (matchedCustomer) {
        setSelectedCustomerId(matchedCustomer._id);
      }
      handleCustomerChange("vendorName", vendorid);
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

  // const fetchProductsbyId = async (selectedproduct) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/addProduct/products/${selectedproduct}`
  //     );
  //     setSelectedProductId(response.data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (selectedproduct) {
  //     fetchProductsbyId(selectedproduct);
  //   }
  // }, [selectedproduct]);

  const [product, setProduct] = useState([]);

  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/addProduct/products"
  //     );
  //     setProduct(response.data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  const handleproductchange = (productId, godownId) => {
    // console.log("GODOWN__ID", godownId);
    // setProductsSelected(true);
    // const selectedProduct = product.find((prod) => prod._id === productId);
    // const gstRateTaxId = selectedProduct.gstTaxRate;
    // const foundGstData = gstData?.find((gst) => gst._id === gstRateTaxId) || 0;

    // console.log("foundGstData", foundGstData);
    // const gstRateTaxValue = foundGstData ? foundGstData.gstPercentageValue : 0;

    // console.log("selectedProduct", selectedProduct);
    // let price;

    // if (selectedProduct.taxType === "With Tax") {
    //   price =
    //     parseFloat(selectedProduct.salesPrice) / (1 + gstRateTaxValue / 100);
    // } else {
    //   price = parseFloat(selectedProduct.salesPrice);
    // }

    // let MaxQuantity = 1;
    // if (godownId) {
    //   for (let i = 0; i < selectedProduct.Godown.length; i++) {
    //     if (selectedProduct.Godown[i].godownId === godownId) {
    //       MaxQuantity = selectedProduct.Godown[i].stock;
    //     }
    //   }
    // } else if (parseFloat(selectedProduct.openingStock) > 0) {
    //   MaxQuantity = parseFloat(selectedProduct.openingStock);
    // } else {
    //   MaxQuantity = 1;
    // }

    // price = (selectedProduct.salesPrice * (1 - gstRateTaxValue / 100)).toFixed(2);

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
    setTaxableInput(true);
    setProductsSelected(true);
  };

  const handleDeleteItem = (index) => {
    const updatedTable = [...formData.table];
    updatedTable.splice(index, 1);
    setFormData({ ...formData, table: updatedTable });
    setTaxableInput(false);
  };

  const getNextInvoiceNumber = () => {
    if (datasource.length === 0) {
      return 1;
    } else {
      const maxInvoiceNumber = Math.max(
        ...datasource.map((invoice) => invoice.purchaseNumber)
      );
      return maxInvoiceNumber + 1;
    }
  };

  // const fetchGodownData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/godown/godownlist"
  //     );
  //     setGodownList(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchGodownData();
  // }, []);


  const handleFilereciptChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const file = selectedFile.name
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


  console.log("formData.bankDetails.uploadReceipt", formData.bankDetails.uploadReceipt)


  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header justify-normal items-center space-x-2">
                <BackButton />
                <h5 className="mt-0">Create Purchases Invoice</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body pt-10">
                    <div className="form-group-item border-0 mb-0">
                      <div className="row align-item-center">

                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>
                              Purchase Id<span className="text-danger"></span>
                            </label>
                            <Input
                              type="text"
                              className="form-control cursor-not-allowed"
                              placeholder="Enter Invoice Number"
                              value={
                                formData.purchaseNumber ||
                                getNextInvoiceNumber()
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>
                              Vendor Name
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control cursor-not-allowed ${!validation?.vendorName?.isValid ? "is-invalid" : ""}`}
                              placeholder="Enter Customer Name"
                              value={formData?.vendorName}
                              onChange={(e) =>
                                handleCustomerChange("vendorName", e.target.value)
                              }
                            />
                            {!validation?.vendorName?.isValid && (
                              <p className="error-message text-danger mt-1 pt-1">
                                {validation?.vendorName?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>Purchase Date</label>
                            <div className="cal-icon cal-icon-info">
                              <DatePicker
                                className="datetimepicker form-control"
                                selected={formData.purchasesDate}
                                onChange={(date) =>
                                  handleDateChange("purchasesDate", date)
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
                                  <th>Product / Service</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
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
                                          <DeleteButton />
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
                                Select Items
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
                                    placeholder="Enter Purchase Name"
                                    className="select-products-button"
                                    onChange={(e) =>
                                      setPurchaseInput(e.target.value)
                                    }
                                    value={PurchaseInput}
                                  />
                                </div>
                                <div className="select-products-button-plus col-md-4 p-0">
                                  {/* <Tooltip title="Please Enter Product Name" placement="top"> */}
                                  <button
                                    className="btn btn-primary flex justify-center items-center h-[100%]"
                                    onClick={handleproductchange}
                                    disabled={!PurchaseInput}
                                  >
                                    <i
                                      className="fa fa-plus-circle pr-2"
                                      aria-hidden="true"
                                    />
                                    Add New Item
                                  </button>
                                  {/* </Tooltip> */}
                                </div>
                                {validation.productsSelected &&
                                  !productsSelected && (
                                    <div className="error-message text-danger mt-1 pt-1">
                                      {validation.productsSelected.message}
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="invoice-total-box col-md-12">
                              {taxableIput &&

                                <div className="invoice-total-footer" style={{ width: "90%" }}>
                                  <h4>
                                    Taxable Amount <span>{taxableAmount.toFixed(2)}</span>
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
                                    Grand Total(INR) <span>{totalAmount.toFixed(2)}</span>
                                  </h4>


                                </div>
                              }
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
                                <p>Uploaded file: {formData.bankDetails.uploadReceiptName}</p>
                              </div>

                            </>
                          )}
                        </div>
                      </div>
                    </div>



                    <div className="add-customer-btns text-end pt-5">
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
        {/* <SelectBank
          bankoptions={bankoptions}
          formData={formData}
          handleAccountChange={handleAccountChange}
        /> */}
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

export default AddPurchases;
