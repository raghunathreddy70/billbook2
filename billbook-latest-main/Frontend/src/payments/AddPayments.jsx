import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import DatePicker from "react-datepicker";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import { BiSolidKeyboard } from "react-icons/bi";
import axios from "axios";
import { search } from "../_components/imagepath";
import { Table } from "antd";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
const AddPayment = () => {
  const location = useLocation();
  const [validation, setValidation] = useState({
    vendorID: true,
    paymentAmount: true,
    amount: true,
    paymentDate: true,
    paymentType: true,
    bankID: true,
  });
  const history = useHistory();

  const [menu, setMenu] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [vendorPurchaseDetails, setVendorPurchaseDetails] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [datasource, setDatasource] = useState([]);

  const getNextPaymentOutNumber = () => {
    if (datasource.length === 0) {
      return 1;
    } else {
      const maxPaymentNumber = Math.max(
        ...datasource.map((payment) => payment.paymentOutNumber)
      );
      return maxPaymentNumber + 1;
    }
  };

  useEffect(() => {
    if (datasource.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        paymentOutNumber: getNextPaymentOutNumber(),
      }));
    }
  }, [datasource]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/addVendor/vendors"
      );
      setVendorDetails(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/paymentOutDetails/paymentout")
      .then((response) => {
        console.log(response.data);
        setDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log("datasource", datasource);

  const venderOptions = vendorDetails.map((ven) => ({
    id: ven.vendorId,
    text: ven.name,
  }));

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      paymentDate: date,
    });
  };

  const [purchasesid, setPurchasesid] = useState("");

  const [formData, setFormData] = useState({
    voucherName: "Payment Out",
    paymentOutNumber: 1,
    // bankDetails: "",
    vendorID: "",
    bankID: "",
    paymentDate: new Date(),
    purchasesId: [],
    paymentAmount: 0,
    name: "",
    vendorname: "",
    paymentType: "",
    notes: "",
    paymentStatus: "",
    paymentBalance: 0,
    amount: 0,
  });

  console.log("formData", formData);

  useEffect(() => {
    const vendor = vendorDetails.find(
      (vendor) => vendor.vendorId === formData.vendorID
    );
    if (vendor) {
      setFormData((prevState) => ({
        ...prevState,
        vendorname: vendor.name,
      }));
    }
  }, [vendorDetails, formData.vendorID]);

  function FormValidation(formData) {
    const validationErrors = {};
    if (!formData.vendorID) {
      validationErrors.vendorID = false;
      console.error("Please select a customer");
    }
    if (!formData.amount) {
      validationErrors.amount = false;
      console.error("Please Enter Payment Amount");
    }
    if (!formData.paymentDate) {
      validationErrors.paymentDate = false;
      console.error("Please Select Payment Date");
    }
    if (!formData.paymentType) {
      validationErrors.paymentType = false;
      console.error("Please Select Payment Type");
    }
    if (formData.paymentType === "Bank") {
      if (!formData.bankID) {
        validationErrors.bankID = false;
        console.error("Please Select Bank");
      }
    }
    return validationErrors;
  }

  const [active, setActive] = useState(false);

  // const onSelectChange = (selectedRowKeys, selectedRows) => {
  //   setSelectedRowKeys(selectedRowKeys);
  //   setPurchasesid(selectedRowKeys);
  //   if (selectedRowKeys.length > 0) {
  //     setActive(true);
  //   } else {
  //     setActive(false);
  //   }

  //   let totalPaymentAmount = 0;
  //   let purchasesid = "";
  //   selectedRows.forEach((row) => {
  //     totalPaymentAmount += row.balance;
  //     purchasesid = row._id;
  //   });
  //   if (totalPaymentAmount > 0) {
  //     setValidation({
  //       ...validation,
  //       amount: true,
  //     });
  //   }
  //   setFormData({
  //     ...formData,
  //     amount: totalPaymentAmount,
  //     purchasesId: purchasesid,
  //   });
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  //   type: "checkbox",
  // };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setPurchasesid(selectedRowKeys);
    if (selectedRowKeys.length > 0) {
      setActive(true);
    } else {
      setActive(false);
    }

    let totalPaymentAmount = 0;
    let selectedPurchasesIds = [];
    selectedRows.forEach((row) => {
      totalPaymentAmount += row.balance;
      selectedPurchasesIds.push(row._id);
    });

    if (totalPaymentAmount > 0) {
      setValidation({
        ...validation,
        amount: true,
      });
    }

    setFormData({
      ...formData,
      amount: totalPaymentAmount,
      purchasesId: selectedPurchasesIds, // Assigning the array of selected purchases IDs
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: "checkbox",
  };

  const dataSource = vendorPurchaseDetails.map((record, index) => ({
    ...record,
    key: index,
  }));
  console.log("Selected Row Keys:", selectedRowKeys);

  const columns = [
    {
      title: "Date",
      dataIndex: "purchasesDate",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
    },
    {
      title: "Purchase Number",
      dataIndex: "purchaseNumber",
    },
    {
      title: "Total Amount / Balance",
      dataIndex: "totalAndBalance",
      render: (_, record) => (
        <>
          Grand Total: {record.grandTotal}
          <br />
          Balance: {record.balance}
        </>
      ),
    },
    {
      title: "Amount Settled",
      dataIndex: "balance",
      render: (_, record) => (
        <>{selectedRowKeys.includes(record._id) ? record.balance : 0}</>
      ),
    },
  ];

  const handleCustomerNameChange = (fieldName, value) => {
    if (value) {
      console.log("value", value);
      setValidation((prevValidation) => ({
        ...prevValidation,
        name: true,
      }));
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    fetchDetails(value);
  };

  useEffect(() => {
    const vendorid = location.state?.state?.contact_id;
    if (vendorid) {
      console.log("vendorid", vendorid);
      const matchedCustomer = vendorDetails.find(
        (option) => option._id === vendorid
      );
      console.log("matchedCustomer", matchedCustomer);
      if (matchedCustomer) {
        setSelectedCustomerId(matchedCustomer._id);
      }
      handleCustomerNameChange("vendorID", vendorid);
    }
  }, [location.state]);

  const fetchDetails = async (vendorid) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/addPurchases/purchasesbyVendorId/${vendorid}`
      );
      setVendorPurchaseDetails(response.data);
      console.log("Fetched Customer Details:", response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };
  const handlePaymentAmountChange = (e) => {
    const enteredAmount = parseFloat(e.target.value);
    if (enteredAmount) {
      setValidation({
        ...validation,
        amount: true,
      });
    }
    // const newBalance = customerInvoiceDetails.grandTotal - parseFloat(e.target.value);
    setFormData({ ...formData, amount: enteredAmount });
  };

  const handleNotesChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      notes: value,
    });
  };

  const handlePaymentModeChange = (event) => {
    const value = event.target.value;
    if (value) {
      setValidation({
        ...validation,
        paymentType: true,
      });
    }
    setFormData({
      ...formData,
      paymentType: value,
    });
  };

  const handleBankDetailsChange = (event) => {
    const value = event.target.value;
    if (value) {
      setValidation({
        ...validation,
        bankID: true,
      });
    }
    setFormData({
      ...formData,
      bankID: value,
    });
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = FormValidation(formData);
      if (Object.keys(validationErrors).length > 0) {
        setValidation((prevValidation) => ({
          ...prevValidation,
          ...validationErrors,
        }));
        return;
      }
      const initialResponse = await fetch(
        "http://localhost:8000/api/paymentOutDetails/payment-out",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      toast.success("Payment Added Succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      history.push(`/payment-out-view/${formData.purchasesId}`);
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  let paymentOptions = ["Cash", "Bank", "Cheque"];

  const [bankData, setBankData] = useState(null);

  useEffect(() => {
    if (bankData && bankData.length > 0) {
      const options = bankData.map((bank) => ({
        id: bank.bankId,
        text: bank.accountName,
      }));
      setBankOptions(options);
    }
  }, [bankData]);

  const [bankOptions, setBankOptions] = useState([]);

  console.log("bankOptions.,", bankOptions);

  const fetchBankData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/BankDeatils/bank-details"
      );
      console.log("bankData:", response.data);
      setBankData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, []);
  console.log("bankData", bankData);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);

  const handleChange = (date) => {
    setDate(date);
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={14} />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header">
                <div>
                  <h5 className="flex-a align-items-center">
                    <Link to="/payment-out">
                      <span className="arrow-mark-out-payment">
                        <FeatherIcon icon="chevron-left" />
                      </span>
                    </Link>
                    Add Payment Out
                  </h5>
                </div>

              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="col-lg-12 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label>
                                Party Name<span className="text-danger">*</span>
                              </label>

                              <select
                                className={`form-select ${!validation.vendorID && "is-invalid"
                                  }`}
                                value={formData.vendorID}
                                onChange={(e) => {
                                  handleCustomerNameChange(
                                    "vendorID",
                                    e.target.value
                                  );
                                }}
                              >
                                <option value="">Choose Customer</option>
                                {vendorDetails.map((option) => (
                                  <option key={option._id} value={option._id}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                              {!validation.vendorID && (
                                <p className="error-message text-danger">
                                  Please Enter Party Name
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-6 col-sm-12">
                            <div className="form-group">
                              <div className="flex justify-between">
                                <div>
                                  <label>
                                    Enter Payment Amount
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <span className="!text-sm">
                                  <i>Note : Please Select Transaction</i>
                                </span>
                              </div>
                              <input
                                type="text"
                                className={`form-control ${!active && "cursor-not-allowed"
                                  } ${!validation.amount ? "is-invalid" : ""}`}
                                value={formData.amount}
                                onChange={handlePaymentAmountChange}
                                readOnly
                              />

                              {!validation.amount && (
                                <div className="error-message text-danger">
                                  please enter payment amount
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12 col-sm-12">
                            <div className="form-group">
                              <label>Notes</label>
                              <textarea
                                rows="5"
                                cols="5"
                                className="form-control"
                                placeholder="Enter Notes"
                                value={formData.notes}
                                onChange={handleNotesChange}
                              ></textarea>
                            </div>
                          </div>
                          <div>
                            <button
                              className="btn btn-import"
                              onClick={handleSavePayment}
                              type="submit"
                              style={{
                                background: "rgb(64, 39, 246)",
                                color: "white",
                                width:"170px",
                                marginTop:"15px",
                              }}
                            >
                              Save Payment
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  As Of Date
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="cal-icon cal-icon-info">
                                  <DatePicker
                                    selected={formData.paymentDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    showTimeInput={false}
                                    className="datetimepicker form-control"
                                  />
                                  {!validation.paymentDate && (
                                    <div
                                      className={`invalid-feedback ${!validation.paymentDate ? "block" : ""
                                        }`}
                                    >
                                      please Select Payment Date
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  Payment Mode
                                  <span className="text-danger">*</span>
                                </label>
                                <Select2
                                  data={paymentOptions}
                                  options={{
                                    placeholder: "Choose Payment Type",
                                  }}
                                  className={`form-select is-invalid`}
                                  value={formData?.paymentType}
                                  onChange={handlePaymentModeChange}
                                />
                                {!validation.paymentType && (
                                  <p className="error-message text-danger">
                                    Please select a customer
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* {formData.paymentType === "Bank" && ( */}
                            {(formData.paymentType === "Bank" ||
                              formData.paymentType === "Cheque") && (
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>
                                      Bank Details
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Select2
                                      className={`form-select is-invalid`}
                                      data={bankOptions}
                                      value={formData.bankID}
                                      options={{
                                        placeholder: "Search bank",
                                      }}
                                      onChange={(value) =>
                                        handleBankDetailsChange(value)
                                      }
                                    />
                                    {!validation.bankID && (
                                      <p className="error-message text-danger">
                                        Please select a bank
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                            <div className="col-md-12 col-sm-12">
                              <div className="form-group">
                                <label>Payment Out Number</label>
                                <input
                                  type="text"
                                  className="form-control cursor-not-allowed"
                                  value={
                                    formData.paymentOutNumber ||
                                    getNextPaymentOutNumber()
                                  }
                                  readOnly
                                />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="add-payment-checkbox-table-parent 300:overflow-x-scroll">
              <div className="add-payment-checkbox-table1">
                <div className="top-nav-search">
                  <form>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search here"
                    />
                    <button className="btn" type="submit">
                      <img src={search} alt="img" />
                    </button>
                  </form>
                </div>
              </div>
              <Table
                rowSelection={rowSelection}
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={vendorPurchaseDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddPayment;
