import React, { useState, useEffect, useRef } from "react";
import FeatherIcon from "feather-icons-react";
import { DetailsLogo, signature } from "../_components/imagepath";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineDateRange } from "react-icons/md";
import { Dropdown, Button } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope, FaShare } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import SendEmail from "../invoices/Modals/SendEmail";
import { Tooltip } from "antd";
import BackButton from "../invoices/Cards/BackButton";
import Middleware from "../_components/Middleware";
import { backendUrl } from "../backendUrl";
import { RiDownloadCloud2Line } from "react-icons/ri";

const SalesReturnView = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const [salesReturnDetails, setSalesReturnDetails] = useState([]);

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
    salesReturnDetails?.bankDetails?.selectBank[0]?.accountName;
  const accountNumber =
    salesReturnDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
  const branchName = salesReturnDetails?.bankDetails?.selectBank[0]?.branchName;
  const IFSCCode = salesReturnDetails?.bankDetails?.selectBank[0]?.IFSCCode;

  const handleWhatsAppShare = () => {
    const phoneNumber = "7993852051";
    const invoiceDownloadLink = `${backendUrl}/invoices/invoice_${id}.pdf`;
    const message = `Hello, check out this invoice: ${invoiceDownloadLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl);

    console.log("Share via WhatsApp");
  };

  const email = salesReturnDetails?.customerName?.email;
  const customerID = salesReturnDetails?.customerName?.customerId;

  console.log("customerID", customerID);

  useEffect(() => {
    const fetchSalesReturnDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/SalesReturn/salesforview/${id}`
        );
        setSalesReturnDetails(response.data);
        const lastPaymentBalance =
          response.data.payments.length > 0
            ? response.data.payments[response.data.payments.length - 1].balance
            : response.data.grandTotal;

        // Set the balance to a separate variable
        setLastPaymentBalance(lastPaymentBalance);
        setPaymentAmount(response.data.grandTotal);
        console.log("Fetched sales return Details:", response.data);
      } catch (error) {
        console.error("Error fetching sales return details:", error);
      }
    };

    fetchSalesReturnDetails();
  }, [id]);

  const [customerEmail, setCustomerEmail] = useState(email);
  const salesReturnData = salesReturnDetails;

  const handleSendInvoice = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/creditNotes/sendCreditnotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerEmail, salesReturnData }),
        }
      );

      if (response.ok) {
        console.log("Purchase sent successfully");
      } else {
        console.error("Failed to send purchase");
      }
    } catch (error) {
      console.error("Error sending purchase", error);
    }
  };

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

  const salesReturnid = salesReturnDetails.salesReturnId;
  console.log("salesReturnid", salesReturnid);

  const handleSavePayment = async () => {
    const paymentData = {
      salesReturnId: id,
      customerid: customerID,
      paymentAmount: paymentAmount,
      paymentDate: paymentDate,
      paymentType: paymentMethod,
      notes: notes,
      paymentStatus: "Paid",
      amount: amount,
    };

    try {
      const initialResponse = await fetch(
        `${backendUrl}/api/paymentDetails/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (initialResponse.ok) {
        console.log("Payment successfully saved:", paymentData);
      } else {
        console.error("Failed to save payment:", paymentData.statusText);
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

    console.log(content, "hhhhhhhhhhhhhhhhhh");

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
    salesReturnDetails?.bankDetails?.signatureImage?.url
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
        salesReturnDetails?.bankDetails?.signatureImage?.url
      );
      const imageData = await response.blob();
      console.log("signature", response);
    } catch (error) {
      console.error("Error fetching signature image:", error);
    }
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-invoice-header flex flex-wrap">
                <div className="flex flex-wrap items-center">
                  <BackButton />
                  <h5>Sales Return Details</h5>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    {/* <li>
                      <Tooltip placement="topLeft" title={"Print"}>
                        <a
                          href="javascript:window.print()"
                          className="print-link btn btn-primary"
                        >
                          <FeatherIcon icon="printer" />
                        </a>
                      </Tooltip>
                    </li> */}
                    <li className="mx-2">
                      <Tooltip placement="topLeft" title={"Download"}>
                        <Link
                          to="#"
                          className="download-link btn btn-primary 300:py-[4px] 300:px-[10px] 700:py-[7px] 700:px-[15px]"
                          download=""
                          onClick={handleDownloadPDF}
                        >
                          <RiDownloadCloud2Line
                            className="me-1"
                            style={{ fontSize: "18px" }}
                          />
                          <p>Download</p>
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
                            <p className="mr-1">Share</p>
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
                <div className="modal-content p-0">
                  <div className="modal-header">
                    <h4 className="modal-title">
                      Record Payment for this Purchase
                    </h4>

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
                  <div className="modal-body px-3">
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
                    <div className="mb-3">
                      <label htmlFor="balance" className="form-label">
                        Balance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="balance"
                        placeholder="Balance"
                        readOnly
                        value={LastPaymentBalance}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="paymentDate" className="form-label">
                        Payment Date
                      </label>
                      <div className="input-group">
                        <DatePicker
                          selected={paymentDate}
                          onChange={(date) => setPaymentDate(date)}
                          className="form-control"
                          placeholderText="Select payment date"
                        />
                        <span className="input-group-text">
                          <MdOutlineDateRange />
                        </span>
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
                      </select>
                    </div>
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

                  <div className="modal-footer px-3">
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
            <div
              className={`print-only-section ${menu ? "slide-nav" : ""}`}
              ref={invoiceContentRef}
            >
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <Middleware salesReturnDetails={salesReturnDetails} />
                </div>
              </div>
            </div>
            {salesReturnDetails?.salesReturnDate && (
              <SendEmail
                endpoint={`/view-only-invoice/SalesReturn/salesforview/${id}`}
                defaultMail={salesReturnDetails?.customerName?.email}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReturnView;
