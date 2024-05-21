import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import axios from "axios";
// import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { Table, Tooltip } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import { Switch, Card, Typography } from "antd";
const { Title, Paragraph } = Typography;
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import { backendUrl } from "../backendUrl";
import { render } from "react-dom";
import { useSelector } from "react-redux";
import { FaMagnifyingGlass } from "react-icons/fa6";
import CashandBankSwiper from "./CashandBankSwiper";

const CashBank = () => {
  const [isActive, setIsActive] = useState(-1);
  const userData = useSelector((state) => state?.user?.userData);
  const [showTable, setShowTable] = useState(false);
  const [addCashBank1, setAddCashBank1] = useState(false);
  const [editCashBank1, setEditCashBank1] = useState(false);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [menu, setMenu] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [showContent, setShowContent] = useState(false);
  const [selec, setSelec] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  console.log("bankDetails", bankDetails);
  const [dataSource, setDatasource] = useState([]);

  const [selectedBankIndex, setSelectedBankIndex] = useState(null);
  const [selectedBankData, setSelectedBankData] = useState(null);
  const [selecttedbankid, setselecttedbankid] = useState("");
  const filteredTransactions = bankData?.filter((transaction) => {
    return transaction.bankId === bankData.bankId;
  });

  const handleDeleteConfirm = () => {
    deleteBankDetails(selectedBankData.id)
      .then(() => {
        toast.success("Bank details deleted successfully");

        setDeleteModalVisible(false);
      })
      .catch((error) => {
        console.error("Error deleting bank details:", error.message);

        toast.error("Error deleting bank details. Please try again.");
      });
  };
  const deleteBankDetails = async (selecttedbankid) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/BankDeatils/bankdetails/${selecttedbankid}`
      );

      if (response.status === 200) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("Failed to delete bank details"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const [editCashBankid, setEditCashBankid] = useState("");

  const editUpdateCashBank = (value) => {
    setEditCashBankid(value);
    setEditCashBank1(false);
  };

  const handleAccountClick = (account, index) => {
    setIsActive("bankAccount");
    setSelectedBankData(account);
    setselecttedbankid(account.bankId);
  };

  console.log("bankindex", selectedBankIndex);
  console.log("selecttedbankid", selecttedbankid);

  const handleDateChange = (fieldName, date) => {
    console.log("Selected Date:", date);
    if (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    ) {
      date.setHours(0, 0, 0, 0);
    }
    setFormData({
      ...formData,
      [fieldName]: date,
    });
  };

  const handleToggle = () => {
    setShowContent(!showContent);
  };

  const [formData, setFormData] = useState({
    accountName: "",
    openingBalance: "",
    date: new Date(),
    bankAccountNumber: "",
    reenterBankAccountNumber: "",
    IFSCCode: "",
    branchName: "",
    accountHoldersName: "",
    UPIID: "",
  });

  const [selectedformData, setSelectedformData] = useState({
    accountName: "",
    openingBalance: "",
    date: "",
    bankAccountNumber: "",
    reenterBankAccountNumber: "",
    IFSCCode: "",
    branchName: "",
    accountHoldersName: "",
    UPIID: "",
  });

  console.log("selectedformData", selectedformData);

  const [bankData, setBankData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [validation, setValidation] = useState({
    accountName: { isValid: true, message: "" },
    bankAccountNumber: { isValid: true, message: "" },
    reenterBankAccountNumber: { isValid: true, message: "" },
    IFSCCode: { isValid: true, message: "" },
    branchName: { isValid: true, message: "" },
    accountHoldersName: { isValid: true, message: "" },
  });

  const handleInputChange = (fieldName, value) => {
    let isValid = true;
    let message = "";

    const acountNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    const accountNumberRegex = /^\d{6,}$/;
    const ifscCodeRegex = /^[A-Z]{4}[0][A-Z0-9]{6}$/;
    const branchNameRegex = /^[a-zA-Z0-9-_&'() ]+$/;
    const accountHolderNameRegex = /^[a-zA-Z\s.'-]+$/;

    if (fieldName === "accountName") {
      isValid = acountNameRegex.test(value);
      message = "Invalid account name";
    }
    if (fieldName == "bankAccountNumber") {
      isValid = accountNumberRegex.test(value);
      message = "Invalid bankAccountNumber";
    }
    if (fieldName == "reenterBankAccountNumber") {
      isValid = accountNumberRegex.test(value);
      message = "Invalid reenterBankAccountNumber";
    }
    if (fieldName == "IFSCCode") {
      isValid = ifscCodeRegex.test(value);
      message = "Invalid IFSCCode";
    }
    if (fieldName == "branchName") {
      isValid = branchNameRegex.test(value);
      message = "Invalid branchName";
    }
    if (fieldName == "accountHoldersName") {
      isValid = accountHolderNameRegex.test(value);
      message = "Invalid accountHoldersName";
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };
  const validateFormData = (formData) => {
    const validationErrors = {};
    if (!formData.accountName) {
      validationErrors.accountName = {
        isValid: false,
        message: "please enter a account Name",
      };
    }
    if (!formData.bankAccountNumber) {
      validationErrors.bankAccountNumber = {
        isValid: false,
        message: "please enter a account Name",
      };
    }
    if (!formData.reenterBankAccountNumber) {
      validationErrors.reenterBankAccountNumber = {
        isValid: false,
        message: "please enter a account Name",
      };
    }
    if (!formData.IFSCCode) {
      validationErrors.IFSCCode = {
        isValid: false,
        message: "please enter a account Name",
      };
    }
    if (!formData.branchName) {
      validationErrors.branchName = {
        isValid: false,
        message: "please enter a branchName",
      };
    }
    if (!formData.accountHoldersName) {
      validationErrors.accountHoldersName = {
        isValid: false,
        message: "please enter a accountHoldersName",
      };
    }
    if (formData.bankAccountNumber === formData.reenterBankAccountNumber) {
      console.log("Passwords match");

      setPasswordMatch(true);
    } else {
      console.log("Passwords do not match");
      setPasswordMatch(false);
    }

    return validationErrors;
  };

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
    console.log("Form Data:", formData);
    try {
      const response = await axios.post(
        `${backendUrl}/api/BankDeatils/bank-details`,
        { ...formData, businessId: userData?.data?._id }
      );
      console.log("Response:", response.data);
      setAddCashBank1(false);
      fetchData();
      toast.success("Bank details submitted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // Reset the form data
      setFormData({
        accountName: "",
        openingBalance: "",
        date: new Date(),
        bankAccountNumber: "",
        reenterBankAccountNumber: "",
        IFSCCode: "",
        branchName: "",
        accountHoldersName: "",
        UPIID: "",
      });
    } catch (error) {
      console.error("Error:", error);
      // Show toast notification on submission failure
      toast.error("Error submitting bank details. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const [selectedBankDataById, setselectedBankDataById] = useState(null);
  const [selectedFormData, setSelectedFormData] = useState({});

  console.log("selectedFormData", selectedFormData);

  console.log("selectedBankDataById", selectedBankDataById);

  useEffect(() => {
    if (selecttedbankid) {
      const fetchselectedbankData = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/BankDeatils/bankdetails/${selecttedbankid}`
          );
          console.log("dfgdgdg:", response.data);
          const data = response.data;
          console.log("mappeddata", data);
          setSelectedFormData({
            accountName: data.accountName,
            openingBalance: data.openingBalance,
            date: data.date,
            bankAccountNumber: data.bankAccountNumber,
            reenterBankAccountNumber: data.reenterBankAccountNumber,
            IFSCCode: data.IFSCCode,
            branchName: data.branchName,
            accountHoldersName: data.accountHoldersName,
            UPIID: data.UPIID,
          });
          // setBankId(data?.bankId);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchselectedbankData();
    }
  }, [selecttedbankid, userData]);

  const [transactions, setTransactions] = useState([]);
  console.log("abc", transactions);

  useEffect(() => {
    if (selecttedbankid) {
      const fetchSelectedBankTransactions = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/BankDeatils/transactions/${selecttedbankid}`
          );
          console.log("Transactions:", response.data);
          setTransactions(response.data);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchSelectedBankTransactions();
    }
  }, [selecttedbankid, userData]);

  const [cusTransactions, setCusTransactions] = useState([]);

  console.log("cusTransactions", cusTransactions);

  useEffect(() => {
    if (selecttedbankid) {
      const fetchSelectedBankTransactions = async () => {
        try {
          if (userData?.data?._id) {
            const response = await axios.get(
              `${backendUrl}/api/BankDeatils/custransactions/${selecttedbankid}`
            );
            console.log("cusTransactions:", response.data);
            setCusTransactions(response.data);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchSelectedBankTransactions();
    }
  }, [selecttedbankid, userData]);

  console.log("cusTransactions", cusTransactions);

  const fetchData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `${backendUrl}/api/BankDeatils/bank-details/${userData?.data?._id}`
        );
        console.log("Data:", response.data);
        setBankData(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);
  console.log("detdgdgdshails", bankData);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${backendUrl}/api/BankDeatils/bankdetailsedit/${selecttedbankid}`,
        selectedFormData
      );

      if (response.status === 200) {
        toast.success("Updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        fetchData();
        window.location.reload();
      } else {
        toast.error("Failed to update Account. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while updating the Account Details.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // window.location.reload();
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/BankDeatils/deleteBank/${selecttedbankid}`
      );
      if (response.status === 200) {
        fetchData();
        window.location.reload();
        console.log("Data Submitted Succesfully");
      } else {
        toast.error("Failed to delete bank details. Please try again.");
        console.error("Failed to delete bank details");
      }
    } catch (error) {
      toast.error(
        "An error occurred while deleting bank details. Please try again."
      );
      console.error("Error deleting bank details:", error);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setSelectedFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const [customers, setCustomers] = useState([]);
  console.log("customers", customers);

  const fetchcustomerData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `${backendUrl}/api/addCustomer/customers/${userData?.data?._id}`
        );
        setCustomers(response.data);
      }
    } catch (error) {
      console.log("customersdata", customers);
      console.error("Error fetching customers:", error);
    }
  };
  useEffect(() => {
    fetchcustomerData();
  }, [userData]);

  const [paymentDetails, setPaymentDetails] = useState([]);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (userData?.data?._id) {
          const response = await axios.get(
            `http://localhost:8000/api/paymentDetails/payment/${userData?.data?._id}`
          );
          setPaymentDetails(response.data.filter((item) => !item.isDeleted));
        }
      } catch (error) {
        console.error("Error fetching Payment details:", error);
      }
    };

    fetchPaymentDetails();
  }, [userData]);

  console.log("paymentDetails", paymentDetails);

  const cashDetails = paymentDetails.filter(
    (payment) => payment.paymentType === "Cash"
  );

  console.log("cashDetails", cashDetails);

  let totalAmount = 0;
  paymentDetails.forEach((payment) => {
    totalAmount += payment.amount;
  });

  // let custtotalAmount = 0;
  // cusTransactions.forEach((payment) => {
  //   custtotalAmount += payment.paymentAmount;
  // });

  // console.log("custtotalAmount", custtotalAmount);

  const bankAmount = bankData?.reduce(
    (total, item) => total + item.openingBalance,
    0
  );
  const allAmount = parseFloat(totalAmount) + bankAmount;

  console.log("bankAmount", bankAmount);

  // Account details columns
  const AccountDetailsColumns = [
    {
      title: "Transaction No",
      dataIndex: "UPIID",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        const formattedDate = new Date(record.date).toLocaleDateString(
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
      title: "Name",
      dataIndex: "accountHoldersName",
    },
    {
      title: "Amount",
      dataIndex: "openingBalance",
    },
  ];

  //customer columns
  const cusTransactionColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name, record) => {
        const customerName = customers.find(
          (cus) => cus.customerId === record.customerid
        );
        return (
          <div
            className="d-flex gap-2 align-items-center"
            style={{ width: "220px" }}
          >
            <img
              className="userbadge"
              src="./newdashboard/userbadge.png"
              alt=""
            />
            {customerName?.name ? customerName?.name : "Unknown"}
          </div>
        );
      },
    },

    {
      title: "Date",
      dataIndex: "invoiceDate",
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
      title: "Type",
      dataIndex: "invoiceName",
    },
    {
      title: "Amount",
      dataIndex: "paymentAmount",
    },
    // {
    //   title: "Transaction No",
    //   dataIndex: "invoiceNumber",
    //   sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
    // },
    {
      title: "Invoice",
      dataIndex: "invoiceNumber",
    },
  ];

  //vendorcolumns
  const customersColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name, record) => {
        const vendorName = dataSource.find(
          (ven) => ven.vendorId === record.vendorid
        );
        return (
          <div
            className="d-flex gap-2 align-items-center"
            style={{ width: "220px" }}
          >
            <img
              className="userbadge"
              src="./newdashboard/userbadge.png"
              alt=""
            />
            {vendorName ? vendorName.name : "Unknown"}
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "purchasesDate",
      render: (text, record) => {
        const formattedDate = new Date(record.purchasesDate).toLocaleDateString(
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
      title: "Type",
      dataIndex: "purchaseName",
    },
    {
      title: "Amount",
      dataIndex: "paymentAmount",
    },
    {
      title: "Invoice",
      dataIndex: "purchaseNumber",
    },
  ];
  const [cashInHand, setCashInHand] = useState();
  const handleCashInHandClick = () => {
    setCashInHand(true);
    setIsActive("cashInHand");
    setSelectedBankData(null);
  };

  const name = paymentDetails?.customername?.name;
  console.log("name0", name);

  const columnsss = [
    {
      title: "Name",
      dataIndex: "customerName",
      render: (text, record) => (
        <div>
          {console.log("record", record)}
          {record?.customername?.name || " "}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "Transaction Number",
      dataIndex: "paymentNumber",
      key: "paymentNumber",
    },
    {
      title: "Name",
      dataIndex: "voucherName",
      key: "voucherName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-4">
                        <div
                          className="nav flex-column nav-pills nav-pills-tab"
                          id="v-pills-tab"
                          role="tablist"
                          aria-orientation="vertical"
                        >
                          <div
                            className="cash-banks-card-title"
                            // onClick={handleCashInHandClick}
                          >
                            <h6 className="bank-list-data">
                              Total Amount <span>{allAmount}</span>
                            </h6>
                          </div>
                          <hr />
                          <div className="cash-banks-card-title">
                            <h4>Cash</h4>
                          </div>

                          <div
                            className={`cash-banks-card-title`}
                            onClick={handleCashInHandClick}
                          >
                            <h6
                              className={`bank-list-data ${
                                isActive === true ? "active" : ""
                              }`}
                            >
                              Cash <span>{totalAmount}</span>
                            </h6>
                          </div>

                          <hr />
                          <div className="cash-banks-card-title">
                            <h4>Bank Accounts</h4>
                          </div>
                          {bankData &&
                            bankData.length > 0 &&
                            bankData.map((account, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleAccountClick(account, index)
                                }
                                className={`bank-list-data ${
                                  isActive === index ? "active" : ""
                                }`}
                              >
                                {account?.branchName}{" "}
                                <span>{account?.openingBalance}</span>
                              </li>
                            ))}

                          <div>
                            <Link to="#" onClick={() => setAddCashBank1(true)}>
                              <div className="cash-banks-add-account-button">
                                +Add Account
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>{" "}
                     
                      <div className="col-md-12"></div>
                    </div>{" "}
                  
                  </div>
                </div>{" "}
                
              </div>{" "}
            </div> */}
            <div className="row">
              <div className="col-md-4">
                <div className="CashandBankLeft">
                  <CashandBankSwiper
                    bankData={bankData}
                    handleAccountClick={handleAccountClick}
                  />

                  {/* <div className="Recentactivities-cash-bank">
                    <div className="Recentactivities-cash-bank-sub1 d-flex justify-content-between align-items-center">
                      <h5>Recent activities</h5>
                      <img src="./newdashboard/more-horizontal.png" alt="" />
                    </div>
                    <div className="Recentactivities-cash-bank-sub2">
                      <div className="Recentactivities-sub">
                        <div className="symbol-parent">
                          <img src="./newdashboard/dollar-sign.png" alt="" />
                        </div>
                        <div className="Recentactivities-content">
                          <h5>Purchase Made</h5>
                          <p>06.01.2024</p>
                        </div>
                      </div>
                      <p className="cash-bank-price">-$700.00</p>
                    </div>
                    <div className="Recentactivities-cash-bank-sub2">
                      <div className="Recentactivities-sub">
                        <div className="symbol-parent">
                          <img src="./newdashboard/arrow-up-right.png" alt="" />
                        </div>
                        <div className="Recentactivities-content">
                          <h5>Invoice Cleared</h5>
                          <p>06.01.2024</p>
                        </div>
                      </div>
                      <p className="cash-bank-price">+$50.00</p>
                    </div>
                    <div className="Recentactivities-cash-bank-sub2">
                      <div className="Recentactivities-sub">
                        <div className="symbol-parent">
                          <img src="./newdashboard/arrow-down.png" alt="" />
                        </div>
                        <div className="Recentactivities-content">
                          <h5>Expense generated</h5>
                          <p>04.01.2024</p>
                        </div>
                      </div>
                      <p className="cash-bank-price">-$100.00</p>
                    </div>
                    <div className="Recentactivities-cash-bank-sub2">
                      <div className="Recentactivities-sub">
                        <div className="symbol-parent">
                          <img src="./newdashboard/arrow-down.png" alt="" />
                        </div>
                        <div className="Recentactivities-content">
                          <h5>Expense generated</h5>
                          <p>04.01.2024</p>
                        </div>
                      </div>
                      <p className="cash-bank-price">-$10.00</p>
                    </div>
                    <div className="Recentactivities-cash-bank-sub2">
                      <div className="Recentactivities-sub">
                        <div className="symbol-parent">
                          <img src="./newdashboard/arrow-down.png" alt="" />
                        </div>
                        <div className="Recentactivities-content">
                          <h5>Invoice Cleared</h5>
                          <p>04.01.2024</p>
                        </div>
                      </div>
                      <p className="cash-bank-price">+$100.00</p>
                    </div>
                  </div> */}

                  <div className="Recentactivities-cash-bank">
                    <div className="Recentactivities-cash-bank-sub1 d-flex justify-content-between align-items-center">
                      <h5>Recent activities</h5>
                      <img
                        src="./newdashboard/more-horizontal.png"
                        alt="More options"
                      />
                    </div>
                    {paymentDetails.map((payment) => (
                      <div
                        className="Recentactivities-cash-bank-sub2"
                        key={payment._id}
                      >
                        <div className="Recentactivities-sub">
                          <div className="symbol-parent">
                            <div className="symbol-parent">
                              <img
                                src="./newdashboard/arrow-up-right.png"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="Recentactivities-content">
                            <h5>{payment.voucherName}</h5>
                            <p>{payment.paymentDate}</p>
                          </div>
                        </div>
                        <p className="cash-bank-price">
                          {payment.amount < 0
                            ? `-₹${Math.abs(payment.amount).toFixed(2)}`
                            : `+₹${payment.amount.toFixed(2)}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="CashandBankRight">
                  <div className="CashandBankRight-cards-parent">
                    <Link to="#" onClick={() => setAddCashBank1(true)}>
                      <h5>+ Add New Bank</h5>
                    </Link>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="CashandBankRight-cards">
                          <div className="CashandBankRight-cards-image">
                            <img src="./newdashboard/cashbank1.png" alt="" />
                          </div>
                          <div className="CashandBankRight-cards-content">
                            <div className="CashandBankRight-cards-content-sub-text">
                              <h4>INR</h4>
                              <h4>{allAmount}</h4>
                            </div>
                            <p>Bank + Cash</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="CashandBankRight-cards">
                          <div className="CashandBankRight-cards-image">
                            <img src="./newdashboard/cashbank2.png" alt="" />
                          </div>
                          <div className="CashandBankRight-cards-content">
                            <div className="CashandBankRight-cards-content-sub-text">
                              <h4>INR</h4>
                              <h4>{`${allAmount - totalAmount}`}</h4>
                            </div>
                            <p>Bank</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div
                          className="CashandBankRight-cards"
                          onClick={handleCashInHandClick}
                        >
                          <div className="CashandBankRight-cards-image">
                            <img src="./newdashboard/cashbank3.png" alt="" />
                          </div>
                          <div className="CashandBankRight-cards-content">
                            <div className="CashandBankRight-cards-content-sub-text">
                              <h4>INR</h4>
                              <h4>{totalAmount}</h4>
                            </div>
                            <p>Cash</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transactions data starts here */}
                  <div className="Transactions-content-parent">
                    <div className="Transactions-content-sub">
                      <button className="transcation-button-color">
                        Transactions
                      </button>
                      <div className="Transactions-calender">
                        <img src="./newdashboard/calendericon.png" alt="" />
                        <select name="" id="">
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                        </select>
                      </div>
                    </div>
                    {isActive === "cashInHand" && cashInHand && (
                      <div>
                        <Table dataSource={cashDetails} columns={columnsss} />
                      </div>
                    )}
                    {isActive === "bankAccount" && selectedBankData && (
                      <div className="cash-bank-edit-details">
                        <ul className="nav nav-tabs">
                          <li className="nav-item">
                            <button
                              className={`nav-link ${
                                selectedTab === "profile" ? "active" : ""
                              }`}
                              onClick={() => setSelectedTab("profile")}
                            >
                              Account Info
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              className={`nav-link ${
                                selectedTab === "customer" ? "active" : ""
                              }`}
                              onClick={() => setSelectedTab("customer")}
                            >
                              Bank Transactions
                            </button>
                          </li>
                          {/* <li className="nav-item">
                            <button
                              className={`nav-link ${
                                selectedTab === "vendor" ? "active" : ""
                              }`}
                              onClick={() => setSelectedTab("vendor")}
                            >
                              Cash
                            </button>
                          </li> */}
                        </ul>
                      </div>
                    )}
                    <div>
                      <div className="tab-content">
                        <div
                          className={`tab-pane fade ${
                            selectedTab === "profile" ? "show active" : ""
                          }`}
                        >
                          {selectedBankData && (
                            <div className="selected-ban-details">
                              <h2>Account Details</h2>
                              <p>
                                <strong>Account Name:</strong>{" "}
                                {selectedBankData.accountName}
                              </p>
                              <p>
                                <strong> Opening Balance: </strong>
                                {selectedBankData.openingBalance}
                              </p>
                              <p>
                                <strong>Date:</strong> {selectedBankData.date}
                              </p>
                              <p>
                                <strong>Bank Account Number: </strong>
                                {selectedBankData.bankAccountNumber}
                              </p>
                              <p>
                                <strong>IFSC Code:</strong>{" "}
                                {selectedBankData.IFSCCode}
                              </p>
                              <p>
                                <strong>Branch Name:</strong>{" "}
                                {selectedBankData.branchName}
                              </p>
                              <p>
                                <strong> Account Holder's Name: </strong>
                                {selectedBankData.accountHoldersName}
                              </p>
                              <p>
                                <strong>UPI ID:</strong>{" "}
                                {selectedBankData.UPIID}
                              </p>

                              <div className="cash-bank-edit-details ">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_modal"
                                >
                                  Delete Bank Details
                                </button>
                                <Link
                                  className="edit-button btn btn-success"
                                  to="#"
                                  onClick={() => setEditCashBank1(true)}
                                >
                                  Edit Details
                                </Link>
                                {/* Tab content */}
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className={`tab-pane fade ${
                            selectedTab === "customer" ? "show active" : ""
                          }`}
                        >
                          {/* <Table dataSource={cusTransactions} columns={cusTransactionColumns} /> */}
                        </div>
                        <div
                          className={`tab-pane fade ${
                            selectedTab === "vendor" ? "show active" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                    {/* Confirmation Modal */}
                    <div
                      className={`modal custom-modal fade ${
                        deleteModalVisible ? "show" : ""
                      }`}
                      id="delete_modal"
                      role="dialog"
                    >
                      <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">
                          <div className="modal-body">
                            <div className="form-header">
                              <h3>Delete Bank Details</h3>
                              <p>Are you sure you want to delete?</p>
                            </div>
                            <div className="modal-btn delete-action">
                              <div className="row">
                                <div className="col-6">
                                  <button
                                    type="reset"
                                    data-bs-dismiss="modal"
                                    className="w-100 btn btn-primary paid-continue-btn"
                                    onClick={handleDelete}
                                  >
                                    Delete
                                  </button>
                                </div>
                                <div className="col-6">
                                  <button
                                    type="submit"
                                    data-bs-dismiss="modal"
                                    className="w-100 btn btn-primary paid-cancel-btn"
                                    onClick={() => setDeleteModalVisible(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-content">
                      <div
                        className={`tab-pane fade ${
                          selectedTab === "customer" ? "show active" : ""
                        }`}
                      >
                        <Table
                          dataSource={cusTransactions}
                          columns={cusTransactionColumns}
                        />
                      </div>
                      <div
                        className={`tab-pane fade ${
                          selectedTab === "vendor" ? "show active" : ""
                        }`}
                      >
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="card-table">
                              <div className="card-body vendors">
                                <div className="table-responsive table-hover table-striped">
                                  <Table
                                    dataSource={transactions}
                                    columns={customersColumns}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="Transactions-searchabar-belowtable">
                    <div className="Dashboard3one-parent-sub">
                      <div className="Dashboard3one-parent-sub2-main w-100">
                        <div className="Dashboard3one-parent-sub2 d-flex justify-content-between w-100">
                          <div className="serchbar-inputfield">
                            <FaMagnifyingGlass />
                            <input
                              style={{ width: "400px" }}
                              type="text"
                              placeholder="Type here ..."
                            />
                          </div>
                          <div className="serchbar-inputfield-buttons d-flex gap-2">
                            <button className="btn btn-primary">Support</button>
                            <button className="btn btn-primary">
                              Contact us
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              className="add-bank-account-header-line add-godown-styles"
              title="Add Bank Account"
              onCancel={() => setAddCashBank1(false)}
              open={addCashBank1}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setAddCashBank1(false)}
                  className="btn btn-secondary waves-effect me-2"
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  className="btn btn-info waves-effect waves-light primary-button"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>,
              ]}
            >
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>
                      Account Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        !validation.accountName.isValid ? "is-invalid" : ""
                      }`}
                      placeholder="Enter bank account Name"
                      name="accountName"
                      value={formData.accountName}
                      onChange={(e) =>
                        handleInputChange("accountName", e.target.value)
                      }
                    />
                    {!validation.accountName.isValid && (
                      <div className="error-message text-danger">
                        {validation.accountName.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="row">
                    <div className="form-group col-lg-6 col-md-6">
                      <label>
                        Opening Balance
                        {/* <span className="text-danger">*</span> */}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="ex: ₹10,000"
                        name="openingBalance"
                        value={formData.openingBalance}
                        onChange={(e) =>
                          handleInputChange("openingBalance", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>
                          As of date
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <div className="cal-icon cal-icon-info">
                          <DatePicker
                            className="datetimepicker form-control"
                            selected={formData.date}
                            onChange={(date) => handleDateChange("date", date)}
                            dateFormat="dd-MM-yyyy"
                            showTimeInput={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="d-flex justify-content-between">
                    <div>
                      <label className="">Add Bank Details</label>
                    </div>
                    <div>
                      <label className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={showContent}
                          onChange={handleToggle}
                        />
                        <span className="form-check-label"></span>
                      </label>
                    </div>
                  </div>
                  <Card
                    style={{ marginTop: "20px", border: "none" }}
                    className="adding-bank-details-toggle"
                  >
                    {showContent && (
                      <div>
                        <div className="col-lg-12 col-md-12">
                          <div className="row">
                            <div className="form-group col-lg-6 col-md-6">
                              <label>
                                Bank Account Number
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  !validation.bankAccountNumber.isValid
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="ex: 12345679"
                                name="bankAccountNumber"
                                value={formData.bankAccountNumber}
                                onChange={(e) =>
                                  handleInputChange(
                                    "bankAccountNumber",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.bankAccountNumber.isValid && (
                                <div className="error-message text-danger">
                                  {validation.bankAccountNumber.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>
                                  Re-Enter Bank Account Number
                                  <span className="text-danger">*</span>
                                </label>
                                <div className=" ">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      !validation.reenterBankAccountNumber
                                        .isValid
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="ex: 123456790"
                                    name="reenterBankAccountNumber"
                                    value={formData.reenterBankAccountNumber}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "reenterBankAccountNumber",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {!validation.reenterBankAccountNumber
                                    .isValid && (
                                    <div className="error-message text-danger">
                                      {
                                        validation.reenterBankAccountNumber
                                          .message
                                      }
                                    </div>
                                  )}
                                  {!passwordMatch && (
                                    <p className="text-danger">
                                      account number do not match
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="row">
                            <div className="form-group col-lg-6 col-md-6">
                              <label>
                                IFSC Code
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  !validation.IFSCCode.isValid
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="ex: 123456790"
                                name="IFSCCode"
                                value={formData.IFSCCode}
                                onChange={(e) =>
                                  handleInputChange("IFSCCode", e.target.value)
                                }
                              />
                              {!validation.IFSCCode.isValid && (
                                <div className="error-message text-danger">
                                  {validation.IFSCCode.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>
                                  Bank & Branch Name
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      !validation.branchName.isValid
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="ex: 123456790"
                                    name="branchName"
                                    value={formData.branchName}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "branchName",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {!validation.branchName.isValid && (
                                    <div className="error-message text-danger">
                                      {validation.branchName.message}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="row">
                            <div className="form-group col-lg-6 col-md-6">
                              <label>
                                Account Holders Name
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  !validation.accountHoldersName.isValid
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="ex: 123456790"
                                name="accountHoldersName"
                                value={formData.accountHoldersName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "accountHoldersName",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.accountHoldersName.isValid && (
                                <div className="error-message text-danger">
                                  {validation.accountHoldersName.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>UPI ID</label>
                                <div className="">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ex: 123456790"
                                    name="UPIID"
                                    value={formData.UPIID}
                                    onChange={(e) =>
                                      handleInputChange("UPIID", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </Modal>
            <Modal
              className="add-bank-account-header-line add-godown-styles"
              title="Edit Bank Account"
              onCancel={() => setEditCashBank1(false)}
              open={editCashBank1}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setEditCashBank1(false)}
                  className="btn btn-secondary waves-effect me-2"
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_update_modal"
                  className="btn btn-info waves-effect waves-light primary-button"
                  onClick={editUpdateCashBank}
                >
                  Update
                </Button>,
              ]}
            >
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>
                      Account Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        !validation.accountName.isValid ? "is-invalid" : ""
                      }`}
                      placeholder="Enter bank account Name"
                      name="accountName"
                      value={selectedFormData?.accountName || ""}
                      onChange={(e) =>
                        handleFieldChange("accountName", e.target.value)
                      }
                    />
                    {!validation.accountName.isValid && (
                      <div className="error-message text-danger">
                        {validation.accountName.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="row">
                    <div className="form-group col-lg-6 col-md-6">
                      <label>Opening Balance</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="ex: ₹10,000"
                        name="openingBalance"
                        value={selectedFormData?.openingBalance}
                        onChange={(e) =>
                          handleFieldChange("openingBalance", e.target.value)
                        }
                      />
                    </div>
                    {/* <div className="form-group col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>As of date</label>
                              <div className="cal-icon cal-icon-info">
                                <DatePicker
                                  className="datetimepicker form-control"
                                  selected={selectedFormData?.date}
                                  onChange={handleUpdateDateChange}
                                  dateFormat="dd-MM-yyyy"
                                  showTimeInput={false}
                                />
                              </div>
                            </div>
                          </div> */}
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="d-flex justify-content-between">
                    <div>
                      <label className="">Add Bank Details</label>
                    </div>
                    <div>
                      <label className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={showContent}
                          onChange={handleToggle}
                        />
                        <span className="form-check-label"></span>
                      </label>
                    </div>
                  </div>
                  <Card
                    style={{ marginTop: "20px", border: "none" }}
                    className="adding-bank-details-toggle"
                  >
                    {showContent && (
                      <div>
                        <div className="col-lg-12 col-md-12">
                          <div className="row">
                            <div className="form-group col-lg-6 col-md-6">
                              <label>
                                Bank Account Number
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  !validation.bankAccountNumber.isValid
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="ex: 12345679"
                                name="bankAccountNumber"
                                value={selectedFormData?.bankAccountNumber}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "bankAccountNumber",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.bankAccountNumber.isValid && (
                                <div className="error-message text-danger">
                                  {validation.bankAccountNumber.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>
                                  Re-Enter Bank Account Number
                                  <span className="text-danger">*</span>
                                </label>
                                <div className=" ">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      !validation.reenterBankAccountNumber
                                        .isValid
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="ex: 123456790"
                                    name="reenterBankAccountNumber"
                                    value={
                                      selectedFormData?.reenterBankAccountNumber
                                    }
                                    onChange={(e) =>
                                      handleFieldChange(
                                        "reenterBankAccountNumber",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {!validation.reenterBankAccountNumber
                                    .isValid && (
                                    <div className="error-message text-danger">
                                      {
                                        validation.reenterBankAccountNumber
                                          .message
                                      }
                                    </div>
                                  )}
                                  {!passwordMatch && (
                                    <p className="text-danger">
                                      account number do not match
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="row">
                            <div className="form-group col-lg-6 col-md-6">
                              <label>
                                IFSC Code
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  !validation.IFSCCode.isValid
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="ex: 123456790"
                                name="IFSCCode"
                                value={selectedFormData?.IFSCCode}
                                onChange={(e) =>
                                  handleFieldChange("IFSCCode", e.target.value)
                                }
                              />
                              {!validation.IFSCCode.isValid && (
                                <div className="error-message text-danger">
                                  {validation.IFSCCode.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>
                                  Bank & Branch Name
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      !validation.branchName.isValid
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="ex: 123456790"
                                    name="branchName"
                                    value={selectedFormData?.branchName}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        "branchName",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {!validation.branchName.isValid && (
                                    <div className="error-message text-danger">
                                      {validation.branchName.message}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="row">
                            <div className="form-group col-lg-6 col-md-6">
                              <label>
                                Account Holders Name
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  !validation.accountHoldersName.isValid
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="ex: 123456790"
                                name="accountHoldersName"
                                value={selectedFormData?.accountHoldersName}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "accountHoldersName",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.accountHoldersName.isValid && (
                                <div className="error-message text-danger">
                                  {validation.accountHoldersName.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>UPI ID</label>
                                <div className="">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ex: 123456790"
                                    name="UPIID"
                                    value={selectedFormData?.UPIID}
                                    onChange={(e) =>
                                      handleFieldChange("UPIID", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </Modal>
            <div
              className="modal custom-modal fade"
              id="edit_update_modal"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-header">
                      <h3>Update Bank Account</h3>
                      <p>Are you sure want to Update?</p>
                    </div>
                    <div className="modal-btn delete-action">
                      <div className="row">
                        <div className="col-6">
                          <button
                            type="reset"
                            data-bs-dismiss="modal"
                            className="w-100 btn btn-primary paid-continue-btn"
                            onClick={() => handleUpdate(editCashBankid)}
                          >
                            Update
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            // type="submit"
                            data-bs-dismiss="modal"
                            className="w-100 btn btn-primary paid-cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal custom-modal fade"
              id="add_gst1"
              role="dialog"
            ></div>
            <div></div>
            <div
              className="modal custom-modal fade"
              id="add_gst2"
              role="dialog"
            ></div>
          </div>
          {showTable && (
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body">
                    <div className="table-responsive table-hover table-striped">
                      <Table
                        dataSource={paymentDetails}
                        columns={handcashColumns}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default CashBank;
