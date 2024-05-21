import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import FeatherIcon from "feather-icons-react";
import Select2 from "react-select2-wrapper";
import "regenerator-runtime/runtime";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Select, Tooltip, Input, Table } from "antd";
import { Button } from "antd";
import BackButton from "./Cards/BackButton";
import SelectProducts from "./Modals/SelectProducts";
import SelectBank from "./Modals/SelectBank";
import SelectCurrency from "./Modals/SelectCurrency";
import AddProductServicesModal from "../products/AddProductServicesModal";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import AddCustomer from "../customers/AddCustomer";
import PanCardNumber from "./Modals/PanCardNumber";
import { useDispatch, useSelector } from "react-redux";
import { backendUrl } from "../backendUrl";
import { VerifyUser } from "../reducers/userReducer";

const AddInvoice = () => {
  const location = useLocation();
  const [addProduct1, setAddProduct1] = useState(false);
  const [selectBank1, setSelectBank1] = useState(false);
  const history = useHistory();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isAnotherModalVisible, setIsAnotherModalVisible] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [GodownList, setGodownList] = useState([]);
  const dispatch = useDispatch();

  const [bankSelected, setBankSelected] = useState(false);
  const [productsSelected, setProductsSelected] = useState(false);

  const userData = useSelector((state) => state?.user?.userData);

  console.log("userDataasdas", userData);

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
      if (userData?.data?._id) {
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
  const closepancardModal = () => {
    setPancardmodalOpen(false);
  };

  useEffect(() => {
    if (userData?.data?._id) {
      axios
        .get(
          `http://localhost:8000/api/addInvoice/invoices/${userData?.data?._id}`
        )
        .then((response) => {
          setDatasource(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      bussPANNumber: userData?.data?.PANNumber || " ",
    });
  }, [userData]);

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
    const newPaymentType =
      value === "Bank" || value === "Cheque" ? value : "Cash";
    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentType: newPaymentType,
    }));
    setPaymentMethod(value);
  };

  const fetchData = async () => {
    try {
      if (userData?.data?._id) {
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

  const selectAfter = (
    <Select defaultValue="Cash" onChange={handlePaymentMethodChange}>
      <Option value="Cash">Cash</Option>
      <Option value="Bank">Bank</Option>
      <Option value="Cheque">Cheque</Option>
    </Select>
  );

  const handleBankChanges = (value) => {
    const account = bankData.find((account) => account.bankId === value);
    console.log("account", account);
    setSelectedAccount(account);
    setFormData({
      ...formData,
      bankId: value,
      bankDetails: {
        ...formData.bankDetails,
        selectBank: account._id,
      },
    });

    if (account) {
      setBankSelected(true);
      setBankSelect(true);
    }
  };

  const bankDropdown =
    paymentMethod === "Bank" || paymentMethod === "Cheque" ? (
      <Select defaultValue="Select Bank" onChange={handleBankChanges}>
        {bankData.map((bank) => (
          <Option key={bank.bankId} value={bank.bankId}>
            {bank.branchName}
          </Option>
        ))}
      </Select>
    ) : null;

  const bankoptions = bankData.map((cus) => ({
    id: cus._id,
    text: cus.branchName,
  }));

  const [selectedBankId, setSelectedBankId] = useState(null);

  console.log("selectedBankId", selectedBankId);

  const [bankSelect, setBankSelect] = useState(false);
  const handleAccountChange = (event) => {
    const selectedBranchId = event.target.value;

    console.log("selectedBranchId", selectedBranchId);
    const account = bankData.find(
      (account) => account._id === selectedBranchId
    );
    setSelectedBankId(selectedBranchId);

    // const selectedBranchName = event.target.value;
    // const account = bankData.find(
    //   (account) => account._id === selectedBranchName
    // );
    setSelectedAccount(account);
    setFormData((prevFormData) => ({
      ...prevFormData,
      bankDetails: {
        ...prevFormData.bankDetails,
        selectBank: selectedBranchId,
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
    const newGstRate = parseFloat(e.target.value) || 0;

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
        invoiceNumber: parseInt(getNextInvoiceNumber()),
      }));
    }
  }, [datasource]);

  const [customer, setCustomer] = useState([]);
  const [customerUniqueid, setCustomerUniqueid] = useState([]);

  console.log("customerkndrop", customer);

  const fetchCustomers = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/addCustomer/customers/${userData?.data?._id}`
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

  const [formData, setFormData] = useState({
    invoiceName: "Sales Invoice",

    invoiceNumber: 1,
    customerName: "",
    customername: "",
    paymentType: "",
    invoiceDate: new Date(),
    dueDate: new Date(),
    referenceNo: "",
    products: "",
    paymentTerms: 0,
    currency: 0,
    website: "",
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

  useEffect(() => {
    if (userData && userData.data && userData.data.signatureImage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bankDetails: {
          ...prevFormData.bankDetails,
          signatureImage: userData.data.signatureImage.url,
        },
      }));
    }
  }, [userData]);

  const [isFullyPaid, setIsFullyPaid] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const toggleConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  // const handleCheckboxChange = (e) => {
  //   setIsFullyPaid(e.target.checked);
  // };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsFullyPaid(checked);

    // Update paymentType based on checkbox state
    const newPaymentType = checked
      ? "Cash"
      : formData.bankDetails.selectBank
      ? "Bank"
      : "Cash";
    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentType: newPaymentType,
    }));
  };

  const balance = isFullyPaid ? 0 : totalAmount;

  console.log("formData in add", formData);

  const [validation, setValidation] = useState({
    customerName: { isValid: true, message: "" },
  });

  const handlePaymentTermsChange = (terms) => {
    const days = parseInt(terms);
    const date = Date.now();

    const moonLanding = new Date(formData.invoiceDate).getTime();

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
        date.getTime() - formData.invoiceDate.getTime()
      );
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const paymentTerms = diffDays;

      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: date,
        paymentTerms: paymentTerms.toString(),
      }));

      if (fieldName === "paymentTerms" && formData.invoiceDate) {
        const dueDate = new Date(formData.invoiceDate);
        dueDate.setDate(dueDate.getDate() + parseInt(date, 10));
        setFormData((prevData) => ({
          ...prevData,
          dueDate,
        }));
      }

      if (fieldName === "invoiceDate" && formData.invoiceDate) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: date,
          dueDate: "",
          paymentTerms: "0",
        }));
      }

      if (fieldName === "dueDate" && formData.invoiceDate) {
        const differenceInDays = Math.floor(
          (date - formData.invoiceDate) / (24 * 60 * 60 * 1000)
        );
        let days = daysBetweenDates(formData.invoiceDate, date);
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

    if (
      (paymentMethod === "Bank" || paymentMethod === "Cheque") &&
      !selectedAccount
    ) {
      toast.error("Please select a bank before submitting.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      // await dispatch(VerifyUser());

      console.log("TRIGGERERE HANDLE SUBMIT WITH DAATA", userData);
      const response = await axios.post(
        "http://localhost:8000/api/addInvoice/invoices",
        { ...formData, businessId: userData?.data?._id }
      );
      console.log("Data submitted successfully:", typeof response.data.invoice);

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
        toast.success("Invoice Added Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push("/invoice-list");
        setFormData({
          invoiceNumber: 1,
          customerName: "",
          invoiceDate: new Date(),
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
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred while submitting the invoice", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchGstData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/addgst/gst/${userData?.data?._id}`
        );
        setGstData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGstData();
  }, []);

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
        const newPrice = (parseFloat(value) > 0 && parseFloat(value)) || 0;
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
      const price = (parseFloat(item.price) > 0 && parseFloat(item.price)) || 0;
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
      const price = (parseFloat(item.price) > 0 && parseFloat(item.price)) || 0;
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
      const price = (parseFloat(item.price) > 0 && parseFloat(item.price)) || 0;
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
        consle.log("reader.result", reader?.result);
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
    const value = parseFloat(e.target.value) || "";

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
    const price = (parseFloat(item.price) > 0 && parseFloat(item.price)) || 0;
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
    const newDiscount = parseFloat(e.target.value) || "";

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

        if (newGstRate !== 0) {
          updatedTable[index]["tax"] = newGstRate;
        } else {
          updatedTable[index]["tax"] = "";
        }
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
      const previousTotalGstAmount =
        parseFloat(updatedItem.totalGstAmount) || 0;

      console.log("previousTotalGstAmount", previousTotalGstAmount);
      const previousDiscountAmount = parseFloat(updatedItem.discount) || 0;
      const previousQuantity = parseFloat(updatedItem.quantity) || 0;
      const gstrate = parseFloat(updatedItem.gstRate) || 0;

      if (field === "totalAmount" && !isNaN(newTotalAmount)) {
        let newPrice =
          (newTotalAmount / (quantity * (1 + gstrate / 100))) *
          (100 / (100 - previousDiscountAmount));

        console.log("newPrice", newPrice);
        updatedItem.price = (parseInt(newPrice) > 0 && newPrice) || 0;
      } else if (field === "price") {
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
      if (userData?.data?._id) {
        const response = await axios.get(
          `${backendUrl}/api/addProduct/products/${userData?.data?._id}`
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

  const handleproductchange = (productId, godown) => {
    console.log("GODOWN__ID", godown);

    let TotalQuantity = 1;

    if (godown?.values) {
      TotalQuantity =
        godown?.values?.reduce(
          (accumulator, currentValue) => accumulator + currentValue || 0,
          0
        ) || 0;
    } else {
      TotalQuantity = 1;
    }

    if (TotalQuantity === 0) return;

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
    if (parseFloat(selectedProduct.openingStock) > 0) {
      MaxQuantity = parseFloat(selectedProduct.openingStock);
    } else {
      MaxQuantity = 1;
    }

    const newTable = [...formData.table];
    newTable.push({
      pid: selectedProduct.productId,
      productId: selectedProduct._id,
      productName: selectedProduct.itemName
        ? selectedProduct.itemName
        : selectedProduct.serviceName,
      price: price || 0,
      quantity: TotalQuantity,
      maxQuantity: MaxQuantity,
      discount: 0,
      tax: 0,
      gstRate: foundGstData.gstPercentageValue,
      totalAmount: foundGstData.gstPercentageValue
        ? price * TotalQuantity * (1 + foundGstData.gstPercentageValue / 100)
        : price * TotalQuantity || 0,
      totalDiscount: "",
      totalTax: foundGstData.gstPercentageValue || 0,
      totalGstAmount: 0,
      godownDetails: godown,
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
        ...datasource.map((invoice) => invoice.invoiceNumber)
      );
      return maxInvoiceNumber + 1;
    }
  };

  const fetchGodownData = async () => {
    try {
      if (userData?.data?._id) {
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

  const [godownUpdateValue, setGodownUpdateValue] = useState(null);
  const [godownUpdateValueOpen, setGodownUpdateValueOpen] = useState(false);
  const [quantityAddedInGodown, setQuantityAddedInGodown] = useState([]);

  console.log("godownUpdateValue", godownUpdateValue);

  const handleChangeGodownQty = (index, incrementor, maxQty) => {
    const updatedQuantityArray = [...quantityAddedInGodown];
    updatedQuantityArray[index] = updatedQuantityArray[index] || 0;

    if (updatedQuantityArray[index] + incrementor <= maxQty) {
      updatedQuantityArray[index] =
        parseInt(updatedQuantityArray[index]) + incrementor;
    }
    setQuantityAddedInGodown(updatedQuantityArray);
  };

  const handleGodownInputChange = (e, index, maxQty) => {
    const updatedQuantityArray = [...quantityAddedInGodown];
    const { value } = e.target;
    console.log("value", value);
    if (value === "") {
      updatedQuantityArray[index] = 0;
    }
    if (parseInt(value) <= maxQty && !(parseInt(value) < 0)) {
      updatedQuantityArray[index] = parseInt(value) || 0;
      console.log(updatedQuantityArray[index]);
    }
    setQuantityAddedInGodown(updatedQuantityArray);
  };

  const godownCols = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record, index) => (
        <div>
          {console.log("The main Record is", record)}
          <h2 className="table-avatar">{index + 1}</h2>
        </div>
      ),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Godown List",
      dataIndex: "godownName",
      render: (text, record, index) => <div>{text}</div>,
    },
    {
      title: "Quantity",
      dataIndex: "stock",
      render: (stock, record, index) => (
        <div>
          {quantityAddedInGodown[index] &&
          parseInt(quantityAddedInGodown[index]) > 0 ? (
            <>
              <div className="flex justify-center gap-4">
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleChangeGodownQty(index, -1, stock);
                  }}
                >
                  -
                </div>
                <input
                  className="w-8"
                  type="number"
                  onChange={(e) => handleGodownInputChange(e, index, stock)}
                  value={parseInt(quantityAddedInGodown[index])}
                  defaultValue={0}
                />
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleChangeGodownQty(index, 1, stock);
                  }}
                >
                  +
                </div>
              </div>
            </>
          ) : (
            <div
              onClick={(e) => {
                handleChangeGodownQty(index, 1, stock);
              }}
            >
              Add +
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Total Stock",
      dataIndex: "stock",
      render: (stock, record, index) => <div>{stock}</div>,
    },
  ];

  const handleGodownQuantity = (tableData, index) => {
    console.log("TableData with Index", tableData, index);
    setGodownUpdateValue(tableData);
    setQuantityAddedInGodown(tableData.godownDetails.values);
    setGodownUpdateValueOpen(true);
  };

  const handleCloseModal = () => {
    setGodownUpdateValueOpen(false);
    setGodownUpdateValue(null);
  };
  const handleProductTableDetailsUpdate = () => {
    console.log(
      "godownUpdateValue",
      godownUpdateValue,
      "\n",
      quantityAddedInGodown
    );
    const value =
      quantityAddedInGodown?.reduce(
        (accumulator, currentValue) => accumulator + currentValue || 0,
        0
      ) || 0;

    const index = godownUpdateValue.godownDetails.tableIndex;
    if (value === 0) {
      handleDeleteItem(index);
      handleCloseModal();
      return;
    }
    setFormData((prevData) => {
      const updatedTable = [...prevData.table];
      const updatedItem = { ...updatedTable[index] };

      updatedItem.godownDetails.values = quantityAddedInGodown;
      updatedItem["quantity"] = value;
      updatedItem.totalAmount = calculateTotalAmountForItem(updatedItem);

      updatedTable[index] = updatedItem;

      return {
        ...prevData,
        table: updatedTable,
      };
    });
    handleCloseModal();
  };
  return (
    <>
      {godownUpdateValueOpen && (
        <Modal
          title="Select Godown"
          open={godownUpdateValueOpen}
          onCancel={handleCloseModal}
          // onOk={handleGodownSelected}
          footer={[
            <Button
              key="back"
              className="btn btn-secondary waves-effect me-2"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              className="btn btn-info waves-effect waves-light"
              onClick={() => handleProductTableDetailsUpdate()}
            >
              Select
            </Button>,
          ]}
        >
          <div className="my-3">
            {godownUpdateValue ? (
              <>
                {godownUpdateValue && (
                  <>
                    {console.log(
                      "godownUpdateValue Main 01",
                      godownUpdateValue
                    )}
                    <Table
                      columns={godownCols}
                      dataSource={
                        godownUpdateValue?.godownDetails?.productId?.Godown
                      }
                      showSorterTooltip={{ target: "sorter-icon" }}
                    />
                  </>
                )}
              </>
            ) : (
              <>No Godown data? Click on Okay to continue and Try again</>
            )}
          </div>
        </Modal>
      )}

      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header justify-normal items-center space-x-2">
                <BackButton />
                <h5 className="mt-0">Add Invoice</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body pt-4">
                    <div className="form-group-item border-0 mb-0">
                      <div className="row align-item-center">
                        <PanCardNumber
                          open={pancardmodalOpen}
                          onClose={closepancardModal}
                          setPancardmodalOpen={setPancardmodalOpen}
                          customerName={formData?.customerName}
                          isCustomerPan={isCustomerPan}
                          isBusinessPan={isBusinessPan}
                          handleSubmit={handleSubmit}
                        />
                        {/* </Modal> */}
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Invoice Number</label>
                            <input
                              type="text"
                              className="form-control cursor-not-allowed"
                              placeholder="Enter Invoice Number"
                              value={
                                formData.invoiceNumber || getNextInvoiceNumber()
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
                                  {customer?.map((option) => (
                                    <option key={option._id} value={option._id}>
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                                {!validation?.customerName?.isValid && (
                                  <p className="error-message text-danger mt-1 pt-1">
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
                            <label>Invoice Date</label>
                            <div className="cal-icon cal-icon-info">
                              <DatePicker
                                // className=" form-control"
                                className="datetimepicker form-control "
                                selected={formData.invoiceDate}
                                onChange={(date) =>
                                  handleDateChange("invoiceDate", date)
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
                                className="form-control"
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
                                          min="0"
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
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "-" ||
                                              e.key === "e"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                        />
                                      </td>

                                      <td>
                                        {console.log("NEW ITEM IN TABLE", item)}
                                        {item?.godownDetails ? (
                                          <input
                                            type="number"
                                            name="re_invoice"
                                            // min="0"
                                            value={item.quantity}
                                            className="form-control form-control-sm"
                                            style={{
                                              width: "130px",
                                              borderStyle: "dotted",
                                              borderWidth: "2px",
                                            }}
                                            onClick={(e) =>
                                              handleGodownQuantity(item, index)
                                            }
                                            onChange={() => {
                                              return;
                                            }}
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === "-" ||
                                                e.key === "e"
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                        ) : (
                                          <input
                                            type="number"
                                            name="re_invoice"
                                            // min="0"
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
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === "-" ||
                                                e.key === "e"
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                        )}
                                      </td>

                                      <td>
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          name="re_invoice"
                                          value={item.discount}
                                          className="form-control form-control-sm"
                                          style={{
                                            width: "130px",
                                            borderStyle: "dotted",
                                            borderWidth: "2px",
                                          }}
                                          onChange={(e) => {
                                            const newValue =
                                              parseInt(e.target.value) || "";
                                            if (newValue <= 100) {
                                              handleDiscountChange(e, index);
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "-" ||
                                              e.key === "e"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
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
                                          {gstData.map((rate, index) => (
                                            <>
                                              {index === 0 && (
                                                <option key={index} value={""}>
                                                  Select a Option
                                                </option>
                                              )}
                                              <option
                                                key={rate._id}
                                                value={rate.gstPercentageValue}
                                              >
                                                {rate.gstPercentageName}
                                              </option>
                                            </>
                                          ))}
                                        </select>
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="re_invoice"
                                          min="0"
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
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "-" ||
                                              e.key === "e"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
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
                                  <div>
                                    <h4>
                                      Received{" "}
                                      <span>
                                        <div className="d-flex align-item-center justify-content-end gap-1">
                                          <Tooltip title="Once submitted, this invoice will become non-editable">
                                            <input
                                              type="checkbox"
                                              name=""
                                              checked={isFullyPaid}
                                              onChange={handleCheckboxChange}
                                            />
                                          </Tooltip>
                                          <p className="m-0">
                                            Mark as fully paid
                                          </p>
                                        </div>

                                        <div className="d-flex align-items-center item-read-button">
                                          {bankDropdown}
                                          <Input
                                            value={
                                              isFullyPaid
                                                ? totalAmount.toFixed(2)
                                                : undefined
                                            }
                                            addonAfter={selectAfter}
                                            styles={{
                                              color: "#4e4444 !important",
                                            }}
                                            disabled
                                          />
                                        </div>
                                      </span>
                                    </h4>
                                  </div>

                                  <h4>
                                    Balance <span>{balance.toFixed(2)}</span>
                                  </h4>
                                </div>
                              )}
                            </div>
                            {isFullyPaid && (
                              <Modal
                                title="Invoice is Not Editable"
                                visible={showConfirmationModal}
                                onCancel={toggleConfirmationModal}
                                footer={[
                                  <Button
                                    key="ok"
                                    onClick={toggleConfirmationModal}
                                  >
                                    OK
                                  </Button>,
                                ]}
                              >
                                <p>
                                  This invoice becomes non-editable once it has
                                  been submitted
                                </p>
                              </Modal>
                            )}

                            <div className="form-group mb-0">
                              <label>Signature Image</label>

                              <img
                                src={formData?.bankDetails?.signatureImage}
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
          selectedBankId={selectedBankId}
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
        fetchData={fetchProducts}
        selectedProductModal={selectedProductModal}
        handleProductCancel={handleProductCancel}
        isProductModalVisible={isProductModalVisible}
        tableData={formData.table}
      />
    </>
  );
};

export default AddInvoice;
