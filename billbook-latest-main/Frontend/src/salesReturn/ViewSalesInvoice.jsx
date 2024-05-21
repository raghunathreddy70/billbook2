import React, { useState, useEffect, useRef } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
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
import MainParentInvoice from "../invoices/Layouts/MainParentInvoice";
import { backendUrl } from "../backendUrl";

const ViewSalesInvoice = () => {

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

    const accountName = salesReturnDetails?.bankDetails?.selectBank[0]?.accountName;
    const accountNumber =
        salesReturnDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
    const branchName = salesReturnDetails?.bankDetails?.selectBank[0]?.branchName;
    const IFSCCode = salesReturnDetails?.bankDetails?.selectBank[0]?.IFSCCode;



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



    const addressLine1 =
        salesReturnDetails?.customerName?.billingAddress?.addressLine1;
    const addressLine2 =
        salesReturnDetails?.customerName?.billingAddress?.addressLine2;
    const city = salesReturnDetails?.customerName?.billingAddress?.city;
    const country = salesReturnDetails?.customerName?.billingAddress?.country;
    const name = salesReturnDetails?.customerName?.billingAddress?.name;
    const pincode = salesReturnDetails?.customerName?.billingAddress?.pincode;
    const state = salesReturnDetails?.customerName?.billingAddress?.state;
    const email = salesReturnDetails?.customerName?.email;
    const customerID = salesReturnDetails?.customerName?.customerId;

    console.log("customerID", customerID);

    useEffect(() => {
        const fetchSalesReturnDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/SalesReturn/salesforview/${id}`
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

    console.log("salesReturnDetails:", salesReturnDetails);

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

            // try {
            //   const updatedResponse = await fetch(
            //     "http://localhost:8000/api/paymentDetails/payment",
            //     {
            //       method: "POST",
            //       headers: {
            //         "Content-Type": "application/json",
            //       },
            //       body: JSON.stringify(updatedPaymentData),
            //     }
            //   );

            //   if (updatedResponse.ok) {
            //     console.log("Payment successfully saved:", updatedPaymentData);
            //   } else {
            //     console.error("Failed to save payment:", updatedResponse.statusText);
            //   }
            // } catch (error) {
            //   console.error("Error saving payment:", error);
            // }
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
        } catch (error) {
            console.error("Error fetching signature image:", error);
        }
    };



    return (
        <MainParentInvoice IFSCCode={IFSCCode} accountName={accountName} accountNumber={accountNumber} addressLine1={addressLine1} addressLine2={addressLine2} addressName={name} branchName={branchName} city={city} country={country} invoiceDetails={salesReturnDetails} invoiceDate={salesReturnDetails?.salesReturnDate} invoiceRef={invoiceContentRef} invoiceNumber={salesReturnDetails?.salesReturnNumber} menu={menu} pincode={pincode} state={state} title={"Sales Returns"} />
    )
}

export default ViewSalesInvoice