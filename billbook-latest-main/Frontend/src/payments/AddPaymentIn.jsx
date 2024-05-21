import React, { useState, useEffect } from "react";
import Select2 from "react-select2-wrapper";
import DatePicker from "react-datepicker";
import { Table } from "antd";
import axios from "axios";
import { search } from "../_components/imagepath";
import { toast } from "react-toastify";
import BackButton from "../invoices/Cards/BackButton";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";

const AddPaymentIn = () => {
  const location = useLocation();
  const [validation, setValidation] = useState({
    customername: true,
    paymentAmount: true,
    amount: true,
    paymentDate: true,
    paymentType: true,
    bankID: true,
  });
  const history = useHistory();
  const [menu, setMenu] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [customerInvoiceDetails, setCustomerInvoiceDetails] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [datasource, setDatasource] = useState([]);

  console.log("customerInvoiceDetails", customerInvoiceDetails);

  useEffect(() => {
    if(userData?.data?._id){
    axios
      .get(`http://localhost:8000/api/paymentDetails/payment/${userData?.data?._id}`)
      .then((response) => {
        setDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  }, [userData]);

  const getNextPaymentNumber = () => {
    if (datasource.length === 0) {
      return 1;
    } else {
      const maxPaymentNumber = Math.max(
        ...datasource.map((payment) => payment.paymentNumber || 0)
      );
      return maxPaymentNumber + 1;
    }
  };

  function FormValidation(formData) {
    const validationErrors = {};
    if (!formData.customername) {
      validationErrors.customername = false;
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
    console.log(validationErrors, "Valid");
    return validationErrors;
  }

  useEffect(() => {
    if (datasource.length >= 0) {
      setFormData((prevData) => ({
        ...prevData,
        paymentNumber: getNextPaymentNumber(),
      }));
    }
  }, [datasource]);

  // const [paymentDetails, setPaymentDetails] = useState([]);
  const fetchData = async () => {
    try {
      if(userData?.data?._id) {
      const response = await axios.get(
        `http://localhost:8000/api/addCustomer/customers/${userData?.data?._id}`
      );
      setCustomerDetails(response.data);
    }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);

  useEffect(() => {
    if(userData?.data?._id) {
    axios
      .get(`http://localhost:8000/api/paymentDetails/payment/${userData?.data?._id}`)
      .then((response) => {
        console.log(response.data);
        setDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  }, [userData]);

  const customerOptions = customerDetails.map((cust) => ({
    id: cust.customerId,
    text: cust.name,
  }));

  const [bankData, setBankData] = useState([]);

  const fetchbankData = async () => {
    try {
      if(userData?.data?.data) {
      const response = await axios.get(
        `http://localhost:8000/api/BankDeatils/bank-details/${userData?.data?._id}`
      );
      console.log("BankData:", response.data);
      setBankData(response.data);
    }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchbankData();
  }, [userData]);

  const bankOptions =
    bankData &&
    bankData.map((bank) => ({
      id: bank.bankId,
      text: bank.branchName,
    }));

  console.log("bankOptions", bankOptions);

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      paymentDate: date,
    });
  };

  const userData = useSelector((state) => state?.user?.userData);

  useEffect(() => {
    setFormData({ ...formData, businessId: userData?.data?._id });
  }, [userData]);

  const [invoiceid, setinvoiceid] = useState("");

  const [formData, setFormData] = useState({
    voucherName: "Payment In",
    paymentNumber: 1,
    customerID: "",
    businessId: userData?.data?._id,
    bankID: "",
    paymentDate: new Date(),
    customername: "",
    invoiceId: [],
    paymentAmount: 0,
    paymentType: "",
    notes: "",
    paymentStatus: "",
    paymentBalance: 0,
    amount: 0,
  });

  console.log("sedf", formData);

  useEffect(() => {
    const customer = customerDetails.find(
      (customer) => customer.customerId === formData.customername
    );
    if (customer) {
      setFormData((prevState) => ({
        ...prevState,
        customername: customer.name,
      }));
    }


  }, [customerDetails, formData.customername]);

  const [active, setActive] = useState(false);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setinvoiceid(selectedRowKeys);
    console.log("selectedRowKeys", selectedRowKeys);
    if (selectedRowKeys.length > 0) {
      setActive(true);
    } else {
      setActive(false);
    }
    let totalPaymentAmount = 0;
    let invoiceid = [];
    selectedRows.forEach((row) => {
      totalPaymentAmount += row.balance;
      invoiceid.push(row._id);
    });
    console.log(selectedRows, "selectedrows");
    if (totalPaymentAmount > 0) {
      setValidation({
        ...validation,
        amount: true,
      });
    }
    setFormData({
      ...formData,
      amount: totalPaymentAmount,
      invoiceId: invoiceid,
    });
  };
  const [invoiceId, setInvoiceId] = useState([]);



  console.log("invoiceId", invoiceId);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: "checkbox",
  };
  console.log("invoiceid", invoiceid);

  console.log("selectedRowKeys", selectedRowKeys);

  const dataSource = customerInvoiceDetails.map((record, index) => ({
    ...record,
    key: index,
  }));

  const columns = [
    {
      title: "Date",
      dataIndex: "invoiceDate",
      sorter: (a, b) => a.invoiceDate.length - b.invoiceDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.invoiceDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
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
      const matchedCustomer = customerDetails.find(
        (option) => option._id === vendorid
      );
      console.log("matchedCustomer", matchedCustomer);
      if (matchedCustomer) {
        setSelectedCustomerId(matchedCustomer._id);
      }
      handleCustomerNameChange("customername", vendorid);
    }
  }, [location.state]);

  const fetchDetails = async (customerid) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/addInvoice/invoicesbyCustomerId/${customerid}`
      );
      setCustomerInvoiceDetails(response.data);
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
      await fetch("http://localhost:8000/api/paymentDetails/payment-in", {
        ...formData, businessId : userData?.data?._id,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      toast.success("Payment Added Succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      history.push("/payment-in");
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  let paymentOptions = ["Cash", "Bank", "Cheque"];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header justify-normal items-center space-x-2">
                <BackButton />
                <h5>Add Payment In</h5>
              </div>
            </div>
            {/* Other header content */}
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
                                className={`form-select ${
                                  !validation.customername && "is-invalid"
                                }`}
                                value={formData.customername}
                                onChange={(e) => {
                                  handleCustomerNameChange(
                                    "customername",
                                    e.target.value
                                  );
                                }}
                              >
                                <option value="">Choose Customer</option>
                                {customerDetails.map((option) => (
                                  <option key={option._id} value={option._id}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                              {!validation.customername && (
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
                                className={`form-control ${
                                  !active && "cursor-not-allowed"
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
                                      className={`invalid-feedback ${
                                        !validation.paymentDate ? "block" : ""
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
                                <label>Payment In Number</label>
                                <input
                                  type="text"
                                  className="form-control cursor-not-allowed"
                                  value={
                                    formData.paymentNumber ||
                                    getNextPaymentNumber()
                                  }
                                  readOnly
                                  // onChange={handlePaymentNumberChange}
                                />
                              </div>
                            </div>

                            <button
                              className="btn btn-import"
                              onClick={handleSavePayment}
                              type="submit"
                              style={{
                                backgroundColor: "rgb(64 39 246)",
                                color: "white",
                              }}
                            >
                              Save Changes
                            </button>
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
                dataSource={customerInvoiceDetails}
                // rowSelection={rowSelection}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPaymentIn;
