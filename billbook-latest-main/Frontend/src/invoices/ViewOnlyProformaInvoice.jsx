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
import BackButton from "./Cards/BackButton";
import MainParentInvoice from "./Layouts/MainParentInvoice";

const ViewOnlyProformaInvoice = () => {

    const { id } = useParams();
    const [menu, setMenu] = useState(false);
    const [proformaDetails, setProformaDetails] = useState([]);

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

    const accountName = proformaDetails?.bankDetails?.selectBank[0]?.accountName;
    const accountNumber =
        proformaDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
    const branchName = proformaDetails?.bankDetails?.selectBank[0]?.branchName;
    const IFSCCode = proformaDetails?.bankDetails?.selectBank[0]?.IFSCCode;

    const handleConvertToInvoice = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8000/convertToInvoice/proformaToInvoice`,
                { proformaDetails }
            );
            console.log("profomaDetails", proformaDetails)

            if (response.status === 201) {

                alert("Proforma converted to invoice successfully!");


            } else {
                console.error("Failed to convert Proforma to invoice");
            }
        } catch (error) {
            console.error("Error converting Proforma  to invoice:", error);
        }
    };

    const addressLine1 =
        proformaDetails?.customerName?.billingAddress?.addressLine1;
    const addressLine2 =
        proformaDetails?.customerName?.billingAddress?.addressLine2;
    const city = proformaDetails?.customerName?.billingAddress?.city;
    const country = proformaDetails?.customerName?.billingAddress?.country;
    const name = proformaDetails?.customerName?.billingAddress?.name;
    const pincode = proformaDetails?.customerName?.billingAddress?.pincode;
    const state = proformaDetails?.customerName?.billingAddress?.state;
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
                console.log("response", response.data);
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
        <MainParentInvoice IFSCCode={IFSCCode} accountName={accountName} accountNumber={accountNumber} addressLine1={addressLine1} addressLine2={addressLine2} addressName={name} branchName={branchName} city={city} country={country} invoiceDetails={proformaDetails} invoiceDate={proformaDetails?.performaDate} invoiceRef={invoiceContentRef} invoiceNumber={proformaDetails?.proformaNumber} menu={menu} pincode={pincode} state={state} title={"Proforma"} toTitle={"Proforma To"} />
    )
}

export default ViewOnlyProformaInvoice