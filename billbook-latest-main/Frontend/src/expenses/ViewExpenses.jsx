import React, { useState, useEffect, useRef } from "react";
import FeatherIcon from "feather-icons-react";
import { DetailsLogo, signature } from "../_components/imagepath";
import { Link } from "react-router-dom";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineDateRange } from "react-icons/md";
import { Dropdown, Button } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope, FaShare } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import { HiOutlinePrinter } from "react-icons/hi";
import { RiDownloadCloud2Line } from "react-icons/ri";
const ViewExpenses = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const [expenseDetails, setexpenseDetails] = useState([]);
  console.log("ivoice by id", expenseDetails);
  const [balance, setBalance] = useState(expenseDetails?.grandTotal || 0);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  // const [balance, setBalance] = useState(0);
  const [LastPaymentBalance, setLastPaymentBalance] = useState(0);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);


  const accountName = expenseDetails?.bankDetails?.selectBank?.[0]?.accountName;

  const accountNumber =
    expenseDetails?.bankDetails?.selectBank?.[0]?.bankAccountNumber;
  const branchName = expenseDetails?.bankDetails?.selectBank?.[0]?.branchName;
  const IFSCCode = expenseDetails?.bankDetails?.selectBank?.[0]?.IFSCCode;

  useEffect(() => {
    setBalance(expenseDetails.payments);
  });

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
  const handleWhatsAppShare = () => {
    const phoneNumber = "7993852051";
    const invoiceDownloadLink = `http://localhost:8000/invoices/invoice_${id}.pdf`;
    const message = `Hello, check out this invoice: ${invoiceDownloadLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl);

    console.log("Share via WhatsApp");
  };


  const partyName = expenseDetails?.partyName?.partyName;
  const phoneNumber = expenseDetails?.partyName?.phoneNumber;


  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/Expense/Expense/${id}`
        );
        setexpenseDetails(response.data);

        // Check if payments exist before setting the balance
        if (response.data.payments) {
          setBalance(response.data.payments.length);
        }

        const lastPaymentBalance =
          response.data.payments && response.data.payments.length > 0
            ? response.data.payments[response.data.payments.length - 1].balance
            : response.data.grandTotal;

        // Set the balance to a separate variable
        setLastPaymentBalance(lastPaymentBalance);
        setPaymentAmount(response.data.grandTotal);
        console.log("Fetched Invoice Details:", response.data);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      }
    };

    fetchExpenseDetails();
  }, [id]);

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

  const expenseid = expenseDetails.expenseId;

  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);

    const newBalance =
      parseFloat(LastPaymentBalance) - parseFloat(enteredAmount);

    setBalance(isNaN(newBalance) ? 0 : newBalance.toFixed(2));
  };

  const invoiceContentRef = useRef(null);

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
        expenseDetails?.bankDetails?.signatureImage?.url
      );
      const imageData = await response.blob();
      console.log("signature", response);
    } catch (error) {
      console.error("Error fetching signature image:", error);
    }
  };
  const handleDownloadReceipt = () => {
    const receiptUrl = expenseDetails?.bankDetails?.uploadReceipt?.url;
    if (receiptUrl) {
      axios
        .get(receiptUrl, { responseType: "blob" })
        .then((response) => {
          const contentType = response.headers["content-type"];
          let filename = "receipt";

          if (contentType.includes("pdf")) {
            filename += ".pdf";
          } else if (contentType.includes("image")) {
            const extension = contentType.split("/")[1];
            filename += `.${extension}`;
          }

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error downloading receipt:", error);
        });
    }
  };
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}

            <div className="page-header">
              <div className="content-invoice-header">
                <h5>Expenses Invoice Details</h5>
                <div className="list-btn">
                  <ul className="filter-list">
                    {/* <li>
                      <Link
                        to="#"
                        className="btn btn-payment-in me-2 flex-a"
                        onClick={handlePaymentInLinkClick}
                      >
                        <FeatherIcon icon="dollar-sign" className="me-2" />
                        Payment In
                      </Link>
                    </li> */}
                    {/* <li className="add-customer-button">
                      <a
                        href="javascript:window.print()"
                        className="print-link btn btn-primary flex-a"
                      >
                        <HiOutlinePrinter />
                        <span>Print</span>
                      </a>
                    </li> */}
                    <li className="add-customer-button">
                      <Link
                        to="#"
                        className="download-link btn btn-primary"
                        download=""
                        onClick={handleDownloadPDF}
                      >
                        <RiDownloadCloud2Line />
                        Download
                      </Link>
                    </li>
                    {/* <li>
                      <Dropdown>
                        <Dropdown.Toggle
                          className="flex-a"
                          variant="primary"
                          id="shareDropdown"
                        >
                          <FaShare className="me-2" /> Share
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={handleWhatsAppShare}>
                            <FaWhatsapp className="me-2" /> WhatsApp
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleSendInvoice}>
                            <FaEnvelope className="me-2" /> Email
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li> */}
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
                      Record Payment for this expense Invoice
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
                        {/* <option value="Partial Payment">Partial payment</option> */}
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
                </div>
              </div>
            </div>
            <div
              className={`print-only-section ${menu ? "slide-nav" : ""}`}
              ref={invoiceContentRef}
            >
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="card-table">
                        <div className="card-body">
                          {/* Invoice Logo */}
                          <div className="invoice-item invoice-item-one">
                            <div className="row align-items-center">
                              <div className="col-md-6">
                                <div className="invoice-logo">
                                  <img src="/logo1.svg" alt="logo" />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="invoice-info">
                                  <h1>Expense Invoice</h1>
                                </div>
                                <div>
                                  {expenseDetails && (
                                    <p className=" invoice-details">
                                      Date<span>: </span>
                                      <>
                                        {new Date(
                                          expenseDetails.expenseDate
                                        ).toLocaleDateString("en-GB", {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                        })}
                                        {/* ) */}
                                      </>
                                    </p>
                                  )}
                                </div>
                                <div>
                                  {expenseDetails && (
                                    <p className="invoice-details">
                                      Invoice No<span>: </span>
                                      {expenseDetails.expenseNumber}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="invoice-item invoice-item-two">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="invoice-info">
                                  <strong className="customer-text-one">
                                    Expense To<span>:</span>
                                  </strong>

                                  <p className="invoice-details-two">
                                    {`${expenseDetails?.partyName}`}, <br />{" "}
                                    {expenseDetails?.phoneNumber}
                                  </p>
                                </div>
                              </div>
                              {/* <div className="col-md-4">
                                <div className="invoice-info">
                                  {expenseDetails &&
                                    expenseDetails.bankDetails && (
                                      <>
                                        <strong className="customer-text-one">
                                          Bank Details<span>:</span>
                                        </strong>
                                        <p className="invoice-details-two">
                                          {accountName}, <br />
                                          {accountNumber}, <br />
                                          {branchName}, <br />
                                          {IFSCCode}
                                        </p>
                                      </>
                                    )}
                                </div>
                              </div> */}
                              {/* </div> */}
                              <div className="col-md-6">
                                <div className="invoice-info invoice-info2">
                                  <strong className="customer-text-one">
                                    Pay To<span>:</span>
                                  </strong>
                                  <p className="invoice-details-two">
                                    Walter Roberson
                                    <br />
                                    299 Star Trek Drive, Panama City,
                                    <br />
                                    Florida, 32405,
                                    <br />
                                    USA
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* /Invoice To */}
                          {/* Invoice Item */}
                          <div className="invoice-item invoice-table-wrap">
                            <div className="invoice-table-head">
                              <h6>Items:</h6>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                {expenseDetails && expenseDetails.table ? (
                                  <div className="table-responsive">
                                    <table className="table table-center table-hover mb-0">
                                      <thead className="thead-light">
                                        <tr>
                                          {/* <th>Product ID</th> */}
                                          <th>Product Name</th>
                                          <th>Price</th>
                                          <th>Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {expenseDetails.table.map(
                                          (item, index) => (
                                            <tr key={index}>
                                              <td>{item.productName}</td>
                                              <td>{item.price}</td>
                                              <td>
                                                {item.totalAmount.toFixed(2)}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p>No items available</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* /Invoice Item */}
                          {/* Terms & Conditions */}
                          <div className="terms-conditions credit-details">
                            <div className="row align-items-center justify-content-between">
                              <div className="col-lg-6 col-md-6">
                                <div className="invoice-terms align-center">
                                  <span className="invoice-terms-icon bg-white-smoke me-3">
                                    <i className="fe fe-file-text">
                                      <FeatherIcon icon="file-text" />
                                    </i>
                                  </span>
                                  <div className="invocie-note">
                                    <h6>Terms &amp; Conditions</h6>
                                    <p className="mb-0">
                                      {
                                        expenseDetails?.bankDetails
                                          ?.termsAndConditions
                                      }
                                    </p>
                                  </div>
                                </div>
                                <div className="invoice-terms align-center">
                                  <span className="invoice-terms-icon bg-white-smoke me-3">
                                    <i className="fe fe-file-minus">
                                      <FeatherIcon icon="file-minus" />
                                    </i>
                                  </span>
                                  <div className="invocie-note">
                                    <h6>Note</h6>
                                    <p className="mb-0">
                                      {expenseDetails?.bankDetails?.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="invoice-total-card">
                                  <div className="invoice-total-box">
                                    <div className="invoice-total-inner">
                                      <p>
                                        Taxable Amount
                                        <span>
                                          {expenseDetails?.taxableAmount}
                                        </span>
                                      </p>
                                      <p>
                                        Total Discount (
                                        {
                                          expenseDetails?.totalDiscountPercentage
                                        }
                                        %)
                                        <span>
                                          {expenseDetails?.totalDiscount}
                                        </span>
                                      </p>
                                      <p>
                                        Total Tax (
                                        {expenseDetails?.totalTaxPercentage}%)
                                        <span>{expenseDetails?.totalTax}</span>
                                      </p>
                                      <p>
                                        CGST Amount (
                                        {expenseDetails?.cgstTaxPercentage}%)
                                        <span>
                                          {expenseDetails?.cgstTaxAmount}
                                        </span>
                                      </p>
                                      <p>
                                        SGST Amount (
                                        {expenseDetails?.sgstTaxPercentage}%)
                                        <span>
                                          {expenseDetails?.sgstTaxAmount}
                                        </span>
                                      </p>

                                      {/* <p>
                                      Vat <span>$0.00</span>
                                    </p> */}
                                    </div>
                                    <div className="invoice-total-footer">
                                      <h4>
                                        Grand Total(INR){" "}
                                        <span>
                                          {expenseDetails?.grandTotal}
                                        </span>
                                      </h4>
                                      <h4>
                                        Currency{" "}
                                        <span>{expenseDetails?.currency}</span>
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="invoice-sign text-end">
                            <p> Receipt</p>
                            {expenseDetails?.bankDetails?.uploadReceipt?.url?.endsWith(
                              ".pdf"
                            ) ? (
                              <div>

                                <a
                                  href={
                                    expenseDetails?.bankDetails?.uploadReceipt
                                      ?.url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </div>
                            ) : (
                              <div>

                                <a
                                  href={
                                    expenseDetails?.bankDetails?.uploadReceipt
                                      ?.url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </div>
                            )}
                            {/* Download Option */}
                            <div>
                              <a href="#" onClick={handleDownloadReceipt}>
                                Download Receipt
                              </a>
                            </div>
                          </div>

                          {/* /Terms & Conditions */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewExpenses;
