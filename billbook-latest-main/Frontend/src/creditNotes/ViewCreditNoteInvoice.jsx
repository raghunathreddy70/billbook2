import React, { useState, useEffect, useRef } from "react";
import FeatherIcon from "feather-icons-react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import MainParentInvoice from "../invoices/Layouts/MainParentInvoice";
import { backendUrl } from "../backendUrl";


const ViewCreditNoteInvoice = () => {


    const { id } = useParams();
    const [menu, setMenu] = useState(false);
    const [creditNotesDetails, setcreditNotesDetails] = useState([]);

    const [paymentAmount, setPaymentAmount] = useState("");
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState(0);
    const [LastPaymentBalance, setLastPaymentBalance] = useState(0);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);


    const accountName = creditNotesDetails?.bankDetails?.selectBank[0]?.accountName;
    const accountNumber =
        creditNotesDetails?.bankDetails?.selectBank[0]?.bankAccountNumber;
    const branchName = creditNotesDetails?.bankDetails?.selectBank[0]?.branchName;
    const IFSCCode = creditNotesDetails?.bankDetails?.selectBank[0]?.IFSCCode;



    const addressLine1 =
        creditNotesDetails?.customerName?.billingAddress?.addressLine1;
    const addressLine2 =
        creditNotesDetails?.customerName?.billingAddress?.addressLine2;
    const city = creditNotesDetails?.customerName?.billingAddress?.city;
    const country = creditNotesDetails?.customerName?.billingAddress?.country;
    const name = creditNotesDetails?.customerName?.billingAddress?.name;
    const pincode = creditNotesDetails?.customerName?.billingAddress?.pincode;
    const state = creditNotesDetails?.customerName?.billingAddress?.state;
    const email = creditNotesDetails?.customerName?.email;
    const customerID = creditNotesDetails?.customerName?.customerId;

    useEffect(() => {
        const fetchCreditnotesDetails = async () => {
            try {
                const response = await axios.get(
                     `${backendUrl}/api/creditNotes/creditNotesforview/${id}`
                );
                setcreditNotesDetails(response.data);
                const lastPaymentBalance =
                    response.data.payments.length > 0
                        ? response.data.payments[response.data.payments.length - 1].balance
                        : response.data.grandTotal;

                // Set the balance to a separate variable
                setLastPaymentBalance(lastPaymentBalance);
                setPaymentAmount(response.data.grandTotal);
                console.log("Fetched creditNotes Details:", response.data);
            } catch (error) {
                console.error("Error fetching creditNotes details:", error);
            }
        };

        fetchCreditnotesDetails();
    }, [id]);


    useEffect(() => {
        setIsSaveDisabled(parseFloat(balance) === 0);
    }, [balance]);



    useEffect(() => {
        setIsSaveDisabled(false);
    }, [amount]);

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
                creditNotesDetails?.bankDetails?.signatureImage?.url
            );
            const imageData = await response.blob();
            console.log("signature", response);
        } catch (error) {
            console.error("Error fetching signature image:", error);
        }
    };



    return (
        <MainParentInvoice IFSCCode={IFSCCode} accountName={accountName} accountNumber={accountNumber} addressLine1={addressLine1} addressLine2={addressLine2} addressName={name} branchName={branchName} city={city} country={country} invoiceDetails={creditNotesDetails} invoiceDate={creditNotesDetails?.creditnotesDate} invoiceRef={invoiceContentRef} invoiceNumber={creditNotesDetails?.creditnotesNumber} menu={menu} pincode={pincode} state={state} title={"Credit Notes"} />
    )
}

export default ViewCreditNoteInvoice