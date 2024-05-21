import React, { useState, useEffect, useRef } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineDateRange } from "react-icons/md";
import html2pdf from "html2pdf.js";
import SendEmail from "../invoices/Modals/SendEmail";
import { Dropdown } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope, FaShare } from "react-icons/fa";
import { Tooltip } from "antd";
import BackButton from "../invoices/Cards/BackButton";

const PaymentInView = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const [creditNotesDetails, setcreditNotesDetails] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [LastPaymentBalance, setLastPaymentBalance] = useState(0);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const name = creditNotesDetails?.customerName?.name;
  const email = creditNotesDetails?.customerName?.email;
  const customerID = creditNotesDetails?.customerName?.customerId;

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

  const handleWhatsAppShare = () => {
    const phoneNumber = "7993852051";
    const invoiceDownloadLink = `http://localhost:8000/invoices/invoice_${id}.pdf`; // Replace with the actual local URL to your invoice file
    const message = `Hello, check out this invoice: ${invoiceDownloadLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl);
  };

  useEffect(() => {
    const fetchCreditnotesDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/paymentDetails/paymentinforview/${id}`
        );
        setcreditNotesDetails(response.data);
      } catch (error) {
        console.error("Error fetching creditNotes details:", error);
      }
    };

    fetchCreditnotesDetails();
  }, [id]);

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}

            <div className="page-header">
              <div className="content-invoice-header flex flex-wrap">
                <div className="flex flex-wrap items-center">
                  <BackButton />
                  <h5>Payment In Details</h5>
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
                          <Dropdown.Toggle variant="primary" id="shareDropdown" className="300:py-[6px] 300:px-[10px] 700:py-[10px] 700:px-[15px]">
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

            <div className={`print-only-section ${menu ? "slide-nav" : ""}`} ref={invoiceContentRef}>
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
                            </div>
                          </div>
                          {/* /Invoice Logo */}
                          {/* Invoice Date */}
                          <div className="invoice-item invoice-item-date">
                            <div className="row">
                              <div className="col-md-6">
                                {creditNotesDetails && (
                                  <p className="text-start invoice-details">
                                    Payment Date<span>: </span>
                                    <>
                                      {new Date(
                                        creditNotesDetails.paymentDate
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
                                {creditNotesDetails && (
                                  <p className="invoice-details">
                                    Payment No<span>: </span>
                                    {creditNotesDetails.paymentNumber}
                                  </p>
                                )}
                              </div>

                            </div>
                          </div>
                          {/* /Invoice Date */}
                          {/* Invoice To */}
                          <div className="invoice-item invoice-item-two">
                            <div className="row">
                              <div className="col-md-2">
                                <div className="invoice-info">
                                  <strong className="customer-text-one">
                                    Party Name<span>:</span>
                                  </strong>
                                  {creditNotesDetails && (
                                    <p className="invoice-details-two">
                                      {`${name}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-4">
                                {creditNotesDetails && (
                                  <p className="invoice-details">
                                    Payment Amount<span>: </span>
                                    {creditNotesDetails.paymentAmount}
                                  </p>
                                )}
                              </div>
                              <div className="col-md-4">
                                {creditNotesDetails && (
                                  <p className="invoice-details">
                                    Payment Mode<span>: </span>
                                    {creditNotesDetails.paymentType}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="invoice-item invoice-table-wrap">
                            <div className="invoice-table-head">
                              {/* <h6>Items:</h6> */}
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="table-responsive">
                                  <table className="table table-center table-hover mb-0">
                                    <thead className="thead-light">
                                      <tr>
                                        <th>Date</th>
                                        <th>Invoice Number</th>
                                        <th>Invoice Amount</th>
                                        <th>Invoice Amount Settled</th>
                                        <th>Amount</th>
                                        <th>Customer Name</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          {creditNotesDetails?.paymentDate && new Date(
                                            creditNotesDetails?.paymentDate
                                          ).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                          })}
                                        </td>
                                        <td>{creditNotesDetails.paymentNumber}</td>
                                        <td>
                                          {creditNotesDetails.paymentAmount}
                                        </td>
                                        <td>
                                          {creditNotesDetails.paymentBalance}
                                        </td>
                                        <td>{creditNotesDetails.amount}</td>
                                        <td>
                                          {creditNotesDetails.customerName?.name}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
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

          {creditNotesDetails?.paymentDate && <SendEmail endpoint={`/view-only-invoice/paymentDetails/paymentinforview/${id}`} defaultMail={creditNotesDetails?.customerName?.email} />}
        </div>
      </div>
    </>
  );
};

export default PaymentInView;
