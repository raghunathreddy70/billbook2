import React, { useState, useEffect, useRef } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import { DetailsLogo, signature } from "../_components/imagepath";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Select2 from "react-select2-wrapper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineDateRange } from "react-icons/md";
import { Dropdown, Button } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope, FaShare } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import SendEmail from "../invoices/Modals/SendEmail";
import BackButton from "../invoices/Cards/BackButton";
import { Tooltip } from "antd";
import Middleware from "../_components/Middleware";

const PurchaseReturnView = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const [purchaseReturnDetails, setPurchaseReturnDetails] = useState([]);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [LastPaymentBalance, setLastPaymentBalance] = useState(0);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const openDatePicker = () => {
    datepickerRef.setOpen(true);
  };
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const accountName =
    purchaseReturnDetails?.bankDetails?.selectBank[0]?.accountName;
  const accountNumber =
    purchaseReturnDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
  const branchName =
    purchaseReturnDetails?.bankDetails?.selectBank[0]?.branchName;
  const IFSCCode = purchaseReturnDetails?.bankDetails?.selectBank[0]?.IFSCCode;

  useEffect(() => {
    setBalance(purchaseReturnDetails.payments);
  });

  const handleWhatsAppShare = () => {
    const phoneNumber = "7993852051";
    const invoiceDownloadLink = `http://localhost:8000/invoices/invoice_${id}.pdf`; // Replace with the actual local URL to your invoice file
    const message = `Hello, check out this invoice: ${invoiceDownloadLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl);
  };

  const email = purchaseReturnDetails?.name?.email;
  const vendorID = purchaseReturnDetails?.name?.vendorId;


  useEffect(() => {
    const fetchPurchaseReturnDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/purchaseReturn/purchases-returnforview/${id}`
        );
        setPurchaseReturnDetails(response.data);
        if (response.data.payments) {
          setBalance(response.data.payments.length);
        }

        const lastPaymentBalance =
          response.data.payments.length > 0
            ? response.data.payments[response.data.payments.length - 1].balance
            : response.data.grandTotal;

        // Set the balance to a separate variable
        setLastPaymentBalance(lastPaymentBalance);
        setPaymentAmount(response.data.grandTotal);
        console.log("Fetched Purchase Details:", response.data);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      }
    };

    fetchPurchaseReturnDetails();
  }, [id]);

  const [customerEmail, setCustomerEmail] = useState(email);
  const purchaseData = purchaseReturnDetails;

 

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

  const [paymentoutData, setPaymentOutData] = useState([]);
  const purchaseReturnid = purchaseReturnDetails.purchaseReturnId;

  const handleSavePayment = async () => {
    const paymentoutData = {
      purchasesId: id,
      vendorid: vendorID,
      paymentAmount: paymentAmount,
      paymentDate: paymentDate,
      paymentType: paymentMethod,
      notes: notes,
      paymentStatus: "Paid",
      amount: amount,
    };

    try {
      const initialResponse = await fetch(
        "http://localhost:8000/api/paymentOutDetails/paymentout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentoutData),
        }
      );

     

      if (initialResponse.ok) {
        console.log("Payment successfully saved:", paymentoutData);
      } else {
        console.error("Failed to save payment:", paymentoutData.statusText);
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

  const invoiceContentRef = useRef(null);
  const handleDownloadPDF = () => {
    const content = invoiceContentRef.current;

    if (content) {
      const pdfOptions = {
        margin: 5,
        filename: `invoice_${id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          putOnlyUsedFonts: true,
        },
      };

      html2pdf().from(content).set(pdfOptions).save();
    }
  };

  console.log(
    "Signature Image URL:",
    purchaseReturnDetails?.bankDetails?.signatureImage?.url
  );
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
        purchaseReturnDetails?.bankDetails?.signatureImage?.url
      );
      const imageData = await response.blob();
      console.log("signature", response);
    } catch (error) {
      console.error("Error fetching signature image:", error);
    }
  };

  const [bankData, setBankData] = useState([]);

  const fetchbankData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/BankDeatils/bank-details"
      );
      console.log("BankDatass:", response.data);
      setBankData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchbankData();
  }, []);

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
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={14} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}

            <div className="page-header">
              <div className="content-invoice-header flex flex-wrap">
                <div className="flex flex-wrap items-center">
                  <BackButton />
                  <h5>Purchase Return Details</h5>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    <li>
                      <Tooltip placement="topLeft" title={"Print"}>
                        <a
                          href="javascript:window.print()"
                          className="print-link btn btn-primary"
                        >
                          <FeatherIcon icon="printer" />
                        </a>
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip placement="topLeft" title={"Download"}>
                        <Link
                          to="#"
                          className="download-link btn btn-primary 300:py-[4px] 300:px-[10px] 700:py-[7px] 700:px-[15px]"
                          download=""
                          onClick={handleDownloadPDF}
                        >
                          <i className="fa fa-download" aria-hidden="true" />
                        </Link>
                      </Tooltip>
                    </li>

                    <li>
                      <Dropdown>
                        <Tooltip placement="topLeft" title={"Share"}>
                          <Dropdown.Toggle
                            variant="primary"
                            id="shareDropdown"
                            className="300:py-[6px] 300:px-[10px] 700:py-[10px] 700:px-[15px]"
                          >
                            <FaShare className="me-2" />
                          </Dropdown.Toggle>
                        </Tooltip>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={handleWhatsAppShare}>
                            <FaWhatsapp /> WhatsApp
                          </Dropdown.Item>
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#email_details"
                          >
                            <Dropdown.Item>
                              <FaEnvelope />
                              Email
                            </Dropdown.Item>
                          </Link>
                          {/* <Dropdown.Item onClick={handleSendInvoice}>
                            <FaEnvelope className="me-2" /> Email
                          </Dropdown.Item> */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Add the Payment In modal */}
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
                      Record Payment for this Purchase
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
                      />
                    </div>
                    {/* <div className="mb-3">
                      <label htmlFor="balance" className="form-label">
                        Balance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="balance"
                        placeholder="Balance"
                        // defaultValue={amount}
                        readOnly
                        value={LastPaymentBalance}
                      />
                    </div> */}

                    <div className="mb-3">
                      <label htmlFor="paymentDate" className="form-label">
                        Payment Date
                      </label>
                      {/* <div className="input-group">
                        <DatePicker
                          selected={paymentDate}
                          onChange={(date) => setPaymentDate(date)}
                          className="form-control"
                          placeholderText="Select payment date"
                        />
                        <span className="input-group-text">
                          <MdOutlineDateRange />
                        </span>
                      </div> */}
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
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        className="form-select"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        value={paymentMethod}
                      >
                        <option value="">Select payment method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                        <option value="Cheque">Cheque</option>
                        {/* <option value="Partial Payment">Partial payment</option> */}
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
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <button
                      type="button"
                      className={`btn btn-primary ${
                        isSaveDisabled ? "disabled" : ""
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
            <div
              className={`print-only-section ${menu ? "slide-nav" : ""}`}
              ref={invoiceContentRef}
            >
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  
                  <Middleware purchaseReturnDetails={purchaseReturnDetails}/>
                </div>
              </div>
            </div>
          </div>
          {purchaseReturnDetails?.purchaseReturnDate && (
            <SendEmail
              endpoint={`/view-only-invoice/purchaseReturn/purchases-returnforview/${id}`}
              defaultMail={purchaseReturnDetails?.name?.email}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseReturnView;
