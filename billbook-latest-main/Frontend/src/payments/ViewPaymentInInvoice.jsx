import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

const ViewPaymentInInvoice = () => {

    const { id } = useParams();
    const [menu, setMenu] = useState(false);
    const [creditNotesDetails, setcreditNotesDetails] = useState([]);

    const name = creditNotesDetails?.customerName?.name;
    const email = creditNotesDetails?.customerName?.email;
    const customerID = creditNotesDetails?.customerName?.customerId;

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
            {creditNotesDetails.paymentDate &&
                <div className="w-full bg-white flex justify-center invoice-print">
                    <div className={`print-only-section  h-full ${menu ? "slide-nav" : ""}`}>
                        <div className="row justify-content-center">
                            <div className="col-lg-12">
                                <div className="card !shadow-none">
                                    <div className="card-body">
                                        <div className="card-table">
                                            <div className="card-body">
                                                {/* Invoice Logo */}
                                                <div className="invoice-item invoice-item-one">
                                                    <div className="row align-items-center">
                                                        <div className="col-md-6">
                                                            <div className="invoice-logo">
                                                                <img src="/logo1Webp.webp" alt="logo" />
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
            }
        </>
    )
}

export default ViewPaymentInInvoice