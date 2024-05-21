import React, { useState, useEffect, useRef } from "react";
import FeatherIcon from "feather-icons-react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineDateRange } from "react-icons/md";
import html2pdf from "html2pdf.js";
import BackButton from "../invoices/Cards/BackButton";
import Middleware from "../_components/Middleware";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";

const PurchaseOrderView = () => {
  const userData = useSelector((state) => state?.user?.userData);
  const userProfileData = userData?.data;
  console.log("userProfileData", userProfileData);

  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);
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
    purchaseOrderDetails?.bankDetails?.selectBank[0]?.accountName;
  const accountNumber =
    purchaseOrderDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
  const branchName =
    purchaseOrderDetails?.bankDetails?.selectBank[0]?.branchName;
  const IFSCCode = purchaseOrderDetails?.bankDetails?.selectBank[0]?.IFSCCode;

  const handleConvertToInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/convertToInvoice/purchaseordertopurchase`,
        { purchaseOrderDetails }
      );
      console.log("quotationDetails", purchaseOrderDetails);

      if (response.status === 200) {
        alert("Purchase Order converted to purchase successfully!");
      } else {
        console.error("Failed to convert Purchase Order converted to purchase");
      }
    } catch (error) {
      console.error(
        "Error converting Purchase Order converted to purchase:",
        error
      );
    }
  };

  const name = purchaseOrderDetails?.name?.name;
  const email = purchaseOrderDetails?.name?.email;
  const phoneNumber = purchaseOrderDetails?.name?.phoneNumber;
  const vendorID = purchaseOrderDetails?.name?.vendorId;

  useEffect(() => {
    const fetchPurchaseOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/purchaseorder/Purchase-orderforview/${id}`
        );
        setPurchaseOrderDetails(response.data);
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

    fetchPurchaseOrderDetails();
  }, [id]);

  const [customerEmail, setCustomerEmail] = useState(email);
  const purchaseOrderData = purchaseOrderDetails;

  const handleSendPurchase = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/addQuotation/sendQuotation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerEmail, quotationData }),
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

  const purchaseORid = purchaseOrderDetails.purchaseORId;
  console.log("purchaseORid", purchaseORid);

  const handleSavePayment = async () => {
    const paymentoutData = {
      purchaseORId: id,
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
          body: JSON.stringify(paymentData),
        }
      );

      // const paymentData = {
      //   ...paymentData,
      //   paymentStatus: paymentStatus,
      // };

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
        purchaseOrderDetails?.bankDetails?.signatureImage?.url
      );
      const imageData = await response.blob();
      console.log("signature", response);
    } catch (error) {
      console.error("Error fetching signature image:", error);
    }
  };
  const handleDownloadReceipt = () => {
    const receiptUrl = purchaseOrderDetails?.bankDetails?.signatureImage?.url;
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


  // const handleDownloadPDF = () => {
  //   const content = invoiceContentRef.current;

  //   if (content) {
  //     const pdfOptions = {
  //       filename: `invoice_${id}.pdf`,
  //       image: [
  //         { type: "PNG", quality: 0.98 },
  //         { type: "png", quality: 0.98 },
  //         { type: "jpeg", quality: 0.98 },
  //         { type: "jpg", quality: 0.97 }
  //       ],
  //       html2canvas: { scale: 2 },
  //       jsPDF: {
  //         unit: "mm",
  //         format: "a3",
  //         orientation: "portrait",
  //         putOnlyUsedFonts: true,
  //       },
  //     };

  //     html2pdf().from(content).set(pdfOptions).save();
  //   }
  // };


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
                  <h5>Purchase Order Details</h5>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                  <li>
                      <Tooltip placement="topLeft" title={"Download"}>
                        <button
                          // to="#"
                          type="button"
                          className="download-link btn btn-primary 300:py-[4px] 300:px-[10px] 700:py-[7px] 700:px-[15px]"
                          download=""
                          onClick={handleDownloadPDF}
                        >
                          <i className="fa fa-download" aria-hidden="true" />
                        </button>
                      </Tooltip>
                    </li>
                    {/* <li
                      className="btn btn-primary p-2"
                      onClick={handleConvertToInvoice}
                    >
                      Convert to Invoice
                    </li> */}
                    {/* <li>
                      <Link
                        to="#"
                        className="btn btn-payment-in me-2"
                        onClick={handlePaymentInLinkClick}
                      >
                        <FeatherIcon icon="dollar-sign" className="me-2" />
                        Payment In
                      </Link>
                    </li> */}
                    {/* <li>
                      <a
                        href="javascript:window.print()"
                        className="print-link btn btn-primary"
                      >
                        <FeatherIcon icon="printer" className="me-2" />
                        <span>Print</span>
                      </a>
                    </li> */}
                    {/* <li>
                      <Link
                        to="#"
                        className="download-link btn btn-primary"
                        download=""
                        onClick={handleDownloadPDF}
                      >
                        <i className="fa fa-download me-2" aria-hidden="true" />
                        <span>Download</span>
                      </Link>
                    </li> */}

                    {/* <li>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary" id="shareDropdown">
                          <FaShare className="me-2" /> Share
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={handleWhatsAppShare}>
                            <FaWhatsapp className="me-2" /> WhatsApp
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleSendQuotation}>
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
                  <div className="card">
                    <div className="card-body">
                      <div className="card-table">
                        <div className="card-body">
                          <div className="invoice-item invoice-item-one">
                            <div className="row align-items-center">
                              <div className="col-md-6">
                                <div className="invoice-logo">
                                  <img src={userProfileData?.profileImage?.url} alt="logo" />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="invoice-info">
                                  <h1>Purchase Orders</h1>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="invoice-item invoice-item-date">
                            <div className="row">
                              <div className="col-md-6">
                                {purchaseOrderDetails && (
                                  <p className="text-start invoice-details">
                                    Date<span>: </span>
                                    <>
                                      {new Date(
                                        purchaseOrderDetails.purchasesORDate
                                      ).toLocaleDateString("en-GB", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      })}
                                    </>
                                  </p>
                                )}
                              </div>
                              <div className="col-md-6">
                                {purchaseOrderDetails && (
                                  <p className="invoice-details">
                                    Invoice No<span>: </span>
                                    {purchaseOrderDetails.purchaseORNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="invoice-item invoice-item-two">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="invoice-info">
                                  <strong className="customer-text-one">
                                    Purchase Orders To<span>:</span>
                                  </strong>
                                  {purchaseOrderDetails && (
                                    <p className="invoice-details-two">
                                      {name}
                                      <br />
                                      {phoneNumber}
                                      <br />
                                      {email}
                                      <br />
                                      {/* {PANNumber} */}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="invoice-info">
                                  {purchaseOrderDetails?.bankDetails?.selectBank.length > 0 && (
                                    <strong className="customer-text-one">
                                      {purchaseOrderDetails &&
                                        purchaseOrderDetails.bankDetails && (
                                          <div className="invoice-info">
                                            <strong className="customer-text-one">
                                              Bank Details<span>:</span>
                                            </strong>

                                            <p className="invoice-details-two">
                                              {accountName}, <br />
                                              {accountNumber}, <br />
                                              {branchName}, <br />
                                              {IFSCCode}
                                            </p>
                                          </div>
                                        )}
                                    </strong>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="invoice-info invoice-info2">
                                  <strong className="customer-text-one">
                                    Pay To<span>:</span>
                                  </strong>
                                  <p className="invoice-details-two text-end justify-content-end">
                                    {userProfileData?.businessName}
                                    <br />
                                    {userProfileData?.email}
                                    <br />
                                    {userProfileData?.phone}
                                    <br />

                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="invoice-item invoice-table-wrap">
                            <div className="invoice-table-head">
                              <h6>Items:</h6>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                {purchaseOrderDetails &&
                                  purchaseOrderDetails.table ? (
                                  <div className="table-responsive">
                                    <table className="table table-center table-hover mb-0">
                                      <thead className="thead-light">
                                        <tr>
                                          <th>Product Name</th>
                                          <th>Price</th>
                                          <th>Quantity</th>
                                          <th>Discount</th>
                                          <th>Tax</th>
                                          <th>Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {purchaseOrderDetails.table.map(
                                          (item, index) => (
                                            <tr key={index}>
                                              <td>{item.productName}</td>

                                              <td>{item.price}</td>
                                              <td>{item.quantity}</td>
                                              <td>{item.discount}</td>
                                              <td>{item.gstRate}</td>
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
                                    <div className="mb-0">
                                      {purchaseOrderDetails?.bankDetails?.termsAndConditions?.split('\n').map((line, index) => (
                                        <p key={index}>{line}</p>
                                      ))}
                                    </div>
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
                                      {purchaseOrderDetails?.bankDetails?.notes}
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
                                          {purchaseOrderDetails?.taxableAmount}
                                        </span>
                                      </p>
                                      <p>
                                        Total Discount (
                                        {
                                          purchaseOrderDetails?.totalDiscountPercentage
                                        }
                                        %)
                                        <span>
                                          {purchaseOrderDetails?.totalDiscount}
                                        </span>
                                      </p>

                                      <p>
                                        Total Tax (
                                        {
                                          purchaseOrderDetails.totalTaxPercentage
                                        }
                                        %){" "}
                                        <span>

                                          {purchaseOrderDetails.totalTax}
                                        </span>
                                      </p>
                                      {/* {purchaseOrderDetails.totalTax !== 0 && ( */}
                                        <>
                                          <p>
                                            CGST (
                                            {
                                              purchaseOrderDetails?.cgstTaxPercentage
                                            }
                                            %){" "}
                                            <span>
                                              { purchaseOrderDetails?.cgstTaxAmount}
                                            </span>
                                          </p>
                                          <p>
                                            SGST (
                                            {
                                              purchaseOrderDetails?.sgstTaxPercentage
                                            }
                                            %){" "}
                                            <span>
                                              {purchaseOrderDetails?.sgstTaxAmount}
                                            </span>
                                          </p>
                                        </>
                                      {/* )} */}
                                    </div>
                                    <div className="invoice-total-footer">
                                      <h4>
                                        Grand Total(INR){" "}
                                        <span>
                                          {purchaseOrderDetails?.grandTotal}
                                        </span>
                                      </h4>

                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="invoice-sign text-end">
                           
                            <p> Receipt</p>
                              
                          
                            {purchaseOrderDetails?.bankDetails?.signatureImage?.url ? (
                              <div>
                                <a
                                  href={purchaseOrderDetails?.bankDetails?.signatureImage?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </div>
                            ) : null}
                            {/* Download Option */}
                            {purchaseOrderDetails?.bankDetails?.signatureImage?.url ? (
                              <div>
                                <a href="#" onClick={handleDownloadReceipt}>
                                  Download Receipt
                                </a>
                              </div>
                            ) : null}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <Middleware purchaseOrderDetails={purchaseOrderDetails} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrderView;
