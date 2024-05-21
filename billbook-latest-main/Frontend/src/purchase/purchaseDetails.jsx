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
import { RiDownloadCloud2Line } from "react-icons/ri";

const PurchaseDetails = () => {
  const { id } = useParams();
  console.log(id, "id");
  const [menu, setMenu] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  console.log("ivoice by id", purchaseDetails);

  const [paymentAmount, setPaymentAmount] = useState("");
  console.log("payment amount", paymentAmount);
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



  const handleWhatsAppShare = () => {
    const phoneNumber = "7993852051";
    const invoiceDownloadLink = `http://localhost:8000/invoices/invoice_${id}.pdf`; // Replace with the actual local URL to your invoice file
    const message = `Hello, check out this invoice: ${invoiceDownloadLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl);

    console.log("Share via WhatsApp");
  };

  const name = purchaseDetails?.name?.name;
  const email = purchaseDetails?.name?.email;
  const phoneNumber = purchaseDetails?.name?.phoneNumber;
  const vendorID = purchaseDetails?.name?.vendorId;

  console.log("vendorID", vendorID);
  console.log("email", email);
  console.log("vendorID", vendorID);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/addPurchases/purchasesdetails/${id}`
        );
        setPurchaseDetails(response.data);
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

    fetchPurchaseDetails();
  }, [id]);

  console.log("purchaseDetails:", purchaseDetails);

  const [customerEmail, setCustomerEmail] = useState(email);
  const purchaseData = purchaseDetails;



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
  const purchasesid = purchaseDetails.purchasesId;
  console.log("purchasesid", purchasesid);





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

  // console.log(
  //   "Signature Image URL:",
  //   purchaseDetails?.bankDetails?.uploadReceipt?.url
  // );

  console.log("Signatire", purchaseDetails?.bankDetails?.uploadReceipt);

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
        purchaseDetails?.bankDetails?.uploadReceipt?.url
      );
      const imageData = await response.blob();
      console.log("signature", response);
    } catch (error) {
      console.error("Error fetching signature image:", error);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptUrl = purchaseDetails?.bankDetails?.uploadReceipt?.url;
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
        {/* <Header onMenuClick={(value) => toggleMobileMenu()} />
        <Sidebar /> */}

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}

            <div className="page-header">
              <div className="content-invoice-header">
                <h5>Purchase Details</h5>
                <div className="list-btn">
                  <ul className="filter-list d-flex gap-2">
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
                    <div className="add-customer-button">
                    <Link
                      to="#"
                      className=""
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={handleDownloadPDF}
                    >
                      <RiDownloadCloud2Line />
                      Download
                    </Link>
                    </div>

                    {/* <li>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary" id="shareDropdown">
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
                                  <h1>Purchases</h1>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* /Invoice Logo */}
                          {/* Invoice Date */}
                          <div className="invoice-item invoice-item-date">
                            <div className="row">
                              <div className="col-md-6">
                                {purchaseDetails && (
                                  <p className="text-start invoice-details">
                                    Date<span>: </span>
                                    {/* {invoiceDetails.invoiceDate} */}
                                    {/* Assuming invoiceDetails.invoiceDate is in ISO format */}
                                    {/* {invoiceDetails.invoiceDate && ( */}
                                    <>
                                      {/* {" "} */}
                                      {/* (Formatted:{" "} */}
                                      {new Date(
                                        purchaseDetails.purchasesDate
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
                              <div className="col-md-6">
                                {purchaseDetails && (
                                  <p className="invoice-details">
                                    Purchase No<span>: </span>
                                    {purchaseDetails.purchaseNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* /Invoice Date */}
                          {/* Invoice To */}
                          <div className="invoice-item invoice-item-two">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="invoice-info">
                                  <strong className="customer-text-one">
                                    Purchase To<span>:</span>
                                  </strong>
                                  {purchaseDetails && (
                                    <p className="invoice-details-two">
                                      {`${name}`}, <br /> {`${phoneNumber}`},{" "}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="invoice-info invoice-info2">
                                  <strong className="customer-text-one">
                                    Pay To<span>:</span>
                                  </strong>
                                  <p className="invoice-details-two text-end">
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
                                {purchaseDetails && purchaseDetails.table ? (
                                  <div className="table-responsive">
                                    <table className="table table-center table-hover mb-0">
                                      <thead className="thead-light">
                                        <tr>
                                          {/* <th>Product ID</th> */}
                                          <th>Product Name</th>
                                          <th>Price</th>
                                          <th>Quantity</th>
                                          <th>Discount</th>
                                          <th>Tax</th>
                                          <th>Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {purchaseDetails.table.map(
                                          (item, index) => (
                                            <tr key={index}>
                                              {/* <td>{item.productId}</td> */}
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
                                        purchaseDetails?.bankDetails
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
                                      {purchaseDetails?.bankDetails?.notes}
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
                                          {purchaseDetails?.taxableAmount}
                                        </span>
                                      </p>
                                      <p>
                                        Total Discount (
                                        {
                                          purchaseDetails?.totalDiscountPercentage
                                        }
                                        %)
                                        <span>
                                          {purchaseDetails?.totalDiscount}
                                        </span>
                                      </p>

                                      <p>
                                        Total Tax (
                                        {purchaseDetails.totalTaxPercentage}%){" "}
                                        <span>
                                          {purchaseDetails.totalTax === 0
                                            ? "Tax Exemption"
                                            : purchaseDetails.totalTax}
                                        </span>
                                      </p>
                                      {purchaseDetails.totalTax !== 0 && (
                                        <>
                                          <p>
                                            CGST (
                                            {purchaseDetails?.cgstTaxPercentage}
                                            %){" "}
                                            <span>
                                              {purchaseDetails?.cgstTaxAmount ===
                                              0
                                                ? "Tax Exemption"
                                                : purchaseDetails?.cgstTaxAmount}
                                            </span>
                                          </p>
                                          <p>
                                            SGST (
                                            {purchaseDetails?.sgstTaxPercentage}
                                            %){" "}
                                            <span>
                                              {purchaseDetails?.sgstTaxAmount ===
                                              0
                                                ? "Tax Exemption"
                                                : purchaseDetails?.sgstTaxAmount}
                                            </span>
                                          </p>
                                        </>
                                      )}
                                    </div>
                                    <div className="invoice-total-footer">
                                      <h4>
                                        Grand Total(INR){" "}
                                        <span>
                                          {purchaseDetails?.grandTotal}
                                        </span>
                                      </h4>
                                      <h4>
                                        Currency{" "}
                                        <span>{purchaseDetails?.currency}</span>
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="invoice-sign text-end">
                            <p> Receipt</p>
                            {purchaseDetails?.bankDetails?.uploadReceipt?.url?.endsWith(
                              ".pdf"
                            ) ? (
                              <div>
                                <a
                                  href={
                                    purchaseDetails?.bankDetails?.uploadReceipt
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
                                    purchaseDetails?.bankDetails?.uploadReceipt
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

export default PurchaseDetails;
