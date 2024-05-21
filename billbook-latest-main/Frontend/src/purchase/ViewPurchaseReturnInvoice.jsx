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

const ViewPurchaseReturnInvoice = () => {

    const { id } = useParams();
    const [menu, setMenu] = useState(false);
    const [purchaseReturnDetails, setPurchaseReturnDetails] = useState([]);


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

    const accountName = purchaseReturnDetails?.bankDetails?.selectBank[0]?.accountName;
    const accountNumber =
        purchaseReturnDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
    const branchName = purchaseReturnDetails?.bankDetails?.selectBank[0]?.branchName;
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


    const name = purchaseReturnDetails?.name?.name;
    const addressLine1 = purchaseReturnDetails?.name?.addressLine1;
    const addressLine2 = purchaseReturnDetails?.name?.addressLine2;
    const email = purchaseReturnDetails?.name?.email;
    const vendorID = purchaseReturnDetails?.name?.vendorId;
    const city = purchaseReturnDetails?.name?.billingAddress?.city;
    const country = purchaseReturnDetails?.name?.billingAddress?.country;
    const pincode = purchaseReturnDetails?.name?.billingAddress?.pincode;
    const state = purchaseReturnDetails?.name?.billingAddress?.state;

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

    console.log("purchaseReturnDetails:", purchaseReturnDetails);

    const [customerEmail, setCustomerEmail] = useState(email);
    const purchaseData = purchaseReturnDetails;

    // const handleSendInvoice = async () => {
    //   try {
    //     const response = await fetch(
    //       "http://localhost:8000/api/addPurchase/sendPurchase",
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ customerEmail, purchaseData }),
    //       }
    //     );

    //     if (response.ok) {
    //       console.log("Purchase sent successfully");
    //     } else {
    //       console.error("Failed to send purchase");
    //     }
    //   } catch (error) {
    //     console.error("Error sending purchase", error);
    //   }
    // };

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

    const [paymentoutData, setPaymentOutData] = useState([])
    const purchaseReturnid = purchaseReturnDetails.purchaseReturnId;
    console.log("purchaseReturnid", purchaseReturnid);

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

            // const paymentData = {
            //   ...paymentData,
            //   paymentStatus: paymentStatus,
            // };

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


    return (
        <MainParentInvoice IFSCCode={IFSCCode} accountName={accountName} accountNumber={accountNumber} addressLine1={addressLine1} addressLine2={addressLine2} addressName={name} branchName={branchName} city={city} country={country} invoiceDetails={purchaseReturnDetails} invoiceDate={purchaseReturnDetails?.purchaseReturnDate} invoiceRef={invoiceContentRef} invoiceNumber={purchaseReturnDetails?.purchaseReturnNumber} menu={menu} pincode={pincode} state={state} title={"Purchase Return"} toTitle={"Purchase To"} />
    )
}

export default ViewPurchaseReturnInvoice