import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineDateRange } from "react-icons/md";
import html2pdf from "html2pdf.js";
import BackButton from "./Cards/BackButton";
import SendEmail from "./Modals/SendEmail";
import Middleware from "../_components/Middleware";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { TbTransferVertical } from "react-icons/tb";
const PerformaDetails = () => {
  const { id } = useParams();
  console.log("id", id);
  const [menu, setMenu] = useState(false);
  const [proformaDetails, setProformaDetails] = useState([]);
  console.log("proformaDetailsviw", proformaDetails);

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
  const history = useHistory();

  const handleConvertToInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/convertToInvoice/proformaToInvoice`,
        { proformaDetails }
      );
    
      if (response.status === 201) {
        toast.success("Proforma Converted to Invoice", {
          position: toast.POSITION.TOP_RIGHT,
        });
        
        // Navigate to /invoice-list
        history.push("/invoice-list");
      } else {
        console.error("Failed to convert Proforma to invoice");
      }
    } catch (error) {
      console.error("Error converting Proforma to invoice:", error);
    }
  };

  const email = proformaDetails?.customerName?.email;
  const customerID = proformaDetails?.customerName?.customerId;

  console.log("customerID", customerID);

  useEffect(() => {
    const fetchProformaDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/performa/performaforview/${id}`
        );

        setProformaDetails(response.data);
        console.log("responsesss", response.data);
        const lastPaymentBalance =
          response.data.payments.length > 0
            ? response.data.payments[response.data.payments.length - 1].balance
            : response.data.grandTotal;

        // Set the balance to a separate variable
        setLastPaymentBalance(lastPaymentBalance);
        setPaymentAmount(response.data.grandTotal);
        console.log("Fetched Quotation Details:", response.data);
      } catch (error) {
        console.error("Error fetching Quotation details:", error);
      }
    };

    fetchProformaDetails();
  }, [id]);

  console.log("proformaDetails:", proformaDetails);

  const [customerEmail, setCustomerEmail] = useState(email);
  const proformaData = proformaDetails;

  const handleSendPurchase = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/performa/sendProforma",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerEmail, proformaData }),
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

  const proformaid = proformaDetails.proformaId;
  console.log("quotationId", proformaid);

  const handleSavePayment = async () => {
    const paymentData = {
      proformaId: id,
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
        "http://localhost:8000/api/paymentDetails/payment",
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
    proformaDetails?.bankDetails?.signatureImage?.url
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
        proformaDetails?.bankDetails?.signatureImage?.url
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
            {/* Page Header */}

            <div className="page-header">
              <div className="content-invoice-header flex flex-wrap">
                <div className="flex flex-wrap items-center">
                  <BackButton />
                  <h5>Proforma Details</h5>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    <li
                      className="btn btn-primary p-2"
                      onClick={handleConvertToInvoice}
                    >
                      <TbTransferVertical style={{
                        fontSize:'18px',marginRight:'4px'
                      }}/>
                      Convert to Invoice
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
                    <div className="mb-3">
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
                <Middleware proformaDetails={proformaDetails} />
              </div>
              {proformaDetails?.salesReturnDate && (
                <SendEmail
                  endpoint={`/view-only-proforma-invoice/${id}`}
                  defaultMail={proformaDetails?.customerName?.email}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformaDetails;
