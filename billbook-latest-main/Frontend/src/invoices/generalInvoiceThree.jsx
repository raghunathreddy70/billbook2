import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoiceThree = ({ invoiceDetails }) => {
  const userData = useSelector((state) => state?.user?.userData);

  console.log("usefhju", userData?.data)
  const userProfileData = userData?.data;

  const queryParameters = new URLSearchParams(window.location.search);
  const date = queryParameters.get("date");
  console.log("date", date);
  const number = queryParameters.get("Number");
  const name = queryParameters.get("name");

  const phone = queryParameters.get("phone");
  const GSTNo = queryParameters.get("GSTNo");
  const addressLine1 = queryParameters.get("addressLine1");
  const addressLine2 = queryParameters.get("addressLine2");
  const city = queryParameters.get("city");
  const state = queryParameters.get("state");
  const country = queryParameters.get("country");
  const handleClick = (index) => {
    handleUpdate(index);
  };

  const [grandTotalInWords, setGrandTotalInWords] = useState("");

  useEffect(() => {
    if (invoiceDetails?.grandTotal) {
      const grandTotalWords = numberToWords(invoiceDetails.grandTotal);
      setGrandTotalInWords(grandTotalWords);
    }
  }, [invoiceDetails]);


  return (
    <>
      <div className="main-wrapper general-invoice-1">
        <div className="container">
          <div className="invoice-wrapper index-three">
            <div className="inv-content">
              <div className="invoice-header">
                <div className="inv-header-right">
                  <div className="invoice-title">INVOICE</div>
                </div>
              </div>
              <div className="invoiceeight-header">
                <div className="invoice-header-top">
                  <div className="inv-header-left">
                    <Link to="#">
                      <img src={userProfileData?.profileImage?.url} alt="Logo" />
                    </Link>
                  </div>
                  <div className="inv-header-right">
                    <div className="inv-details">
                      <div className="inv-date">
                        Invoice No: <span>{number}</span>
                      </div>
                      <div className="inv-date mb-0">
                        Date:<span>{new Date(date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="invoice-address">
                      <div className="invoice-to">
                        <h2 className="invoice-to-do-address-logo">Invoice To:</h2>
                        <div className="inv-to-address">
                          {name}
                          <br />
                          {invoiceDetails?.customerName?.email === undefined
                            ? " "
                            : `${invoiceDetails?.customerName?.email} `}
                          <br />
                          {invoiceDetails?.customerName?.phoneNumber === undefined
                            ? " "
                            : `${invoiceDetails?.customerName?.phoneNumber} `}

                          <span>
                            {invoiceDetails?.customerName?.billingAddress
                              ?.addressLine1 === undefined
                              ? " "
                              : `${invoiceDetails?.customerName?.billingAddress?.addressLine1} `}

                            {invoiceDetails?.customerName?.billingAddress
                              ?.addressLine2 === undefined
                              ? ""
                              : `${invoiceDetails?.customerName?.billingAddress?.addressLine2} `}
                          </span>
                          <span>
                            {invoiceDetails?.customerName?.billingAddress?.state ===
                              undefined
                              ? ""
                              : `${invoiceDetails?.customerName?.billingAddress?.state} `}
                            {invoiceDetails?.customerName?.billingAddress?.country ===
                              undefined
                              ? ""
                              : `${invoiceDetails?.customerName?.billingAddress?.country} `}
                          </span>
                          <span>
                            {invoiceDetails?.customerName?.billingAddress?.pincode ===
                              undefined
                              ? " "
                              : `${invoiceDetails?.customerName?.billingAddress?.pincode} `}
                          </span>
                        </div>
                      </div>
                      <div className="invoice-to">
                        <div className="invoice-to-do-address-logo">Pay To :</div>
                        <span className="company-name">{userProfileData?.businessName}</span>
                        <div className="gst-details">
                          <span>{userProfileData?.email}</span>
                          <span>{userProfileData?.phone}</span>
                          <span>{userProfileData?.gstNumber}</span>
                          <span>{userProfileData?.PANNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="invoice-table">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th className="table_width_1">Id</th>
                        <th className="table_width_2">Item</th>
                        <th className="table_width_3">Price</th>
                        <th className="table_width_4">Quantity</th>
                        <th className="table_width_5">Discount</th>
                        <th className="table_width_6">Tax</th>
                        <th className="table_width_7">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceDetails?.table &&
                        invoiceDetails?.table.map((item, index) => (
                          <tr key={index}>
                            <td className="table_width_1">{index + 1}</td>
                            <td className="table_width_1">{item.productName}</td>
                            <td className="table_width_1">{item.price}</td>
                            <td className="table_width_1">{item.quantity}</td>
                            <td className="table_width_5">{item.discount}%</td>
                            <td className="table_width_6">{item.gstRate}%</td>
                            <td className="table_width_7">{item.totalAmount}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="invoice-table-footer">
                <div className="table-footer-left notes">
                  <span />
                </div>
                <div className="text-end table-footer-right table-responsive-line">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          Total Tax (
                          {invoiceDetails?.totalTaxPercentage}%)
                        </td>
                        <td>{invoiceDetails?.totalTax}</td>
                      </tr>

                      <tr>
                        <td>
                          Total Discount (
                          {invoiceDetails?.totalDiscountPercentage}%)
                        </td>
                        <td>{invoiceDetails?.totalDiscount}</td>
                      </tr>
                      <tr>
                        <td>
                          CGST Amount ({invoiceDetails?.cgstTaxPercentage}%)
                        </td>
                        <td>{invoiceDetails?.cgstTaxAmount}</td>
                      </tr>
                      <tr>
                        <td>
                          SGST Amount ({invoiceDetails?.sgstTaxPercentage}%)
                        </td>
                        <td>{invoiceDetails?.sgstTaxAmount}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
              <div className="invoice-table-footer footer-table">
                <div className="table-footer-left notes">
                  {invoiceDetails?.table &&
                    invoiceDetails.table?.length > 0 && (
                      <p className="total-info d-flex justify-content-evenly ">
                        <span className="invoice-title heading-table-cheat">Total Items:</span> {invoiceDetails?.table.length}

                      </p>
                    )}{" "}
                </div>
                <div className="table-responsive-line table-footer-right">
                  <table>
                    <tbody>
                      <tr>
                        <td className="invoice-title heading-table-cheat">Total Amount(in words)</td>
                        <td className="invoice-title">
                          {grandTotalInWords}
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
                <div className="text-end table-footer-right table-responsive-line">
                  <table>
                    <tbody>
                      <tr>
                        <td className="invoice-title heading-table-cheat">Total</td>
                        <td className="invoice-title">{invoiceDetails?.grandTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>



              <div className="bank-details">
                <div className="account-info">
                  {invoiceDetails?.bankDetails?.selectBank.length > 0 && (
                    <>
                      <span className="bank-title">Bank Details</span>
                      <div className="account-details-infotop">
                        <div className="account-details">
                          Bank :{" "}
                          <span>
                            {
                              invoiceDetails?.bankDetails?.selectBank[0]
                                ?.accountName
                            }
                          </span>
                        </div>
                        <div className="account-details">
                          IFSC :{" "}
                          <span>
                            {invoiceDetails?.bankDetails?.selectBank[0]?.IFSCCode}
                          </span>
                        </div>
                      </div>
                      <div className="account-details-infotop">
                        <div className="account-details">
                          Account # :
                          <span>
                            {
                              invoiceDetails?.bankDetails?.selectBank[0]
                                ?.bankAccountNumber
                            }
                          </span>
                        </div>
                        <div className="account-details">
                          BRANCH :{" "}
                          <span>
                            {invoiceDetails?.bankDetails?.selectBank[0]?.branchName}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="company-sign">
                  <img src={invoiceDetails?.bankDetails?.signatureImage?.url} alt="" />
                  <span className="text-center">Signature</span>
                </div>
              </div>
              <div className="invoice-footer">
                <div className="thanks-msg">
                  <span>Notes:</span>
                  {invoiceDetails?.bankDetails?.notes}
                </div>
                <div className="terms-condition">
                  <span>Terms and Conditions:</span>
                  <>
                    {invoiceDetails?.bankDetails?.termsAndConditions.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralInvoiceThree;
