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
import BackButton from "../invoices/Cards/BackButton";
import Middleware from "../_components/Middleware";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";
import { TbTransferVertical } from "react-icons/tb";

const QuotationDetails = () => {
  const history = useHistory();

  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const [quotationDetails, setQuotationDetails] = useState([]);
console.log("quotationDetails", quotationDetails)

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

  const accountName = quotationDetails?.bankDetails?.selectBank[0]?.accountName;
  const accountNumber =
    quotationDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
  const branchName = quotationDetails?.bankDetails?.selectBank[0]?.branchName;
  const IFSCCode = quotationDetails?.bankDetails?.selectBank[0]?.IFSCCode;

  const handleConvertToInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/convertToInvoice/quotationToInvoice`,
        { quotationDetails }
      );
      console.log("quotationDetails", quotationDetails);

      if (response.status === 201) {
        toast.success("Proforma Converted to Invoice", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push("/invoice-list");
      } else {
        console.error("Failed to convert Quotation to invoice");
      }
    } catch (error) {
      console.error("Error converting Quotation to invoice:", error);
    }
  };


  const email = quotationDetails?.customerName?.email;
  const customerID = quotationDetails?.customerName?.customerId;

  console.log("customerID", customerID);

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/addQuotation/quotationsforView/${id}`
        );
        setQuotationDetails(response.data);
        console.log("responsesdaaff", response.data);
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

    fetchQuotationDetails();
  }, [id]);

  console.log("quotationDetailsasawqw1q", quotationDetails)

  const [customerEmail, setCustomerEmail] = useState(email);
  const quotationData = quotationDetails;

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

  const quotationid = quotationDetails.quotationId;
  console.log("quotationId", quotationid);



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
        quotationDetails?.bankDetails?.signatureImage?.url
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
                  <h5>Quotation Details</h5>
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
              className={`print-only-section ${menu ? "slide-nav" : ""}`}
              ref={invoiceContentRef}
            >
              <div className="row justify-content-center">
                <div className="col-lg-12">
                 
                  <Middleware quotationDetails={quotationDetails}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationDetails;
