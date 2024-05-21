import React, { useState, useEffect, useRef } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import { DetailsLogo, signature } from "../_components/imagepath";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
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
import BackButton from "./Cards/BackButton";
import MainParentInvoice from "./Layouts/MainParentInvoice";
import Middleware from "../_components/Middleware";

const ViewOnlyInvoice = () => {
    const history = useHistory();
    const { controller,endpoint,id } = useParams();


    const [menu, setMenu] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [balance, setBalance] = useState(invoiceDetails?.grandTotal || 0);

    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [paymentMethod, setPaymentMethod] = useState("");
    const [notes, setNotes] = useState("");
    const [amount, setAmount] = useState("");
    const [selecetdbank, setSelectedbank] = useState("")
    // const [balance, setBalance] = useState(0);
    const [LastPaymentBalance, setLastPaymentBalance] = useState(0);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    const openDatePicker = () => {
        datepickerRef.setOpen(true);
    };
    const toggleMobileMenu = () => {
        setMenu(!menu);
    };

    const accountName = invoiceDetails?.bankDetails?.selectBank[0]?.accountName;
    const accountNumber =
        invoiceDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
    const branchName = invoiceDetails?.bankDetails?.selectBank[0]?.branchName;
    const IFSCCode = invoiceDetails?.bankDetails?.selectBank[0]?.IFSCCode;
    console.log("accountName", accountName);

    useEffect(() => {
        setBalance(invoiceDetails.payments);
    });

    const addressLine1 =
        invoiceDetails?.customerName?.billingAddress?.addressLine1;
    const addressLine2 =
        invoiceDetails?.customerName?.billingAddress?.addressLine2;
    const city = invoiceDetails?.customerName?.billingAddress?.city;
    const country = invoiceDetails?.customerName?.billingAddress?.country;
    const name = invoiceDetails?.customerName?.billingAddress?.name;
    const pincode = invoiceDetails?.customerName?.billingAddress?.pincode;
    const state = invoiceDetails?.customerName?.billingAddress?.state;
    const email = invoiceDetails?.customerName?.email;
    const customerID = invoiceDetails?.customerName?.customerId;
    const bankID = invoiceDetails?.bankDetails?.selectBank.bankId;

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/${controller}/${endpoint}/${id}`
                );
                setInvoiceDetails(response.data);

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

        fetchInvoiceDetails();
    }, [controller,endpoint,id]);

    const [customerEmail, setCustomerEmail] = useState(email);
    const invoiceData = invoiceDetails;

    useEffect(() => {
        setIsSaveDisabled(parseFloat(balance) === 0);
    }, [balance]);


    const invoiceid = invoiceDetails.invoiceId;

    const handleSavePayment = async () => {
        const paymentData = {
            invoiceId: id,
            customerid: customerID,
            bankId: selecetdbank,
            paymentAmount: paymentAmount,
            enteredamount: amount,
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
            toast.success("Invoice Added Succesfully", {
                position: toast.POSITION.TOP_RIGHT,
            });
            history.push("/invoice-list");
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

    const handleAmountChange = (e) => {
        const enteredAmount = e.target.value;
        setAmount(enteredAmount);

        const newBalance =
            parseFloat(LastPaymentBalance) - parseFloat(enteredAmount);

        setBalance(isNaN(newBalance) ? 0 : newBalance.toFixed(2));
    };

    const [invoiceDownloadLink, setInvoiceDownloadLink] = useState("");



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
                invoiceDetails?.bankDetails?.signatureImage?.url
            );
            const imageData = await response.blob();
            console.log("signature", response);
        } catch (error) {
            console.error("Error fetching signature image:", error);
        }
    };

    const [bankData, setBankData] = useState([]);

    const fetchbankData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/BankDeatils/bank-details"
            );
            console.log("BankData:", response.data);
            setBankData(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchbankData();
    }, []);

    const bankOptions =
        bankData &&
        bankData.map((bank) => ({
            id: bank.bankId,
            text: bank.branchName,
        }));

    const handleBankDetailsChange = (event) => {
        const value = event.target.value;
        setSelectedbank(value);
    };
    // useEffect(() => {
    //     const fetchInvoiceDetails = async () => {
    //       try {
    //         const response = await axios.get(
    //           `http://localhost:8000/api/addInvoice/invoicesforview/${id}`
    //         );
    //         setInvoiceDetails(response.data);

    //       } catch (e) {
    //         console.error("error", e)
    //       }
    //     }
    //     fetchInvoiceDetails()
    // },[])

    return (
        <Middleware invoiceDetails={invoiceDetails} />
       
    );
}

export default ViewOnlyInvoice
{/* <MainParentInvoice IFSCCode={IFSCCode} accountName={accountName} accountNumber={accountNumber} addressLine1={addressLine1} addressLine2={addressLine2} addressName={name} branchName={branchName} city={city} country={country} invoiceDetails={invoiceDetails} invoiceDate={invoiceDetails?.invoiceDate} invoiceRef={invoiceContentRef} invoiceNumber={invoiceDetails?.invoiceNumber} menu={menu} pincode={pincode} state={state} title={"Invoice"} /> */}