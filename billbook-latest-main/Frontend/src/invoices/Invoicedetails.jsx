import React, { useState, useEffect, useRef } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown, Button, Modal } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope, FaShare } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import BackButton from "./Cards/BackButton";
import SendEmail from "./Modals/SendEmail";
import { Tooltip } from "antd";
import Middleware from "../_components/Middleware";
import { useSelector } from "react-redux";
import sharedRef from "./SharedRef";
import { RiDownloadCloud2Line } from "react-icons/ri";

const Invoicedetails = () => {
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  console.log("invoiceDetailssff", invoiceDetails);
  const [balance, setBalance] = useState(0);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  console.log("location", location);

  const userData = useSelector((state) => state?.user?.userData);

  console.log("userData", userData?.data?.template);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [validationPay, setValidationPay] = useState({
    isValid: true,
    message: "",
  });
  const [notes, setNotes] = useState("");

  const [amount, setAmount] = useState(balance);
  const [selecetdbank, setSelectedbank] = useState("");

  const [LastPaymentBalance, setLastPaymentBalance] = useState(0);

  const accountName = invoiceDetails?.bankDetails?.selectBank?.accountName;
  const accountNumber =
    invoiceDetails?.bankDetails?.selectBank?.bankAccountNumber;
  const branchName = invoiceDetails?.bankDetails?.selectBank[0]?.branchName;
  const IFSCCode = invoiceDetails?.bankDetails?.selectBank[0]?.IFSCCode;
  console.log("accountName", accountName);

  const invoiceContentRef = useRef(null);
  const handleDownloadPDF = () => {
    const content = invoiceContentRef.current;
    console.log("content", content);

    if (content) {
      const pdfOptions = {
        filename: `invoice_${id}.pdf`,
        image: [
          { type: "PNG", quality: 0.98 },
          { type: "png", quality: 0.98 },
          { type: "jpeg", quality: 0.98 },
          { type: "jpg", quality: 0.97 },
        ],
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a3",
          orientation: "portrait",
          putOnlyUsedFonts: true,
        },
      };

      html2pdf().from(content).set(pdfOptions).save();
    }
  };
  const handleWhatsAppShare = () => {
    const phoneNumber = "7993852051";
    const invoiceDownloadLink = `http://localhost:8000/invoices/invoice_${id}.pdf`;
    const message = `Hello, check out this invoice: ${invoiceDownloadLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl);
  };

  const email = invoiceDetails?.customerName?.email;
  const customerID = invoiceDetails?.customerName?.customerId;
  const customerName = invoiceDetails?.customerName;

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/addInvoice/invoicesforview/${id}`
        );
        setInvoiceDetails(response.data);

        if (response.data.payments) {
          setBalance(response.data.payments.length);
        }

        const lastPaymentBalance =
          response.data.payments && response.data.payments.length > 0
            ? response.data.payments[response.data.payments.length - 1].balance
            : response.data.grandTotal;

        setLastPaymentBalance(lastPaymentBalance);
        setPaymentAmount(response.data.grandTotal);
        setAmount(response.data.balance);
        console.log("Fetched Invoice Details:", response.data);
        setIsSaveDisabled(response.data.balance === 0);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  const [customerEmail, setCustomerEmail] = useState(email);
  const invoiceData = invoiceDetails;

  useEffect(() => {
    setIsSaveDisabled(parseFloat(balance) === 0);
  }, [balance]);

  const openPaymentInModal = () => {
    $("#paymentInModal").modal("show");
  };

  const handlePaymentInLinkClick = (e) => {
    e.preventDefault();
    openPaymentInModal();
  };

  const invoiceid = invoiceDetails.invoiceId;

  const [datasource, setDatasource] = useState([]);
  const [paymentNumber, setPaymentNumber] = useState(1);

  useEffect(() => {
    if (userData?.data?._id) {
      axios
        .get(
          `http://localhost:8000/api/paymentDetails/payment/${userData?.data?._id}`
        )
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

  useEffect(() => {
    setPaymentNumber(getNextPaymentNumber());
  }, [datasource]);

  const handleSavePayment = async () => {
    const paymentData = {
      invoiceId: id,
      customerid: customerID,
      customername: customerName,
      paymentNumber: paymentNumber,
      voucherName: "Sales Invoice",
      bankId: selecetdbank,
      paymentAmount: paymentAmount,
      // enteredamount: amount,
      paymentDate: paymentDate,
      paymentType: paymentMethod,
      notes: notes,
      paymentStatus: "Paid",
      amount: amount,
    };
    console.log("paymentData", paymentData);

    try {
      const initialResponse = await fetch(
        "http://localhost:8000/api/paymentDetails/payment",
        {
          paymentData, businessId: userData?.data?._id,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );
      toast.success("Payment Added Succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      history.push("/invoice-list");
      if (initialResponse.ok) {
        console.log("Payment successfully saved:", paymentData);
      } else {
        console.error("Failed to save payment:", initialResponse.statusText);
      }
      const paymentStatus = balance === 0 ? "Paid" : "Partially Paid";
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  useEffect(() => {
    setIsSaveDisabled(false);
  }, [amount]);

  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);

    const newBalance =
      parseFloat(LastPaymentBalance) - parseFloat(enteredAmount);

    setBalance(isNaN(newBalance) ? 0 : newBalance.toFixed(2));
  };

  const [invoiceDownloadLink, setInvoiceDownloadLink] = useState("");

  const [signatureImageData, setSignatureImageData] = useState(null);

  useEffect(() => {
    const fetchImageData = async () => {
      const imageData = await fetchSignatureImage();
      setSignatureImageData(imageData);
    };

    fetchImageData();
  }, []);

  const fetchSignatureImage = async () => {
    try {
      const response = await fetch(
        invoiceDetails?.bankDetails?.signatureImage?.url
      );
      const imageData = await response.blob();
      console.log("signature", response);
      return imageData;
    } catch (error) {
      console.error("Error fetching signature image:", error);
    }
  };

  const [bankData, setBankData] = useState([]);

  const fetchbankData = async () => {
    try {
      if (userData?.data?._id) {
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

  const handleBankDetailsChange = (event) => {
    const value = event.target.value;
    setSelectedbank(value);
  };

  const handlePrint = () => {
    window.print(); // This triggers the browser's print dialog
  };

  const modalRef = useRef(null);

  useEffect(() => {
    console.log("sharedRef.current", sharedRef.current);
    if (sharedRef?.current?.message === "Download PDF") {
      setTimeout(() => {
        handleDownloadPDF();
      }, 100);
    }
  }, []);

  useEffect(() => {
    const triggerModal = () => {
      const modalElement = modalRef.current;
      console.log("modalElement", modalElement);
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      } else {
        console.error("Modal element not found");
      }
    };

    console.log("sharedRef.current", sharedRef.current);
    if (sharedRef?.current?.message === "Share PDF") {
      triggerModal();
    }
  }, []);

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}

            <div className="page-header">
              <div className="content-invoice-header flex flex-wrap">
                <div className="flex flex-wrap items-center">
                  <BackButton />
                  <h5>Invoice Details</h5>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    {invoiceDetails.balance > 0 ? (
                      <span>
                        <Link
                          to="#"
                          className="btn btn-payment-in"
                          onClick={handlePaymentInLinkClick}
                        >
                          Payment In
                        </Link>
                      </span>
                    ) : (
                      <Tooltip
                        title="This Invoice cannot be Edited"
                        placement="top"
                      >
                        <span>
                          <Link
                            to="#"
                            className="btn btn-payment-in"
                            onClick={handlePaymentInLinkClick}
                            disabled={invoiceDetails.balance === 0}
                          >
                            Payment In
                          </Link>
                        </span>
                      </Tooltip>
                    )}

                    {/* <li>
                      <Tooltip placement="topLeft" title={"Print"}>
                        <button
                          onClick={handlePrint}
                          className="print-link btn btn-primary"
                        >
                          <FeatherIcon icon="printer" />
                        </button>
                      </Tooltip>
                    </li> */}
                    <li className="mx-2">
                        <button
                          // to="#"
                          type="button"
                          className="download-link btn btn-primary 300:py-[4px] 300:px-[10px] 700:py-[7px] 700:px-[15px]"
                          download=""
                          onClick={handleDownloadPDF}
                        >
                          <RiDownloadCloud2Line
                            className="me-1"
                            style={{ fontSize: "18px" }}
                          />                      
                              <p>Download</p>
                        </button>
                    </li>

                    <li>
                      <Dropdown>
                        <Tooltip placement="topLeft" title={"Share"}>
                          <Dropdown.Toggle
                            variant="primary"
                            id="shareDropdown"
                            className="300:py-[6px] 300:px-[10px] 700:py-[10px] 700:px-[15px]"
                          >
                            <p className="mr-1">Share</p>
                            <FaShare className="me-2" />
                          </Dropdown.Toggle>
                        </Tooltip>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={handleWhatsAppShare}>
                            <FaWhatsapp /> WhatsApp
                          </Dropdown.Item>
                          <Link
                            id="ModalPopUpforEmail"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#email_details"
                          >
                            <Dropdown.Item>
                              <FaEnvelope />
                              Email
                            </Dropdown.Item>
                          </Link>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="paymentInModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="paymentInModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="paymentInModalLabel">
                      Record Payment for this Invoice
                    </h5>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="paymentAmount" className="form-label">
                        Payment Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="paymentAmount"
                        placeholder="Enter payment amount"
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        value={paymentAmount}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">
                        Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="amount"
                        placeholder="Enter amount"
                        onChange={handleAmountChange}
                        value={amount}
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="paymentDate" className="form-label">
                        Payment Date
                      </label>

                      <div className="cal-icon cal-icon-info">
                        <DatePicker
                          // className=" form-control"
                          className="datetimepicker form-control "
                          selected={paymentDate}
                          onChange={(date) => setPaymentDate(date)}
                          dateFormat="dd-MM-yyyy"
                          showTimeInput={false}
                        ></DatePicker>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="paymentMethod" className="form-label">
                        Payment Method <span className="text-danger">*</span>
                      </label>
                      <select
                        id="paymentMethod"
                        className={`form-select`}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        value={paymentMethod}
                      >
                        <option value="">Select payment method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                    {paymentMethod === "Bank" && (
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Bank Details</label>
                          <Select2
                            className="w-100"
                            data={bankOptions}
                            value={selecetdbank}
                            options={{
                              placeholder: "Search bank",
                            }}
                            onChange={(value) => handleBankDetailsChange(value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        className="form-control"
                        rows="4"
                        placeholder="Enter notes"
                        onChange={(e) => setNotes(e.target.value)}
                        value={notes}
                      ></textarea>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className={`btn btn-primary ${isSaveDisabled ? "disabled" : ""
                        }`}
                      onClick={handleSavePayment}
                      disabled={isSaveDisabled}
                    >
                      Save Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {invoiceDetails?.invoiceDate && (
              <div
                className={`print-only-section ${menu ? "slide-nav" : ""}`}
                ref={invoiceContentRef}
              >
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <Middleware invoiceDetails={invoiceDetails} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {invoiceDetails?.invoiceDate && (
            <SendEmail
              endpoint={`/view-only-invoice/addInvoice/invoicesforview/${id}`}
              defaultMail={invoiceDetails?.customerName?.email}
              modalRef={modalRef}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Invoicedetails;
